import { EmbedBuilder } from 'discord.js'
import type { i18n } from 'i18next'

import EconomyConfig from '@/config/economy'
import { slotmachine } from '@/config/emoji'
import Economy from '@/helpers/economy'
import Embed from '@/helpers/embedTemplate'
import { getUserName } from '@/helpers/user'
import type { SlashCommand } from '@/types/Command'

const items = ['🍇', '🍊', '🍋', '🍌']

export default {
  name: 'slots',
  type: 1,
  cooldown: 7,
  description: 'Bet your money in the slot machine! Earn up to 10x your money!',
  category: 'ECONOMY',
  botPermissions: ['EmbedLinks'],
  options: [
    {
      name: 'bet',
      description: 'The amount of money you want to bet',
      type: 4,
      required: true
    }
  ],
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()

    const betAmount = interaction.options.getInteger('bet')
    const userId = interaction.user.id

    const userEconomy = await Economy.init(userId)
    const userDb = userEconomy.userEconomy
    if (!userEconomy.validateInput('amount', betAmount))
      return Embed.error(interaction, { description: i18next.t('economy.invalidAmount') })
    if (userDb.balance.cash < betAmount)
      return Embed.error(interaction, { description: i18next.t('economy.insufficientBalance') })

    const msg = await interaction.editReply({
      embeds: [createEmbed(i18next).setDescription(`${slotmachine}${slotmachine}${slotmachine}`)]
    })

    const slot1 = getRandomItem(items)
    const slot2 = getRandomItem(items)
    const slot3 = getRandomItem(items)

    const delays = [1000, 2000, 3000]
    const slotResults = [
      `${slot1}${slotmachine}${slotmachine}`,
      `${slot1}${slot2}${slotmachine}`,
      `${slot1}${slot2}${slot3}`
    ]

    delays.forEach((delay, index) => {
      setTimeout(async () => {
        if (index < 2) {
          await msg.edit({
            embeds: [createEmbed(i18next).setDescription(slotResults[index])]
          })
        } else {
          const win = slot1 === slot2 && slot2 === slot3
          const embed = createEmbed(i18next)
          const user = `${getUserName(interaction.user)}`
          const currency = EconomyConfig.Currency

          if (win) {
            const winAmount = betAmount * 10
            await userEconomy.addBalance({
              currency: 'cash',
              amount: winAmount,
              content: `${i18next.t('game.slots.win', { user, bet: betAmount, amount: winAmount })}`,
              source: 'Slots',
              location: 'balance'
            })
            embed.setDescription(
              `${slotResults[index]} | ${i18next.t('game.slots.win', { user: `**${user}**`, bet: betAmount, amount: `**${winAmount}**` })} ${currency}!`
            )
            embed.setColor('Green')
          } else {
            await userEconomy.deductBalance({
              currency: 'cash',
              amount: betAmount,
              content: `${i18next.t('game.slots.lose', { user, amount: betAmount })}`,
              source: 'Slots',
              location: 'balance'
            })
            embed.setDescription(
              `${slotResults[index]} | ${i18next.t('game.slots.lose', { user: `**${user}**`, amount: `**${betAmount}**` })} ${currency}!`
            )
            embed.setColor('Red')
          }

          userEconomy.addXp(20)

          await msg.edit({ embeds: [embed] })
        }
      }, delay)
    })
  }
} as SlashCommand

function createEmbed(i18next: i18n) {
  return new EmbedBuilder().setFooter({ text: `🎰 ${i18next.t('game.slots.title')} 🎰` })
}

function getRandomItem(items: string[]) {
  return items[Math.floor(items.length * Math.random())]
}
