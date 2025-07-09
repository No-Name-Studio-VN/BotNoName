import { GuildTextBasedChannel, MessageCreateOptions, PermissionResolvable } from 'discord.js'

import logger from '@/handlers/logger'

/**
 * Safely send a message to the channel
 */
export async function safeSend(channel: GuildTextBasedChannel, content: MessageCreateOptions, timeout?: number) {
  // return if no content
  if (!content) return

  const perms = ['ViewChannel', 'SendMessages']
  if (content.embeds?.length > 0) perms.push('EmbedLinks')
  if (!channel.permissionsFor(channel.guild.members.me).has(perms as PermissionResolvable)) return

  try {
    if (!timeout) return await channel.send(content)

    const reply = await channel.send(content)
    // Use unref() to allow the process to exit if this is the only operation pending

    setTimeout(() => {
      if (reply.deletable) {
        reply.delete().catch(() => {
          // Optionally log the error or handle it as needed
        })
      }
    }, timeout * 1000).unref()
  } catch (ex) {
    logger.error(`safeSend`, ex)
  }
}
