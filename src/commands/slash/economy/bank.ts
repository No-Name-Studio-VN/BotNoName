import { EmbedBuilder } from 'discord.js'

import Economy from '@/helpers/economy'
import type { SlashCommand } from '@/types/Command'

export default {
  name: 'bank',
  type: 1,
  description: 'Manage your bank account',
  category: 'ECONOMY',
  botPermissions: ['EmbedLinks'],
  cooldown: 30,
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()
    const userEconomy = await Economy.init(interaction.user.id)
    const { balance, bank } = userEconomy.userEconomy

    const formattedCashBalance = Economy.formatCurrency(balance.cash)
    const formattedGemBalance = Economy.formatCurrency(balance.gem)
    const formattedCashBank = Economy.formatCurrency(bank.cash)
    const formattedGemBank = Economy.formatCurrency(bank.gem)

    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })
      .addFields(
        {
          name: i18next.t('economy.balance.title'),
          value: `💵 **| ${formattedCashBalance}** • 💎 **| ${formattedGemBalance}**`
        },
        {
          name: i18next.t('economy.bank.title'),
          value: `💵 **| ${formattedCashBank}** • 💎 **| ${formattedGemBank}**`
        }
      )

    return interaction.editReply({ embeds: [embed] })
  }
} as SlashCommand
