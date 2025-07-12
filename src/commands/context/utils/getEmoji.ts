/* eslint-disable @typescript-eslint/no-unused-vars */
import { bold, hyperlink, orderedList } from '@discordjs/formatters'
import { EmbedBuilder } from 'discord.js'
import { isEmpty } from 'lodash-es'

import Embed from '@/helpers/embedTemplate'
import { parseEmojis } from '@/helpers/emoji'
import type { MessageContextCommand } from '@/types/Command'

export default {
  name: 'Get Emojis',
  description: 'Get all the emojis from a message',
  cooldown: 5,
  type: 3,
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()

    const messageContent = interaction.targetMessage.content
    if (isEmpty(messageContent)) return Embed.error(interaction, { description: i18next.t('cmds.emoji.no_emoji') })
    const links = await parseEmojis(messageContent)
    if (!links) return Embed.error(interaction, { description: i18next.t('cmds.emoji.no_emoji') })

    const description = links.map((item, i) => {
      return `${item.tag} - ${hyperlink(bold(item.name), item.link)}`
    })

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setAuthor({ name: `${i18next.t('cmds.emoji.list')}` })
      .setDescription(orderedList(description, 1))
      .setTimestamp()

    return interaction.editReply({ embeds: [embed] })
  }
} as MessageContextCommand
