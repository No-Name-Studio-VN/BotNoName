import { exec } from 'child_process'
import { DiscordAPIError, version as discordJsVersion } from 'discord.js'
import fs from 'fs'
import os from 'os'
import path from 'path'
import util from 'util'

// Local imports
import { dashboard, interactionCommand, messageCommand, messageIntent } from '@/config/index'
import logger from '@/handlers/logger'
import { cacheGet, cacheSet } from '@/handlers/redis'
import envConfig from '@/lib/env'
import { author, version as localPackageVersion } from '~/package.json'

import type { BotClient } from './botClient'

const execAsync = util.promisify(exec)
export const isProduction = envConfig.NODE_ENV === 'production'
export const osVersion = os.version()
export const packageVersion = localPackageVersion || 'unknown'

// Add file search cache
const fileSearchCache = new Map()

// Memoize i18n merges
const i18nMemoCache = new Map()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mergeI18nData(cmd: any, i18nData: any) {
  if (!i18nData) return cmd

  const cacheKey = `${JSON.stringify(cmd)}_${JSON.stringify(i18nData)}`
  if (i18nMemoCache.has(cacheKey)) {
    return i18nMemoCache.get(cacheKey)
  }

  const result = {
    ...cmd,
    nameLocalizations: i18nData.name,
    descriptionLocalizations: i18nData.description,
    options: cmd.options && i18nData.options ? await mergeOptions(cmd.options, i18nData.options) : cmd.options
  }

  i18nMemoCache.set(cacheKey, result)
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mergeOptions(options: Array<any>, i18nOptions: Array<any>) {
  // Create Map for O(1) lookups
  const i18nOptionsMap = new Map(i18nOptions.map((opt) => [opt.id, opt]))

  return Promise.all(
    options.map(async (option) => {
      const i18nOption = i18nOptionsMap.get(option.name)
      if (i18nOption) {
        option = await mergeI18nData(option, i18nOption)
      }
      if (option.options) {
        option.options = await mergeOptions(option.options, i18nOptions)
      }
      return option
    })
  )
}

/**
 * Writes command list to storage with error handling
 */
let commandListWriteTimeout: NodeJS.Timeout | undefined

export async function writeCommandList(client: BotClient, data: object): Promise<void> {
  const filePath = './store/commandList.json'

  // Clear existing timeout
  if (commandListWriteTimeout) {
    clearTimeout(commandListWriteTimeout)
  }

  // Buffer writes with 1 second delay
  return new Promise<void>((resolve, reject) => {
    commandListWriteTimeout = setTimeout(async () => {
      try {
        // Ensure directory exists
        const dir = path.dirname(filePath)
        await fs.promises.mkdir(dir, { recursive: true })

        const jsonString = JSON.stringify(data, null, isProduction ? 0 : 2)
        await fs.promises.writeFile(filePath, jsonString, 'utf8')
        logger.info(`Saved commands to ${filePath}`)
        resolve()
      } catch (error) {
        logger.error('Failed to save commands:', error)
        reject(error instanceof Error ? error : new Error(String(error)))
      }
    }, 1000)
  })
}

/**
 * Recursively searches for files in directory
 * @param {string} dirPath - Directory path to search
 */
export async function searchFilesInDirectory(dirPath: string) {
  // Check cache first
  if (fileSearchCache.has(dirPath)) {
    return fileSearchCache.get(dirPath)
  }

  const files: string[] = []
  try {
    const entries = await fs.promises.readdir(dirPath)

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry)
        const stats = await fs.promises.stat(fullPath)

        if (stats.isDirectory()) {
          const subFiles = await searchFilesInDirectory(fullPath)
          files.push(...subFiles)
        } else {
          files.push(entry)
        }
      })
    )

    // Cache results
    fileSearchCache.set(dirPath, files)
    return files
  } catch (error) {
    logger.error(`File search failed in ${dirPath}:`, error)
    throw error
  }
}

export async function getBotStats(client: BotClient) {
  const stats = {
    environment: envConfig.NODE_ENV,
    bot: {
      username: client?.user?.username ?? 'N/A',
      id: client?.user?.id ?? envConfig[isProduction ? 'CLIENT_ID_Prod' : 'CLIENT_ID_Test']
    },
    system: {
      author: author.name,
      versions: {
        discord: discordJsVersion,
        node: process.version,
        os: osVersion
      }
    },
    features: {
      messageIntent: { enabled: messageIntent },
      messageCommand: {
        enabled: messageCommand,
        count: client?.messageCommands?.size ?? 0
      },
      interactionCommand: {
        enabled: interactionCommand,
        count: client?.slashCommands?.size ?? 0
      },
      dashboard: { enabled: dashboard }
    }
  }
  return stats
}

export async function getOpenSourcePackages() {
  const cacheKey = 'openSourcePackages'
  const cached = await cacheGet(cacheKey)
  if (cached) return cached

  const { stdout } = await execAsync('npm list --json --depth=0')
  const { dependencies } = JSON.parse(stdout)
  await cacheSet(cacheKey, dependencies, 86400)
  return dependencies
}

export const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - Math.ceil(min) + 1)) + Math.ceil(min)

const ERROR_CODES = {
  CHANNEL_NOT_FOUND: 10003,
  MESSAGE_DELETED: 10008,
  UNKNOWN_INTERACTION: 10062,
  MISSING_ACCESS: 50001,
  MISSING_PERMISSIONS: 50013
}

const ERROR_CODE_MAP = new Set(Object.values(ERROR_CODES))

export function handleError(error: Error, context: string = 'N/A') {
  if (error instanceof DiscordAPIError) {
    const code = typeof error.code === 'number' ? error.code : Number(error.code)
    const isKnownError = ERROR_CODE_MAP.has(code)
    const errorMessage = isKnownError ? Object.entries(ERROR_CODES).find(([, c]) => c === code)?.[0] : error.message
    logger.error(`${context} | ${errorMessage}`)
  } else {
    logger.error(`${context}:`, error)
  }
  return error
}
