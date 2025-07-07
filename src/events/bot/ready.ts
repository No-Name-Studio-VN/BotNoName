import { ActivityType, EmbedBuilder } from 'discord.js'

import logger from '@/handlers/logger'
import type { BotClient } from '@/helpers/botClient'
import { isProduction } from '@/helpers/botUtils'

// Configuration constants
const CONFIG = {
  PRODUCTION_CHANNEL_ID: '1089108031041712210',
  PRESENCE_UPDATE_DELAY: 10000,
  PRESENCE_UPDATE_INTERVAL: 6 * 60 * 60 * 1000,
  STREAM_URL: 'https://www.youtube.com/watch?v=ha8m3U9d6HU'
}

export default async (client: BotClient) => {
  try {
    logger.info('Bot initialization started')

    const statusMessage = await initializeBot(client)

    // Initial presence update with delay
    setTimeout(() => {
      updatePresence(client, statusMessage).catch((err) => logger.error('Failed to update initial presence:', err))
    }, CONFIG.PRESENCE_UPDATE_DELAY)

    // Periodic presence updates
    setInterval(() => {
      updatePresence(client, statusMessage).catch((err) => logger.error('Failed to update periodic presence:', err))
    }, CONFIG.PRESENCE_UPDATE_INTERVAL)

    logger.info('Bot initialization completed')
  } catch (error) {
    logger.error('Failed to initialize bot:', error)
  }
}

async function initializeBot(client: BotClient) {
  if (isProduction) {
    await sendStartupMessage(client)
    return `chaos with ${getTotalMembers(client)} users on ${client.guilds.cache.size} servers`
  }
  return 'development version'
}

async function updatePresence(client: BotClient, statusText: string) {
  if (!client.user) return
  await client.user.setPresence({
    status: 'online',
    activities: [
      {
        name: statusText,
        type: ActivityType.Streaming,
        url: CONFIG.STREAM_URL
      }
    ]
  })
}

async function sendStartupMessage(client: BotClient) {
  const channel = client.channels.cache.get(CONFIG.PRODUCTION_CHANNEL_ID)
  if (!channel) {
    throw new Error('Production channel not found')
  }

  if (channel.isSendable()) {
    await channel.send({
      embeds: [
        new EmbedBuilder().setDescription(`Bot **started** at <t:${Math.floor(Date.now() / 1000)}:R>.`).setColor('Blue')
      ]
    })
  }
}

/**
 * Calculate total members across all guilds
 */
function getTotalMembers(client: BotClient): number {
  return client.guilds.cache.reduce((count, guild) => count + guild.memberCount, 0)
}
