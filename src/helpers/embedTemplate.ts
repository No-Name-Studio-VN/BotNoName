import type { ChatInputCommandInteraction, ContextMenuCommandInteraction } from 'discord.js'
import { APIEmbedField, ColorResolvable, EmbedBuilder, Message, MessageFlags } from 'discord.js'
import { isEmpty } from 'lodash-es'

import { isUrl } from '@/helpers/validation'

const EMBED_COLORS = {
  Error: 'Red',
  Success: 'Green',
  Info: 'Blue',
  Warning: 'Yellow'
} as const

interface EmbedOptions {
  title?: string
  description?: string
  color?: ColorResolvable
  fields?: APIEmbedField[]
  footer?: string
  image?: string
  thumbnail?: string
  author?: string
  ephemeral?: boolean
  method?: 'edit' | 'reply'
  duration?: number
}

interface I18nextTranslation {
  t: (key: string) => string
}

/**
 * A utility class for creating and sending Discord embeds
 */
class Embed {
  private interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message
  private title?: string
  private description?: string
  private color?: ColorResolvable
  private fields?: APIEmbedField[]
  private footer?: string
  private image?: string
  private thumbnail?: string
  private author?: string
  private ephemeral: boolean
  private method: 'edit' | 'reply'
  private duration: number

  /**
   * Creates an embed instance
   */
  constructor(
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
    options: EmbedOptions = {}
  ) {
    const {
      title,
      description,
      color = 'Blurple',
      fields,
      footer,
      image,
      thumbnail,
      author,
      ephemeral = false,
      method = 'edit',
      duration = 0
    } = options

    this.interaction = interaction
    this.title = title
    this.description = description
    this.color = color
    this.fields = fields
    this.footer = footer
    this.image = image
    this.thumbnail = thumbnail
    this.author = author
    this.ephemeral = ephemeral
    this.method = method
    this.duration = duration
  }

  /**
   * @returns {EmbedBuilder} an instance of EmbedBuilder
   */
  buildEmbed(): EmbedBuilder {
    const embed = new EmbedBuilder()
    if (this.title && !isEmpty(this.title)) embed.setTitle(this.title)
    if (this.description && !isEmpty(this.description)) embed.setDescription(this.description)
    if (this.color) embed.setColor(this.color)
    if (this.fields) embed.addFields(this.fields)
    if (this.footer && !isEmpty(this.footer)) embed.setFooter({ text: this.footer })
    if (this.image && !isEmpty(this.image) && isUrl(this.image)) embed.setImage(this.image)
    if (this.thumbnail && !isEmpty(this.thumbnail) && isUrl(this.thumbnail)) embed.setThumbnail(this.thumbnail)
    if (this.author) embed.setAuthor({ name: this.author })
    return embed
  }

  buildMsg() {
    const embed = this.buildEmbed()
    return { embeds: [embed], flags: this.ephemeral ? MessageFlags.Ephemeral : 0 } // 64 is the ephemeral flag in Discord.js
  }

  /** Send the embed to the interaction
   * @returns {Promise<void>} respond to the interaction
   */
  async send(): Promise<void> {
    try {
      const replyMethod =
        this.method === 'edit' ? (this.interaction instanceof Message ? 'reply' : 'editReply') : 'reply'
      const msg = await this.interaction[replyMethod](this.buildMsg())

      if (this.duration > 0) {
        setTimeout(() => {
          if (msg && msg.delete) {
            msg.delete().catch(() => {})
          }
        }, this.duration).unref()
      }
    } catch (error) {
      console.error('Failed to send embed:', error)
    }
  }

  // Static factory methods for common embed types
  /**
   * Sends an error embed with default error styling
   */
  static error(
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
    options: EmbedOptions = {}
  ): Promise<void> {
    const embed = new Embed(interaction, {
      color: EMBED_COLORS.Error,
      ephemeral: true,
      footer: 'https://cp.nnsvn.me/support',
      ...options
    })
    return embed.send()
  }

  /**
   * Sends a success embed with default success styling
   */
  static success(
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
    options: EmbedOptions = {}
  ): Promise<void> {
    const embed = new Embed(interaction, {
      color: EMBED_COLORS.Success,
      ephemeral: false,
      ...options
    })
    return embed.send()
  }

  /**
   * Sends an embed indicating the bot lacks required permissions
   */
  static botNoPermission(
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
    i18next: I18nextTranslation,
    permission: string = 'N/A'
  ): Promise<void> {
    return this.error(interaction, {
      title: i18next.t('BotNoPermission'),
      description: `${i18next.t('nopermission')}. Missing: ${permission}`,
      footer: 'https://bot.nnsvn.me/docs/permissions'
    })
  }

  /**
   * Sends an embed indicating the user lacks required permissions
   */
  static userNoPermission(
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
    i18next: I18nextTranslation,
    permission: string = 'N/A'
  ): Promise<void> {
    return this.error(interaction, {
      title: i18next.t('UserNoPermission'),
      description: `${i18next.t('nopermission')}. Missing: ${permission}`,
      footer: 'https://bot.nnsvn.me/docs/permissions'
    })
  }

  /**
   * Sends an embed indicating no user was found in the guild
   */
  static noUserInGuild(
    interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message
  ): Promise<void> {
    return this.error(interaction, {
      description: 'There is no mentioned user in the guild'
    })
  }
}

// Legacy function wrappers for backward compatibility

/**
 * @deprecated Use Embed.error() instead
 */
function ErrorEmbed(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
  options: EmbedOptions = {}
): Promise<void> {
  return Embed.error(interaction, options)
}

/**
 * @deprecated Use Embed.success() instead
 */
function SuccessEmbed(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
  options: EmbedOptions = {}
): Promise<void> {
  return Embed.success(interaction, options)
}

/**
 * @deprecated Use Embed.botNoPermission() instead
 */
function BotNoPermissionEmbed(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
  i18next: I18nextTranslation,
  { permission = 'N/A' }: { permission?: string } = {}
): Promise<void> {
  return Embed.botNoPermission(interaction, i18next, permission)
}

/**
 * @deprecated Use Embed.userNoPermission() instead
 */
function UserNoPermissionEmbed(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message,
  i18next: I18nextTranslation,
  { permission = 'N/A' }: { permission?: string } = {}
): Promise<void> {
  return Embed.userNoPermission(interaction, i18next, permission)
}

/**
 * @deprecated Use Embed.noUserInGuild() instead
 */
function noUserInGuild(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction | Message
): Promise<void> {
  return Embed.noUserInGuild(interaction)
}

export { BotNoPermissionEmbed, Embed, ErrorEmbed, noUserInGuild, SuccessEmbed, UserNoPermissionEmbed }
