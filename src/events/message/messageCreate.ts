import type { Message, OmitPartialGroupDMChannel } from 'discord.js'

import chatbot from '@/handlers/chatbot'
import type { BotClient } from '@/helpers/botClient'
import { addExp } from '@/helpers/levelingUtils'
import sendAutoMessage from '@/helpers/messages/sendAutoMessage'
import { getGuild } from '@/services/guild.service'

export default async (client: BotClient, message: OmitPartialGroupDMChannel<Message>) => {
  // we dont care bot or empty messages
  if (message.author.bot || message.author === message.client.user || message.partial || !message.content) return

  // check if the message is a ping of the bot
  const isBotMentioned = await sendAutoMessage(message)
  if (isBotMentioned) return

  // Auto respond if a user sends a DM to the bot
  if (message.inGuild()) {
    await guildHandler(client, message)
  } else {
    await DMHandler(client, message as OmitPartialGroupDMChannel<Message<false>>)
  }
}

async function DMHandler(client: BotClient, message: OmitPartialGroupDMChannel<Message<false>>) {
  await chatbot(client, message)
  return
}

async function guildHandler(client: BotClient, message: OmitPartialGroupDMChannel<Message<true>>) {
  const data = await getGuild({ _id: message.guild.id })

  if (message.guild) {
    addExp(client, message)
  }

  if (data.chatbot?.toggle == true && data.chatbot?.channelId == message.channel.id) await chatbot(client, message)
  return
}
