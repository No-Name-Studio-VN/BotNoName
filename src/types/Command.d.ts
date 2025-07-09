import {
  ApplicationCommandData,
  ApplicationCommandOptionData,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  PermissionsString
} from 'discord.js'

import type {
  AutocompleteExecuteFunction,
  CommandExecuteFunction,
  MessageContextExecuteFunction,
  UserContextExecuteFunction
} from './CommandExecuteFunction'

/**
 * Represents a complete command by combining Discord.js ApplicationCommandData with our custom extensions
 */
export interface BaseCommand extends ApplicationCommandData {
  /** The name of the command */
  name: string
  /** A description of what the command does */
  description?: string
  /** Alternative names for the command */
  aliases?: string[]
  /** Examples or syntax for using the command */
  usage?: string
  /** The category this command belongs to */
  category?: string
  /** Cooldown period in seconds between command uses */
  cooldown: number
  /** Whether the command is restricted to bot owners, defaults to false */
  ownerOnly?: boolean
  /** Permissions the bot needs to execute this command */
  botPermissions?: PermissionsString[]
  /** Permissions the user needs to execute this command */
  userPermissions?: PermissionsString[]
  /** Contexts where the command can be used */
  contexts: InteractionContextType[]
  /** Installation contexts where the command is available */
  integration_types: ApplicationIntegrationType[]
  /** Command options/arguments */
  options?: ApplicationCommandOptionData[]
  /** The type of command */
  type: ApplicationCommandType
}

export interface SlashCommand extends BaseCommand {
  /** The type of command, defaults to 1 (CHAT_INPUT) */
  type: ApplicationCommandType.ChatInput
  /** The function that executes when the command is called */
  execute: CommandExecuteFunction
  /** It is used to provide autocomplete suggestions for the autocomplete option */
  autocomplete?: AutocompleteExecuteFunction
  /** Alternative execute function for user-specific logic */
  userexecute?: CommandExecuteFunction
}

export interface ContextCommand extends BaseCommand {
  type: ApplicationCommandType.Message | ApplicationCommandType.User
  /** The function that executes when the command is called */
  execute: ContextMenuExecuteFunction
}

export interface MessageContextCommand extends ContextCommand {
  type: ApplicationCommandType.Message
  /** The function that executes when the command is called */
  execute: MessageContextExecuteFunction
}

export interface UserContextCommand extends ContextCommand {
  type: ApplicationCommandType.User
  /** The function that executes when the command is called */
  execute: UserContextExecuteFunction
}
