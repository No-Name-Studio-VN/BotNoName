import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  GuildMember
} from 'discord.js'
import type { i18n } from 'i18next'

import { adminIds } from '@/config/SuperUser'
import { cacheGet, cacheSet } from '@/handlers/redis'
import type { BotClient } from '@/helpers/botClient'
import { handleError } from '@/helpers/botUtils'
import { BotNoPermissionEmbed, ErrorEmbed, UserNoPermissionEmbed } from '@/helpers/embedTemplate'
import { parsePermissions } from '@/helpers/permissions'
import { timeformat } from '@/helpers/time'
import { isAdmin } from '@/helpers/validation'
import type { GuildDocument } from '@/models/guild.model'
import { getGuildCommandSettings } from '@/services/command.guild.service'
import type { ContextCommand, SlashCommand } from '@/types/Command'

import logger from './logger'

async function preExecuteChecks(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
  command: SlashCommand | ContextCommand,
  data: GuildDocument,
  i18next: i18n
) {
  // Check cooldown
  if (command.cooldown > 0) {
    const remaining = await getRemainingCooldown(interaction.user.id, command, command.cooldown)
    if (remaining > 0) {
      return {
        canExecute: false,
        errorResponse: interaction.reply({
          content: `You are on cooldown. You can again use the command in \`${timeformat(remaining)}\``,
          ephemeral: true
        })
      }
    }
    await applyCooldown(interaction.user.id, command)
  }

  // Check owner-only restriction
  if (command.ownerOnly && !adminIds.includes(interaction.user.id)) {
    return {
      canExecute: false,
      errorResponse: ErrorEmbed(interaction, {
        description: i18next.t('ownerOnly'),
        footer: i18next.t('errorOccurred')
      })
    }
  }

  // Validate permissions and restrictions for guild commands
  if (interaction.guild) {
    const validationResult = await validateGuildCommand(interaction, command, data, i18next)
    if (!validationResult.canExecute) {
      return validationResult
    }
  }

  return { canExecute: true }
}

export async function handleContextCommand(
  interaction: ContextMenuCommandInteraction,
  command: ContextCommand,
  data: GuildDocument,
  client: BotClient,
  i18next: i18n
) {
  const preExecuteResult = await preExecuteChecks(interaction, command, data, i18next)
  if (!preExecuteResult.canExecute) {
    return preExecuteResult.errorResponse
  }

  // Execute command
  try {
    await command.execute(interaction, client, i18next)
  } catch (err) {
    logger.error(`Error executing context command ${command.name}:`, err)
    return handleError(err as Error, 'executeContextCommand')
  }
}

export async function handleSlashCommand(
  interaction: ChatInputCommandInteraction,
  command: SlashCommand,
  data: GuildDocument,
  client: BotClient,
  i18next: i18n
) {
  const preExecuteResult = await preExecuteChecks(interaction, command, data, i18next)
  if (!preExecuteResult.canExecute) {
    return preExecuteResult.errorResponse
  }

  // Execute command
  try {
    if (command.userexecute && shouldDoUserExecute(interaction, command)) {
      await command.userexecute(interaction, client, i18next)
    } else {
      await command.execute(interaction, client, i18next)
    }
  } catch (err) {
    logger.error(`Error executing command ${command.name}:`, err)
    return handleError(err as Error, 'executeCommand')
  }
}

/**
 * Validate guild-specific command restrictions and permissions
 */
async function validateGuildCommand(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
  command: SlashCommand | ContextCommand,
  data: GuildDocument,
  i18next: i18n
) {
  const { guild, member } = interaction
  if (!guild || !(member instanceof GuildMember)) return { canExecute: true } // Should not happen in guild
  const isUserAdmin = await isAdmin(guild, member, data.manager_roles)

  // Check if command is disabled (only for non-admins)
  if (!isUserAdmin) {
    const cmdslist = await getGuildCommandSettings({ guildId: guild.id })
    if (cmdslist?.commands.find((i) => i.name === command.name.toLowerCase())?.status === false) {
      return {
        canExecute: false,
        errorResponse: ErrorEmbed(interaction, { description: i18next.t('commandDisabled') })
      }
    }
  }

  // Check user permissions
  if (member && command.userPermissions?.length > 0) {
    const hasPermission = member.permissions.has(command.userPermissions)
    const isOwner = adminIds.includes(interaction.user.id)

    if (!hasPermission && !isOwner) {
      return {
        canExecute: false,
        errorResponse: UserNoPermissionEmbed(interaction, i18next, {
          permission: parsePermissions(command.userPermissions)
        })
      }
    }
  }

  // Check bot permissions
  if (command.botPermissions?.length > 0) {
    if (!guild.members.me?.permissions.has(command.botPermissions)) {
      return {
        canExecute: false,
        errorResponse: BotNoPermissionEmbed(interaction, i18next, {
          permission: parsePermissions(command.botPermissions)
        })
      }
    }
  }

  return { canExecute: true }
}

/**
 * This will handle the autocomplete request and execute the function
 */
export async function handleAutoComplete(
  interaction: AutocompleteInteraction,
  command: SlashCommand,
  data: object,
  client: BotClient,
  i18next: i18n
) {
  if (!command?.autocomplete) return
  try {
    command.autocomplete(interaction, client, i18next)
  } catch (err) {
    logger.error(`Error in autocomplete for command ${command.name}:`, err)
    return interaction.respond([{ name: 'There is an error executing your search', value: '' }])
  }
}

/**
 * Apply the cooldown for the user
 */
async function applyCooldown(memberId: string, cmd: { name: string; cooldown: number }) {
  const key = cmd.name + '|' + memberId
  await cacheSet(key, Date.now(), cmd.cooldown)
}

/**
 * Get the remaining cooldown for the user
 */
async function getRemainingCooldown(memberId: string, cmd: { name: string; cooldown: number }, timeout: number = 0) {
  const key = cmd.name + '|' + memberId
  const cachedValue = await cacheGet(key)
  if (cachedValue) {
    const remaining = (Date.now() - Number(cachedValue)) * 0.001
    return timeout - remaining
  }
  return 0
}
/**
 * Check if the command can be executed using userexecute
 */
function shouldDoUserExecute(interaction: ChatInputCommandInteraction, command: SlashCommand) {
  if (!command.userexecute) return false

  const authOwners = interaction.authorizingIntegrationOwners
  const isDM = authOwners[0] === '0'
  const isUserInstall = !authOwners[0] && authOwners[1] === interaction.user.id

  return isDM || isUserInstall
}
