import type { Guild, GuildMember, Message } from 'discord.js'
import { PermissionsBitField, SnowflakeUtil } from 'discord.js'

import { adminIds } from '@/config/SuperUser'
// Pre-compiled regex patterns for better performance
const URL_PATTERN = /^https?:\/\/(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?$/i
const DISCORD_INVITE_PATTERN =
  /(?:https?:\/\/)?(?:www\.)?(discord\.(?:gg|io|me|li|link|plus)|discorda?p?p?\.com\/invite|invite\.gg|dsc\.gg|urlcord\.cf)\/[\w-]+/i
const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i
const IMAGE_URL_PATTERN = /\.(jpeg|jpg|gif|png|webp)$/i
const COLORS = [
  'Default',
  'Random',
  'Aqua',
  'DarkAqua',
  'Green',
  'DarkGreen',
  'Blue',
  'DarkBlue',
  'Purple',
  'DarkPurple',
  'LuminousVividPink',
  'DarkVividPink',
  'Gold',
  'DarkGold',
  'Orange',
  'DarkOrange',
  'Red',
  'DarkRed',
  'Grey',
  'DarkGrey',
  'DarkerGrey',
  'LightGrey',
  'Navy',
  'DarkNavy',
  'Yellow',
  'White',
  'Greyple',
  'Black',
  'DarkButNotBlack',
  'NotQuiteBlack',
  'Blurple',
  'Fuchsia'
]

/**
 * Checks if a message is calling a command
 */
export function isCallingCommand(message: Message, prefix: string) {
  if (!message?.content || !prefix) return false

  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const prefixPattern = new RegExp(`^(<@!?${message.client.user.id}>|${escapedPrefix})\\s*`)
  return prefixPattern.test(message.content)
}

/**
 * Checks if a string contains a valid URL
 */
export function containsLink(text: string) {
  return text ? URL_PATTERN.test(text) : false
}

/**
 * Checks if a string contains a Discord invite link
 */
export function containsDiscordInvite(text: string) {
  return text ? DISCORD_INVITE_PATTERN.test(text) : false
}

/**
 * Validates if a string is a valid color code
 */
export function isColor(text: string) {
  return text ? COLORS.includes(text) || HEX_COLOR_PATTERN.test(text) : false
}

/**
 * Checks if a member has administrative access
 */
export function isAdmin(guild: Guild, member: GuildMember, managerRoles: string[]) {
  if (!guild?.id || !member?.user.id) return false

  if (
    adminIds.includes(member.user.id) ||
    guild.ownerId === member.user.id ||
    member.permissions?.has(PermissionsBitField.Flags.Administrator)
  ) {
    return true
  }

  return managerRoles?.length > 0 ? managerRoles.some((role) => member.roles.cache.has(role)) : false
}

/**
 * Validates if a string is a valid URL
 */
export function isUrl(url: string) {
  if (!url) return false
  return URL_PATTERN.test(url)
}

/**
 * Validates if a URL points to an image
 */
export function isImageUrl(url: string) {
  return url && isUrl(url) && IMAGE_URL_PATTERN.test(url)
}

/**
 * Validates if value is a valid Date object
 */
export function isDate(date: Date) {
  return date instanceof Date && Number.isFinite(date.getTime())
}

/**
 * Converts various input types to boolean
 */
export function parseToBoolean(value: string | boolean | number) {
  if (value === null || value === undefined) return false
  const normalized = String(value).trim().toLowerCase()
  return ['true', '1', 'yes', 'on', 'enabled'].includes(normalized)
}

/**
 * Validates if a string is a valid Discord Snowflake
 */
export function isSnowflake(value: string) {
  try {
    return Boolean(value && SnowflakeUtil.deconstruct(value))
  } catch {
    return false
  }
}
