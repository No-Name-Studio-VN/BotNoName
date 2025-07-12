import { EmbedBuilder } from 'discord.js'

import Economy from '@/helpers/economy'
import Embed from '@/helpers/embedTemplate'
import { getUserName } from '@/helpers/user'
import type { SlashCommand } from '@/types/Command'

export default {
  name: 'rep',
  type: 1,
  description: 'Give a user reputation',
  options: [
    {
      name: 'user',
      description: 'The user you want to give reputation to',
      type: 6,
      required: true
    }
  ],
  cooldown: 86400,
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()
    const embed = new EmbedBuilder()
    const user = interaction.options.getUser('user')
    if (user.id === interaction.user.id) {
      return interaction.editReply({
        embeds: [embed.setColor('Red').setDescription(i18next.t('economy.rep.self'))]
      })
    }
    if (user.bot) return Embed.error(interaction, { description: i18next.t('economy.botNotAllowed') })

    const userEconomy = await Economy.init(user.id)
    await userEconomy.addRep(1)

    return interaction.editReply({
      embeds: [
        embed.setColor('Blurple').setDescription(i18next.t('economy.rep.success', { user: getUserName(user), rep: 1 }))
      ]
    })
  }
} as SlashCommand
