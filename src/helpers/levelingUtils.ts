import { Font, RankCardBuilder } from 'canvacord'
import { ChannelType, EmbedBuilder, Guild, GuildMember, type Message, MessageCreateOptions } from 'discord.js'

import { prefix as DefaultPrefix } from '@/config'
import { DEFAULT_BACKGROUND_URL } from '@/config/leveling'
import type { LevelingConfigDocument } from '@/models/leveling.guild.model'
import type { LevelingDocument } from '@/models/leveling.model'
import { getGuild } from '@/services/guild.service'
import { getGuildLevelingConfig } from '@/services/leveling.guild.service'
import { getGuildLeveling, getUserLeveling } from '@/services/leveling.service'

import type { BotClient } from './botClient'
import { getRandomInt } from './botUtils'
import { safeSend } from './extenders/message'
import { getUserName } from './user'
import { isCallingCommand } from './validation'

const CooldownRate = 15000 // 15 seconds
const levelRate = 0.177 // Level rate for leveling up

const AcceptedChannelTypes = [
  ChannelType.GuildText,
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread
]

/**
 * Add experience points to a user.
 */
export async function addExp(client: BotClient, message: Message<true>) {
  const member = message.guild.members.cache.get(message.author.id)
  const config = await getGuildLevelingConfig({ guildId: message.guild.id })
  if (!(await ableToAddXP(message, member, config))) return

  const userLevel = await getUserLeveling({ userId: message.author.id, guildId: message.guild.id })
  if (!userLevel) return

  await gainedXp(message, userLevel, config)
  // Set a cooldown for the user.
  setCooldown(client, message)
}

/**
 * Directly add random XP within the specified range
 *
 */
export async function gainedXp(message: Message<true>, userLevel: LevelingDocument, settings: LevelingConfigDocument) {
  const baseXpAmount = getRandomInt(3, 9)
  const xpMultiplier = settings.xp_rate
  userLevel.xp += Math.floor(baseXpAmount * xpMultiplier)

  // Check for level up
  const currentLevel = await getLevel(userLevel.xp, levelRate)
  if (currentLevel > userLevel.level) {
    userLevel.level = currentLevel // Update level
    announceLevelUp(message, userLevel, settings) // Announce level up
  }

  await userLevel.save()
  return userLevel
}

/**
 * Check if the user is able to gain XP.
 */
export async function ableToAddXP(
  message: Message<true>,
  member: GuildMember | null,
  settings: LevelingConfigDocument
) {
  const client = message.client as BotClient
  const { author, guild, channel } = message
  const { enabled, noxp } = settings

  // Check if leveling is disabled
  if (!enabled) return false

  // Combine checks for bot messages, DMs, self-messages, invalid member, and non-accepted channel types
  if (author.bot || !guild || author === client.user || !member || !AcceptedChannelTypes.includes(channel.type)) {
    return false
  }

  // Retrieve settings and check for command messages
  const { prefix = DefaultPrefix } = await getGuild({ _id: guild.id })
  if (message.content.startsWith(prefix) || isCallingCommand(message, prefix)) {
    return false
  }

  // Check for exempted channels
  const isExemptedChannel = noxp.channels_exempted.includes(channel.id)
  if ((noxp.channel_type === 1 && isExemptedChannel) || (noxp.channel_type === 0 && !isExemptedChannel)) {
    return false
  }

  // Check for exempted roles
  const hasExemptedRole = noxp.roles_exempted.some((role) => member.roles.cache.has(role))
  if ((noxp.role_type === 1 && hasExemptedRole) || (noxp.role_type === 0 && !hasExemptedRole)) {
    return false
  }

  // Check for XP cooldown
  if (client.recent.has(author.id)) {
    return false
  }

  return true
}

export function announceLevelUp(message: Message<true>, userLevel: LevelingDocument, settings: LevelingConfigDocument) {
  const {
    level_up_announcement_type,
    level_up_announcement_message,
    level_up_announcement_delete_after,
    level_up_announcement_channel
  } = settings

  // Early return if announcements are disabled
  if (level_up_announcement_type === 0) return

  // Prepare the announcement message once
  const announcement = {
    embeds: [
      new EmbedBuilder()
        .setDescription(
          level_up_announcement_message
            .replace(/{user}/g, message.author.username)
            .replace(/{level}/g, userLevel.level.toString())
        )
        .setColor('Yellow')
    ]
  } as MessageCreateOptions

  switch (level_up_announcement_type) {
    // Announcement in the same channel
    case 1:
      safeSend(message.channel, announcement, level_up_announcement_delete_after)
      break
    // Send a DM
    case 2:
      message.author.send(announcement)
      break
    // Announcement in a specific channel
    case 3: {
      const channel = message.guild.channels.cache.get(level_up_announcement_channel)
      if (channel && channel.isTextBased()) {
        safeSend(channel, announcement, level_up_announcement_delete_after)
      }
      break
    }
  }
}

export function getLevel(xp: number, rate: number) {
  return Math.floor(rate * Math.sqrt(xp)) + 1
}

/**
 * Find the lower and upper bounds of the level.
 */
export function getLevelBounds(level: number, rate: number) {
  const lowerBound = Math.ceil(((level - 1) / rate) ** 2)
  const upperBound = Math.ceil((level / rate) ** 2)
  return { lowerBound, upperBound }
}

/**
 * Set a cooldown for the user.
 */
export function setCooldown(client: BotClient, message: Message<true>) {
  client.recent.add(message.author.id)
  setTimeout(() => {
    client.recent.delete(message.author.id)
  }, CooldownRate)
}

/**
 * Create a rank card for the user.
 */
export async function createRankCard(
  client: BotClient,
  { guild, targetUser, bg = DEFAULT_BACKGROUND_URL }: { guild: Guild; targetUser: GuildMember; bg?: string | URL }
) {
  if (!guild) throw new Error('Guild is not defined.')
  if (!targetUser) throw new Error('User is not defined.')
  if (!bg) throw new Error('Background is not defined.')

  const target = await getUserLeveling({ guildId: guild.id, userId: targetUser.id })
  if (!target) return

  const res = await getLevelBounds(target.level + 1, levelRate)
  const neededXP = res.lowerBound
  const guildData = await getGuildLeveling({ guildId: guild.id })
  if (!guildData) return

  const rank = guildData.findIndex((member) => member.userId === targetUser.id) + 1

  Font.loadDefault()
  const rankboard = new RankCardBuilder()
    .setAvatar(
      targetUser.displayAvatarURL({
        size: 1024,
        forceStatic: true,
        extension: 'png'
      })
    )
    .setCurrentXP(target.xp)
    .setRequiredXP(neededXP)
    .setLevel(target.level)
    .setRank(rank)
    .setUsername(getUserName(targetUser.user))
    .setStatus(targetUser.presence?.status ?? 'dnd')
    .setBackground(bg)

  const data = await rankboard.build()
  return data
}
