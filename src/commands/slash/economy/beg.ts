import { EmbedBuilder } from 'discord.js'

import EconomyConfig from '@/config/economy'
import Economy from '@/helpers/economy'
import type { SlashCommand } from '@/types/Command'

/**
 * Selects a random reward amount based on weighted chances defined in the config.
 * It works by iterating through rewards and accumulating their chances until the sum
 * exceeds a random number between 0 and 1.
 * @returns {number} The randomly selected reward amount.
 */
function getRandomReward(): number {
  const rand = Math.random()
  let cumulativeChance = 0

  for (const reward of EconomyConfig.Beg.Rewards) {
    cumulativeChance += reward.chance
    if (rand < cumulativeChance) {
      return reward.amount
    }
  }

  // Fallback for floating-point precision issues, ensuring a reward is always returned.
  return EconomyConfig.Beg.Rewards[EconomyConfig.Beg.Rewards.length - 1].amount
}

export default {
  name: 'beg',
  type: 1,
  description: 'beg for coins or items to help you fill your pockets',
  category: 'ECONOMY',
  cooldown: 45,
  botPermissions: ['EmbedLinks'],
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()

    try {
      const rewardAmount = getRandomReward()
      const isSuccess = rewardAmount > 0

      const embed = new EmbedBuilder()

      if (isSuccess) {
        // Pick a random figure who "gave" the money
        const figure = EconomyConfig.Beg.Figures[Math.floor(Math.random() * EconomyConfig.Beg.Figures.length)]

        // Update user's economy profile
        const userEconomy = await Economy.init(interaction.user.id)
        await Promise.all([
          userEconomy.addBalance({
            amount: rewardAmount,
            currency: 'cash',
            source: 'beg',
            content: figure,
            location: 'balance'
          }),
          userEconomy.addXp(EconomyConfig.Beg.XpReward)
        ])

        embed.setColor('Green').setDescription(
          i18next.t('economy.beg.success', {
            amount: Economy.formatCurrency(rewardAmount),
            user: figure
          })
        )
      } else {
        // Handle the failure case
        embed.setColor('Red').setDescription(i18next.t('economy.beg.fail'))
      }

      // Single point of reply, making the logic flow cleaner.
      return interaction.editReply({ embeds: [embed] })
    } catch (error) {
      console.error('Error executing beg command:', error)
      const errorEmbed = new EmbedBuilder().setColor('Red').setDescription(i18next.t('errorOccurred'))

      return interaction.editReply({ embeds: [errorEmbed] })
    }
  }
} as SlashCommand
