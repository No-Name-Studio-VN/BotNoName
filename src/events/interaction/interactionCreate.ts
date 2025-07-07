import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Interaction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction
} from 'discord.js'
import { InteractionType } from 'discord.js'

import { interactionCommand } from '@/config'
import { handleAutoComplete, handleContextCommand, handleSlashCommand } from '@/handlers/command'
import logger from '@/handlers/logger'
import type { BotClient } from '@/helpers/botClient'
import { i18nInit } from '@/helpers/i18n'
import { getGuild } from '@/services/guild.service'

const isSlashCommand = (interaction: Interaction): interaction is ChatInputCommandInteraction =>
  interaction.type === InteractionType.ApplicationCommand &&
  !interaction.isPrimaryEntryPointCommand() &&
  interaction.isChatInputCommand()

const isContextMenuCommand = (
  interaction: Interaction
): interaction is MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction =>
  interaction.type === InteractionType.ApplicationCommand &&
  !interaction.isPrimaryEntryPointCommand() &&
  interaction.isContextMenuCommand()

const initializeCommandContext = async (
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | AutocompleteInteraction
) => {
  const guildData = interaction.guild ? await getGuild({ guildId: interaction.guild.id }) : null
  const language = await i18nInit({ guild: interaction.guild, user: interaction.user })
  return { guildData, language }
}

const handleSlashCommandInteraction = async (client: BotClient, interaction: ChatInputCommandInteraction) => {
  const command = client.slashCommands.get(interaction.commandName)
  if (!command || !interactionCommand) return

  const { guildData, language } = await initializeCommandContext(interaction)
  await handleSlashCommand(interaction, command, guildData, client, language)
}

const handleContextCommandInteraction = async (client: BotClient, interaction: ContextMenuCommandInteraction) => {
  const command = client.contextCommands.get(interaction.commandName)
  if (!command || !interactionCommand) return

  const { guildData, language } = await initializeCommandContext(interaction)
  await handleContextCommand(interaction, command, guildData, client, language)
}

export default async (client: BotClient, interaction: Interaction) => {
  try {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const command = client.slashCommands.get(interaction.commandName)
      if (!command || !interactionCommand) return

      const { guildData, language } = await initializeCommandContext(interaction)
      await handleAutoComplete(interaction, command, guildData, client, language)
    } else if (interaction.isButton()) {
      console.log('Button interaction received:', interaction.customId)
    } else if (interaction.isStringSelectMenu()) {
      console.log('Select menu interaction received:', interaction.customId)
    } else if (isSlashCommand(interaction)) {
      await handleSlashCommandInteraction(client, interaction)
    } else if (isContextMenuCommand(interaction)) {
      await handleContextCommandInteraction(client, interaction)
    } else {
      logger.debug('Unhandled interaction type')
    }
  } catch (error) {
    logger.error('Error handling interaction:', error)
  }
}
