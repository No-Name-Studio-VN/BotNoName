import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder
} from 'discord.js'
import { millify } from 'millify'

import { getGuildLeveling } from '@/services/leveling.service'
import { SlashCommand } from '@/types/Command'

const ITEMS_PER_PAGE = 10
const COLLECTOR_IDLE_TIME = 60 * 1000
const COLLECTOR_TIME = 5 * 60 * 1000

const RANK_EMOJIS: Record<number, string> = {
  1: ':crown:',
  2: ':trident:',
  3: ':trophy:',
  4: ':medal:',
  5: ':zap:'
} as const

const DEFAULT_EMOJI = ':reminder_ribbon:'

import type { Guild } from 'discord.js'

import type { LevelingDocument } from '@/models/leveling.model'

const formatUserEntry = (user: LevelingDocument, index: number, guild: Guild): string => {
  const rank = index + 1
  const targetMember = guild.members.cache.get(user.userId)
  const leftUserText = targetMember ? '' : ' (Left User)'
  const emojiToUse = RANK_EMOJIS[rank] || DEFAULT_EMOJI

  return `### \`${rank}\` ${emojiToUse} <@${user.userId}>${leftUserText} — Level: \`${user.level}\` | XP: \`${millify(user.xp)}\``
}

const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

const createEmbed = (items: string[], pageIndex: number, totalPages: number, guild: Guild): ContainerBuilder => {
  const titleContent =
    totalPages > 1
      ? [`# Leaderboard of \`${guild.name}\``, `-# \`Page ${pageIndex + 1} / ${totalPages}\``].join('\n')
      : `# Leaderboard of \`${guild.name}\``

  const containerBuilder = new ContainerBuilder()
    .setAccentColor(7506394)
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(guild.iconURL({ size: 4096 })))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(titleContent))
    )
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(items.join('\n')))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))

  if (totalPages > 1) {
    containerBuilder
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Use ⬅️➡️ to navigate the pages!`))
  }

  return containerBuilder
}

const createButtonsRow = (currentPage: number, totalPages: number): ActionRowBuilder<ButtonBuilder> => {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('previousBtn')
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage === 0),
    new ButtonBuilder()
      .setCustomId('nextBtn')
      .setEmoji('➡️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage === totalPages - 1 || totalPages === 1)
  )
}

export default {
  name: 'leaderboard',
  description: "show the guild's leveling leaderboard 🐧",
  type: 1,
  category: 'STATS',
  contexts: [0],
  integration_types: [0],
  cooldown: 3,
  async execute(interaction) {
    await interaction.deferReply()

    const { member, guild } = interaction

    const guilddata = await getGuildLeveling({ guildId: guild.id }, { lean: true })
    const sortedData = guilddata.sort((a, b) => b.xp - a.xp)

    if (sortedData.length === 0) {
      return interaction.editReply({ content: 'No leaderboard data found for this server.' })
    }

    const userEntries = sortedData.map((user, index) => formatUserEntry(user, index, guild))
    const pages = chunkArray(userEntries, ITEMS_PER_PAGE)
    const embeds = pages.map((items, index) => createEmbed(items, index, pages.length, guild))

    let currentPage = 0

    const components =
      embeds.length > 1 ? [embeds[currentPage], createButtonsRow(currentPage, embeds.length)] : [embeds[currentPage]]

    const sentMsg = await interaction.editReply({
      components,
      flags: MessageFlags.IsComponentsV2
    })

    if (embeds.length === 1) return

    const collector = sentMsg.createMessageComponentCollector({
      filter: (reactor) => reactor.user.id === member.user.id,
      idle: COLLECTOR_IDLE_TIME,
      time: COLLECTOR_TIME
    })

    collector.on('collect', async (response) => {
      if (!['previousBtn', 'nextBtn'].includes(response.customId)) return

      await response.deferUpdate()

      if (response.customId === 'previousBtn' && currentPage > 0) {
        currentPage--
      } else if (response.customId === 'nextBtn' && currentPage < embeds.length - 1) {
        currentPage++
      }

      if (sentMsg.editable) {
        await sentMsg.edit({
          components: [embeds[currentPage], createButtonsRow(currentPage, embeds.length)],
          flags: MessageFlags.IsComponentsV2
        })
      }
    })

    collector.on('end', () => {
      if (sentMsg.editable) {
        sentMsg.edit({ components: [] }).catch(() => {})
      }
    })
  }
} as SlashCommand
