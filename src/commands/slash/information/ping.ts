import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  TextDisplayBuilder
} from 'discord.js'

import type { SlashCommand } from '@/types/Command'

export default {
  name: 'ping',
  description: 'return my ping',
  type: 1,
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  category: 'INFORMATION',
  cooldown: 5,
  execute: async (interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    const startTime = interaction.createdTimestamp

    const container = new ContainerBuilder()

    const pingText = new TextDisplayBuilder().setContent(
      [`# :ping_pong: **PING: ${Math.abs(Math.round(Date.now() - startTime))} ms.** **PONG !** :ping_pong: 😲`].join(
        '\n'
      )
    )

    container.addTextDisplayComponents(pingText)

    const uptimeText = new TextDisplayBuilder().setContent(
      [
        `Bot đã trực tuyến được **${Math.round(interaction.client.uptime / (1000 * 60 * 60))} giờ, ${Math.round(interaction.client.uptime / (1000 * 60)) % 60} phút và ${Math.round(interaction.client.uptime / 1000) % 60} giây**.`
      ].join('\n')
    )

    const checkStatusButton = new ButtonBuilder()
      .setLabel('Check status')
      .setStyle(ButtonStyle.Link)
      .setURL('https://status.nnsvn.me')

    const uptimeSection = new SectionBuilder()
      .addTextDisplayComponents(uptimeText)
      .setButtonAccessory(checkStatusButton)
    container.addSectionComponents(uptimeSection)

    const getSupportButton = new ButtonBuilder()
      .setLabel('Get Support')
      .setStyle(ButtonStyle.Link)
      .setURL('https://bot.nnsvn.me/support')

    container.addActionRowComponents((row) => row.addComponents(getSupportButton))

    await interaction.editReply({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    })
    return
  }
} as SlashCommand
