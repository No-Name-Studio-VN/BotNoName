import type {
  ButtonInteraction,
  ChatInputCommandInteraction,
  ColorResolvable,
  ContextMenuCommandInteraction,
  InteractionReplyOptions
} from 'discord.js'
import {
  APIEmbedField,
  ContainerBuilder,
  EmbedBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  Message,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder
} from 'discord.js'
import type { i18n } from 'i18next'
import { isEmpty } from 'lodash-es'

import { isUrl } from '@/helpers/validation'

const EMBED_COLORS = {
  Error: 'Red',
  Success: 'Green',
  Info: 'Blue',
  Warning: 'Yellow'
} as const

type InteractionType = ChatInputCommandInteraction | ContextMenuCommandInteraction | ButtonInteraction | Message
type ReplyMethod = 'edit' | 'reply'

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
  method?: ReplyMethod
  duration?: number
}

/**
 * A utility class for creating and sending Discord embeds
 */
class Embed {
  private interaction: InteractionType
  private options: Required<EmbedOptions>
  private IsComponentsV2: boolean

  /**
   * Creates an embed instance
   */
  constructor(interaction: InteractionType, options: EmbedOptions = {}, IsComponentsV2: boolean = false) {
    this.interaction = interaction
    this.IsComponentsV2 = IsComponentsV2
    this.options = {
      title: '',
      description: '',
      color: 'Blurple',
      fields: [],
      footer: '',
      image: '',
      thumbnail: '',
      author: '',
      ephemeral: false,
      method: 'edit',
      duration: 0,
      ...options
    }
  }

  // Method chaining setters
  setTitle(title: string): this {
    this.options.title = title
    return this
  }

  setDescription(description: string): this {
    this.options.description = description
    return this
  }

  setColor(color: ColorResolvable): this {
    this.options.color = color
    return this
  }

  buildEmbed(): EmbedBuilder {
    const embed = new EmbedBuilder()
    const { title, description, color, fields, footer, image, thumbnail, author } = this.options

    if (title && !isEmpty(title)) embed.setTitle(title)
    if (description && !isEmpty(description)) embed.setDescription(description)
    if (color) embed.setColor(color)
    if (fields?.length) embed.addFields(fields)
    if (footer && !isEmpty(footer)) embed.setFooter({ text: footer })
    if (image && !isEmpty(image) && isUrl(image)) embed.setImage(image)
    if (thumbnail && !isEmpty(thumbnail) && isUrl(thumbnail)) embed.setThumbnail(thumbnail)
    if (author) embed.setAuthor({ name: author })

    return embed
  }

  buildComponents(): ContainerBuilder {
    const container = new ContainerBuilder()
    const { author, title, description, image, footer } = this.options

    if (author) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`### ${author}`))
    if (title && !isEmpty(title)) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${title}`))
    if (description && !isEmpty(description))
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description))
    if (image && !isEmpty(image) && isUrl(image)) {
      container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(image))
      )
    }
    if (footer && !isEmpty(footer)) {
      container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${footer}`))
    }

    return container
  }

  buildMsg(): InteractionReplyOptions {
    const baseOptions = { ephemeral: this.options.ephemeral }

    return this.IsComponentsV2
      ? { ...baseOptions, components: [this.buildComponents()], flags: MessageFlags.IsComponentsV2 }
      : { ...baseOptions, embeds: [this.buildEmbed()] }
  }

  private getReplyMethod(): string {
    if (this.options.method === 'reply') return 'reply'
    return this.interaction instanceof Message ? 'reply' : 'editReply'
  }

  private async scheduleDelete(msg: Message): Promise<void> {
    if (this.options.duration <= 0 || !msg?.delete) return

    setTimeout(() => {
      msg.delete().catch(() => {})
    }, this.options.duration).unref()
  }

  async send(): Promise<void> {
    try {
      const replyMethod = this.getReplyMethod()
      const msg = await this.interaction[replyMethod](this.buildMsg())
      await this.scheduleDelete(msg)
    } catch (error) {
      console.error('Failed to send embed:', error)
    }
  }

  // Static factory method to reduce duplication
  private static createAndSend(
    interaction: InteractionType,
    baseOptions: Partial<EmbedOptions>,
    userOptions: EmbedOptions = {},
    IsComponentsV2: boolean = false
  ): Promise<void> {
    const embed = new Embed(interaction, { ...baseOptions, ...userOptions }, IsComponentsV2)
    return embed.send()
  }

  static error(
    interaction: InteractionType,
    options: EmbedOptions = {},
    IsComponentsV2: boolean = false
  ): Promise<void> {
    return this.createAndSend(
      interaction,
      {
        color: EMBED_COLORS.Error,
        ephemeral: true,
        footer: 'https://cp.nnsvn.me/support'
      },
      options,
      IsComponentsV2
    )
  }

  static success(
    interaction: InteractionType,
    options: EmbedOptions = {},
    IsComponentsV2: boolean = false
  ): Promise<void> {
    return this.createAndSend(
      interaction,
      {
        color: EMBED_COLORS.Success,
        ephemeral: false
      },
      options,
      IsComponentsV2
    )
  }

  static botNoPermission(
    interaction: InteractionType,
    i18n: i18n,
    permission: string = 'N/A',
    IsComponentsV2: boolean = false
  ): Promise<void> {
    return this.error(
      interaction,
      {
        title: i18n.t('BotNoPermission'),
        description: `${i18n.t('nopermission')}. Missing: ${permission}`,
        footer: 'https://bot.nnsvn.me/docs/permissions'
      },
      IsComponentsV2
    )
  }

  static userNoPermission(
    interaction: InteractionType,
    i18n: i18n,
    permission: string = 'N/A',
    IsComponentsV2: boolean = false
  ): Promise<void> {
    return this.error(
      interaction,
      {
        title: i18n.t('UserNoPermission'),
        description: `${i18n.t('nopermission')}. Missing: ${permission}`,
        footer: 'https://bot.nnsvn.me/docs/permissions'
      },
      IsComponentsV2
    )
  }

  static noUserInGuild(interaction: InteractionType, IsComponentsV2: boolean = false): Promise<void> {
    return this.error(
      interaction,
      {
        description: 'There is no mentioned user in the guild'
      },
      IsComponentsV2
    )
  }
}

export default Embed
