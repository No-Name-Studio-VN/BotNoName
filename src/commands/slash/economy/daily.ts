import { EmbedBuilder } from 'discord.js'

import EconomyConfig from '@/config/economy'
import logger from '@/handlers/logger'
import Economy from '@/helpers/economy'
import Embed from '@/helpers/embedTemplate'
import { getUserName } from '@/helpers/user'
import type { SlashCommand } from '@/types/Command'

export default {
  name: 'daily',
  type: 1,
  cooldown: 30,
  description: 'Claim your daily rewards and maintain a streak',
  category: 'ECONOMY',
  botPermissions: ['EmbedLinks'],
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()

    const { user } = interaction
    const userEconomy = await Economy.init(interaction.user.id)
    try {
      const userDb = (await userEconomy.giveDailyReward()).userEconomy
      const receivedBalance = Math.round(
        EconomyConfig.DailyCoins + userDb.daily.streak * 0.06 * EconomyConfig.DailyCoins
      )
      const receivedBalanceFormatted = `**${Economy.formatCurrency(receivedBalance)}** ${EconomyConfig.Currency}`
      const successMessage = i18next.t('economy.daily.success', {
        object: receivedBalanceFormatted
      })
      const streakMessage = i18next.t('economy.daily.onstreak', {
        streak: `**${userDb.daily.streak}**`
      })
      const timeMessage = i18next.t('economy.daily.24hours')

      const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription(
          `💰 | **${getUserName(user)}** 🤘, ${successMessage}\n🧾 | ${streakMessage}\n⏱️ | ${timeMessage}`
        )
      userEconomy.addXp(10)

      return interaction.editReply({ embeds: [embed] })
    } catch (err) {
      logger.error(err)
      return Embed.error(interaction, {
        description: `⏱️ | ${i18next.t('economy.daily.claimed', { time: '24h' })}`
      })
    }
  }
} as SlashCommand
