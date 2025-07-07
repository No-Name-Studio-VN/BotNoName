import { EmbedBuilder, MessageFlags } from 'discord.js'

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
    const embed = new EmbedBuilder()
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 1024 }))
      .setColor('Random')
      .addFields(
        {
          name: ':ping_pong: **PING: ' + `${Math.abs(Math.round(Date.now() - startTime))}` + ' ms.**',
          value: '**PONG !** :ping_pong: 😲'
        },
        {
          name: 'Bot đã trực tuyến được',
          value: `${Math.round(interaction.client.uptime / (1000 * 60 * 60))} giờ, ${Math.round(interaction.client.uptime / (1000 * 60)) % 60} phút và ${Math.round(interaction.client.uptime / 1000) % 60} giây.`
        }
      )
      .setTimestamp()

    await interaction.editReply({ embeds: [embed] })
    return
  }
} as SlashCommand
