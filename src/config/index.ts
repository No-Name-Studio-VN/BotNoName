import type { ColorResolvable } from 'discord.js'

export const dashboard = true
export const interactionCommand = true
export const messageCommand = true
export const messageIntent = true

export const CACHE_SIZE = {
  GUILDS: 100,
  USERS: 10000,
  MEMBERS: 10000
}

export const EMBED_COLORS = {
  BOT_EMBED: '#068ADD' as ColorResolvable,
  TRANSPARENT: '#36393F' as ColorResolvable,
  SUCCESS: '#00A56A' as ColorResolvable,
  ERROR: '#D61A3C' as ColorResolvable,
  WARNING: '#F7E919' as ColorResolvable
}

export const CMDS_PER_PAGE = 10
export const copyright = '© 2025 No Name Studio. All rights reserved.'
export const invite_link = 'https://discord.com/application-directory/736915194772586598'
export const prefix = 'nn_'
