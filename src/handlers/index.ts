import type { ApplicationCommandDataResolvable } from 'discord.js'
import fs from 'fs/promises'
import { isEmpty } from 'lodash-es'
import path from 'path'

import { cmdI18n } from '@/config/CommandLocalization'
import * as config from '@/config/index'
import { serverIds as adminserverIds } from '@/config/SuperUser'
import type { BotClient } from '@/helpers/botClient'
import { mergeI18nData, writeCommandList } from '@/helpers/botUtils'
import { getGuildCommandSettings } from '@/services/command.guild.service'
import { BaseCommand } from '@/types/Command'

import logger from './logger'

// --- Constants ---
const EVENTS_BASE_DIR = path.resolve(process.cwd(), 'src/events')
const CONTEXT_COMMANDS_BASE_DIR = path.resolve(process.cwd(), 'src/commands/context')
const SLASH_COMMANDS_BASE_DIR = path.resolve(process.cwd(), 'src/commands/slash')

// --- Cached Values ---
const commandLocalizationsMap = new Map(cmdI18n.map((item) => [item.id, item]))

const isScriptFile = (file: string): boolean => file.endsWith('.js') || file.endsWith('.ts')

/**
 * Loads regular event handlers from a specified directory.
 */
async function loadRegularEventsFromDirectory(client: BotClient, directoryPath: string): Promise<number> {
  const directoryName = path.basename(directoryPath)

  try {
    const files = await fs.readdir(directoryPath)
    const eventFiles = files.filter(isScriptFile)

    if (eventFiles.length === 0) {
      logger.debug(`No event files found in ${directoryName}`)
      return 0
    }

    const loadPromises = eventFiles.map(async (file) => {
      try {
        const eventModule = await import(path.join(directoryPath, file))
        const eventName = path.parse(file).name
        const eventHandler = eventModule.default || eventModule
        client.on(eventName, (...args) => eventHandler(client, ...args))
        logger.debug(`Loaded event: ${eventName} from ${directoryName}`)
        return 1
      } catch (error) {
        logger.error(`Failed to load event ${file} from ${directoryName}:`, error)
        return 0
      }
    })

    const results = await Promise.all(loadPromises)
    return results.reduce((sum: number, count: number): number => sum + count, 0)
  } catch (error) {
    logger.error(`Failed to read directory ${directoryName}:`, error)
    return 0
  }
}

/**
 * Loads all event handlers for the bot.
 */
async function loadEvents(client: BotClient): Promise<number> {
  logger.info('Loading event handlers...')

  try {
    const eventDirectories = await fs.readdir(EVENTS_BASE_DIR)
    const loadPromises = eventDirectories.map(async (directory) => {
      const directoryPath = path.resolve(EVENTS_BASE_DIR, directory)
      const stats = await fs.lstat(directoryPath)
      const isDirectory = await stats.isDirectory()
      if (!isDirectory) return 0

      if (directory === 'distube') {
        logger.debug(`Skipping distube directory processing`)
        return 0
      }
      return await loadRegularEventsFromDirectory(client, directoryPath)
    })

    const results = await Promise.all(loadPromises)
    const totalLoadedCount = results.reduce((sum, count) => sum + count, 0)

    logger.info(`Successfully loaded a total of ${totalLoadedCount} event handlers.`)
    return totalLoadedCount
  } catch (error) {
    logger.error('Failed to load event handlers:', error)
    throw error
  }
}

/**
 * Processes localization, permissions, and type-specific adjustments for a command.
 */
async function processCommand(command: BaseCommand): Promise<BaseCommand> {
  const processedCommand = { ...command }

  // Apply localization
  const localizationData = commandLocalizationsMap.get(processedCommand.name)
  if (localizationData) {
    Object.assign(processedCommand, await mergeI18nData(processedCommand, localizationData))
  }

  // Remove description for specific command types (e.g., user or message commands)
  if (processedCommand.type && [2, 3].includes(processedCommand.type)) {
    delete processedCommand.description
  }

  return processedCommand
}

/**
 * Processes and loads commands from a specified directory.
 */
async function processCommands<T extends BaseCommand>(
  client: BotClient,
  commandType: 'slash' | 'context',
  baseDir: string,
  commandCollection: Map<string, T>
) {
  const categorizedCommands: {
    regular: T[]
    admin: T[]
    withDirs: Array<{ folder: string; files: T[] }>
  } = {
    regular: [],
    admin: [],
    withDirs: []
  }

  try {
    const commandDirectories = await fs.readdir(baseDir)

    const processPromises = commandDirectories.map(async (directory) => {
      const directoryPath = path.join(baseDir, directory)

      try {
        const stats = await fs.stat(directoryPath)
        if (!stats.isDirectory()) return null
        const commandsInDirectory: T[] = []
        const adminCommands: T[] = []
        const regularCommands: T[] = []

        const files = await fs.readdir(directoryPath)
        const commandFiles = files.filter(isScriptFile)

        const filePromises = commandFiles.map(async (file) => {
          try {
            const commandModule = await import(path.join(directoryPath, file))
            let commandHandler: T = commandModule.default || commandModule
            if (!commandHandler || isEmpty(commandHandler.name)) {
              logger.warn(
                `A ${commandType} command file ${file} in category ${directory} is missing a name and will be skipped.`
              )
              return null
            }

            commandHandler = (await processCommand(commandHandler)) as T
            commandCollection.set(commandHandler.name, commandHandler)

            logger.debug(`Processed ${commandType} command: ${commandHandler.name} from category ${directory}`)
            return commandHandler
          } catch (error) {
            logger.error(`Error processing ${commandType} command file ${file} in ${directory}:`, error)
            return null
          }
        })

        const results = await Promise.all(filePromises)

        for (const command of results) {
          if (!command) continue

          commandsInDirectory.push(command)
          if (command.category === 'ADMIN' || command.ownerOnly) {
            adminCommands.push(command)
          } else {
            regularCommands.push(command)
          }
        }

        logger.debug(
          `Processed ${commandType} commands from category ${directory}. Count: ${commandsInDirectory.length}`
        )
        return { commands: commandsInDirectory, adminCommands, regularCommands }
      } catch (error) {
        logger.error(`Failed to stat directory ${directory}:`, error)
        return { commands: [], adminCommands: [], regularCommands: [] }
      }
    })

    const results = await Promise.all(processPromises)

    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (!result) continue

      const directory = commandDirectories[i]
      categorizedCommands.regular.push(...result.regularCommands)
      categorizedCommands.admin.push(...result.adminCommands)
      categorizedCommands.withDirs.push({ folder: directory, files: result.commands })
    }

    logger.info(
      `Processed ${categorizedCommands.regular.length} regular and ${categorizedCommands.admin.length} admin ${commandType} commands.`
    )
    return categorizedCommands
  } catch (error) {
    logger.error(`Failed to process ${commandType} commands:`, error)
    throw error
  }
}

/**
 * Registers all application commands globally and for specific "super user" servers.
 */
async function registerAllCommands(
  client: BotClient,
  allCommands: {
    regular: BaseCommand[]
    admin: BaseCommand[]
    withDirs: Array<{ folder: string; files: BaseCommand[] }>
  }
): Promise<void> {
  logger.info('Registering all commands...')

  try {
    const registrationPromises = [
      writeCommandList(client, allCommands.withDirs),
      client.application?.commands.set(allCommands.regular as ApplicationCommandDataResolvable[]),
      ...adminserverIds.map((serverId) =>
        client.guilds.cache
          .get(serverId)
          ?.commands.set(allCommands.admin as ApplicationCommandDataResolvable[])
          .catch((error) => {
            logger.warn(`Failed to register admin commands for server ${serverId}:`)
            console.error(error)
          })
      )
    ]

    await Promise.all(registrationPromises)
    logger.info('Successfully registered all commands.')
    await updateGuildCommandSettings(client, allCommands.regular)
  } catch (error) {
    logger.error('Failed to register commands:', error)
    throw error
  }
}

/**
 * Updates the command settings for all guilds the bot is in.
 */
async function updateGuildCommandSettings(client: BotClient, commands: Array<BaseCommand>): Promise<void> {
  logger.info('Updating guild command settings...')

  const updatePromises = client.guilds.cache.map(async (guild) => {
    try {
      const settings = await getGuildCommandSettings({ guildId: guild.id })
      const existingCommands = new Set(settings.commands.map((cmd) => cmd.name))
      const newCommands = commands
        .filter((command) => !existingCommands.has(command.name.toLowerCase()))
        .map((command) => ({ name: command.name.toLowerCase(), status: true }))

      if (newCommands.length > 0) {
        settings.commands.push(...newCommands)
        await settings.save()
        logger.debug(`Updated command settings for guild ${guild.id}: Added ${newCommands.length} new commands.`)
      }
    } catch (error) {
      logger.error(`Failed to save command settings for guild ${guild.id}:`, error)
    }
  })

  await Promise.all(updatePromises)
  logger.info('Guild command settings update process completed.')
}

export default async (client: BotClient): Promise<void> => {
  logger.info('Initializing bot handlers...')

  try {
    if (config.interactionCommand) {
      logger.info('Interaction commands are enabled. Processing commands...')

      // Load both command types first
      const slashCommands = await processCommands(client, 'slash', SLASH_COMMANDS_BASE_DIR, client.slashCommands)
      const contextCommands = await processCommands(
        client,
        'context',
        CONTEXT_COMMANDS_BASE_DIR,
        client.contextCommands
      )

      // Merge both command types
      const allCommands = {
        regular: [...slashCommands.regular, ...contextCommands.regular],
        admin: [...slashCommands.admin, ...contextCommands.admin],
        withDirs: [...slashCommands.withDirs, ...contextCommands.withDirs]
      }

      // Register all commands together when client is ready
      client.on('ready', async () => {
        await registerAllCommands(client, allCommands)
      })
    }

    await loadEvents(client)
    logger.info('All bot handlers initialized successfully.')
  } catch (error) {
    logger.error('Handler initialization failed:', error)
    throw error
  }
}
