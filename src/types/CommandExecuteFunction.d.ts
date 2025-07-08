import type {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'
import type { i18n } from 'i18next'

import type { BotClient } from '@/helpers/botClient'

/**
 * Represents a function that executes a slash command
 */
export type CommandExecuteFunction = (
  interaction?: ChatInputCommandInteraction,
  client?: BotClient,
  i18next?: i18n
) => Promise<unknown>

export type ContextMenuExecuteFunction = (
  interaction?: ContextMenuCommandInteraction,
  client?: BotClient,
  i18next?: i18n
) => Promise<void>

export type UserContextExecuteFunction = (
  interaction?: UserContextMenuCommandInteraction,
  client?: BotClient,
  i18next?: i18n
) => Promise<unknown>

export type MessageContextExecuteFunction = (
  interaction?: MessageContextMenuCommandInteraction,
  client?: BotClient,
  i18next?: i18n
) => Promise<unknown>

/**
 * Represents an autocomplete interaction, mainly used for slash command autocompletion
 */
export type AutocompleteExecuteFunction = (
  interaction?: AutocompleteInteraction,
  client?: BotClient,
  i18next?: i18n
) => Promise<void>
