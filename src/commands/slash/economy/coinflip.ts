import { ColorResolvable, ContainerBuilder, MessageFlags, TextDisplayBuilder } from 'discord.js'

import EconomyConfig from '@/config/economy'
import Economy from '@/helpers/economy'
import Embed from '@/helpers/embedTemplate'
import { SlashCommand } from '@/types/Command'

export default {
  name: 'coinflip',
  type: 1,
  cooldown: 5,
  description: 'Flip a coin and bet on the outcome',
  category: 'ECONOMY',
  botPermissions: ['EmbedLinks'],
  options: [
    {
      name: 'bet',
      description: 'The amount of money you want to bet',
      type: 4,
      required: true
    },
    {
      name: 'choice',
      description: 'Your choice of heads or tails',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Head',
          value: 'head'
        },
        {
          name: 'Tail',
          value: 'tail'
        }
      ]
    }
  ],
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()

    const { options, user } = interaction
    const betAmount = options.getInteger('bet')
    const choice = options.getString('choice')

    const userEconomy = await Economy.init(user.id)

    if (!userEconomy.validateInput('amount', betAmount)) {
      return Embed.error(interaction, { description: i18next.t('economy.invalidAmount') })
    }
    if (userEconomy.userEconomy.balance.cash < betAmount) {
      return Embed.error(interaction, { description: i18next.t('economy.insufficientBalance') })
    }

    const result = Math.random() < 0.5 ? 'head' : 'tail'
    const isWin = result === choice

    const outcomeKey = isWin ? 'game.coinflip.win' : 'game.coinflip.lose'
    const outcomeText = i18next.t(outcomeKey)
    const embedColor: ColorResolvable = isWin ? 5763719 : 15158332

    const balanceUpdate = isWin
      ? userEconomy.addBalance({
          currency: 'cash',
          amount: betAmount,
          content: `${outcomeText} ${i18next.t('game.coinflip.title')}`,
          source: 'Tài Xỉu',
          location: 'balance'
        })
      : userEconomy.deductBalance({
          currency: 'cash',
          amount: betAmount,
          content: `${outcomeText} ${i18next.t('game.coinflip.title')}`,
          source: 'Tài Xỉu',
          location: 'balance'
        })

    await Promise.all([balanceUpdate, userEconomy.addXp(20)])

    const component = new ContainerBuilder()
      .setAccentColor(embedColor)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            `# ${outcomeText} **${Economy.formatCurrency(betAmount)}** ${EconomyConfig.Currency}`,
            `-# ${i18next.t('game.coinflip.land')} **${result}**`
          ].join('\n')
        )
      )

    await interaction.editReply({
      components: [component],
      flags: MessageFlags.IsComponentsV2
    })
  }
} as SlashCommand
