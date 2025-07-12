import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  ModalBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'
import type { i18n } from 'i18next'

import EconomyConfig from '@/config/economy'
import Economy from '@/helpers/economy'
import Embed from '@/helpers/embedTemplate'
import type { SlashCommand } from '@/types/Command'

const MAX_SIDE_BETS = 4

const baucuaItems = [
  {
    name: 'game.baucua.items.bau',
    emoji: '🌰',
    id: 1
  },
  {
    name: 'game.baucua.items.cua',
    emoji: '🦀',
    id: 2
  },
  {
    name: 'game.baucua.items.tom',
    emoji: '🦐',
    id: 3
  },
  {
    name: 'game.baucua.items.ca',
    emoji: '🐟',
    id: 4
  },
  {
    name: 'game.baucua.items.nai',
    emoji: '🦌',
    id: 5
  },
  {
    name: 'game.baucua.items.ga',
    emoji: '🐔',
    id: 6
  }
]

export default {
  name: 'baucua',
  type: 1,
  cooldown: 10,
  description: 'Bet on the outcome of a dice roll',
  category: 'ECONOMY',
  botPermissions: ['EmbedLinks'],
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()

    // xúc sắc 6 ô
    const rolls = baucuaItems.map((item) => ({
      name: item.name ? i18next.t(item.name) : `Roll ${item.id}`,
      id: item.id,
      icon: item.emoji || '🎲', // Default icon if none is provided
      bet_amount: 0,
      win: false
    }))

    const netGain = 0

    const userId = interaction.user.id
    const userEconomy = await Economy.init(userId)

    const msg = await interaction.editReply({
      components: [createBetEmbed(rolls, netGain, false, i18next), betButtons],
      flags: MessageFlags.IsComponentsV2
    })

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 3_600_000
    })

    collector.on('collect', async (i) => {
      const id = i.customId.split('_')[1]
      switch (id) {
        case 'cancel':
          collector.stop('cancelled')
          break

        case 'start': {
          await i.deferUpdate()
          if (rolls.every((r) => r.bet_amount === 0))
            return Embed.error(i, { description: i18next.t('game.noBetsPlaced') }, true)

          const currentBalance = userEconomy.userDb.balance.cash
          const userRollsAmount = rolls.reduce((acc, roll) => acc + roll.bet_amount, 0)

          if (currentBalance <= 0 || userRollsAmount > currentBalance)
            return Embed.error(i, { description: i18next.t('economy.insufficientBalance') }, true)

          const rollsMap = new Map(rolls.map((r) => [r.id, r]))
          const results = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1)
          let netGain = 0

          results.forEach((result) => {
            if (rollsMap.has(result)) {
              const roll = rollsMap.get(result)
              roll.win = true
              netGain += roll.bet_amount
            }
          })

          rolls.forEach((roll) => {
            if (!roll.win) netGain -= roll.bet_amount
          })

          if (netGain !== 0) {
            const balanceUpdateFunction = netGain >= 0 ? 'addBalance' : 'deductBalance'
            await userEconomy[balanceUpdateFunction]({
              amount: Math.abs(netGain),
              currency: 'cash',
              content: `${netGain > 0 ? 'won' : 'lost'} baucua`,
              source: 'baucua',
              location: 'balance'
            })
          }

          await userEconomy.addXp(20)
          collector.stop('completed')
          break
        }

        default: {
          // check if rolls has the valid object with this id
          const roll = rolls.find((r) => r.id === parseInt(id))
          if (!roll) return i.reply({ content: i18next.t('game.baucua.invalidroll'), ephemeral: true })

          // check if bet was placed on more than 3
          if (rolls.filter((r) => r.bet_amount > 0).length >= MAX_SIDE_BETS) {
            return i.reply({
              content: i18next.t('game.baucua.maxSideBetReached', { max: MAX_SIDE_BETS }),
              ephemeral: true
            })
          }

          // display modal to get how much user wants to bet
          const modalCustomId = 'bet_amount_' + id
          // this is actually a reply but a modal is used to get the input
          await i.showModal(
            new ModalBuilder({
              customId: modalCustomId,
              title: `${i18next.t('game.baucua.betAmount')} ` + roll.name,
              components: [
                new ActionRowBuilder<TextInputBuilder>().addComponents(
                  new TextInputBuilder()
                    .setCustomId('bet_amount')
                    .setLabel(i18next.t('game.baucua.betamount'))
                    .setPlaceholder(i18next.t('game.baucua.enteramount'))
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                )
              ]
            })
          )
          // receive modal input
          const modal = await i.awaitModalSubmit({ time: 3 * 60 * 1000 }).catch(() => {})

          if (!modal)
            return msg.edit({
              components: [
                new ContainerBuilder()
                  .setAccentColor(16711680)
                  .addTextDisplayComponents(new TextDisplayBuilder().setContent('## ' + i18next.t('game.noResponse')))
              ]
            })

          await modal.deferUpdate()
          // get the amount user wants to bet and validate
          const amount = parseInt(modal.fields.getTextInputValue('bet_amount'))
          if (!userEconomy.validateInput('amount', amount)) {
            return modal.editReply({
              components: [
                new TextDisplayBuilder().setContent(i18next.t('economy.invalidAmount') + ` ${EconomyConfig.Currency}`)
              ]
            })
          }
          roll.bet_amount = amount
          // edit the message to show the user's current rolls
          msg.edit({
            components: [createBetEmbed(rolls, netGain, false, i18next), betButtons]
          })
        }
      }
    })

    collector.on('end', (collected, reason) => {
      switch (reason) {
        case 'cancelled':
          return msg.edit({
            components: [
              new ContainerBuilder()
                .setAccentColor(16711680)
                .addTextDisplayComponents(
                  new TextDisplayBuilder().setContent('## ' + i18next.t('game.baucua.cancelled'))
                )
            ]
          })
        case 'completed':
          return msg.edit({
            components: [createBetEmbed(rolls, netGain, true, i18next)],
            flags: MessageFlags.IsComponentsV2
          })
        default:
          return msg.edit({
            components: [
              new ContainerBuilder()
                .setAccentColor(16711680)
                .addTextDisplayComponents(new TextDisplayBuilder().setContent('## ' + i18next.t('game.noResponse')))
            ]
          })
      }
    })
  }
} as SlashCommand

const createBetRow = (
  rolls: { name: string; icon: string; bet_amount: number; win: boolean; id: number }[],
  isFinished: boolean,
  i18next: i18n
) => {
  const sections: SectionBuilder[] = []

  rolls.forEach((roll) => {
    const section = new SectionBuilder()
      .setButtonAccessory(
        new ButtonBuilder()
          .setCustomId(`baucua_${roll.id}`)
          .setLabel(roll.bet_amount > 0 ? `Edit ${roll.name}` : `Bet ${roll.name}`)
          .setStyle(roll.bet_amount > 0 ? ButtonStyle.Secondary : ButtonStyle.Primary)
          .setDisabled(isFinished)
          .setEmoji(roll.icon)
      )
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `**${roll.icon} ${roll.name}**: ${
            roll.bet_amount > 0
              ? `**${i18next.t('game.baucua.resultAnnouncement', {
                  result: 'bet',
                  amount: Economy.formatCurrency(roll.bet_amount)
                })}**`
              : `*${i18next.t('game.baucua.nobetPlaced')}*`
          }`
        )
      )

    sections.push(section)
  })

  return sections
}

const createBetEmbed = (
  rolls: { name: string; icon: string; bet_amount: number; win: boolean; id: number }[],
  netGain: number,
  isFinished: boolean,
  i18next: i18n
) => {
  const container = new ContainerBuilder()
    .setAccentColor(16705372)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        isFinished
          ? `# ${i18next.t('game.baucua.resultAnnouncement', {
              result: i18next.t(`game.baucua.${netGain >= 0 ? 'win' : 'lose'}`),
              amount: Math.abs(netGain)
            })} ${EconomyConfig.Currency}`
          : `## Your bets: ${Economy.formatCurrency(
              rolls.reduce((total, roll) => total + roll.bet_amount, 0)
            )} ${EconomyConfig.Currency}`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `-# ${i18next.t('game.baucua.promptPlaceBet', { max: `**${MAX_SIDE_BETS}**` })}`
      )
    )
    .addSectionComponents(...createBetRow(rolls, isFinished, i18next))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(['## How to play', `-# ${i18next.t('game.baucua.introduction')}`].join('\n'))
    )

  return container
}

const betButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('baucua_cancel').setStyle(ButtonStyle.Danger).setLabel('Cancel').setEmoji({
    name: '✖️'
  }),
  new ButtonBuilder().setCustomId('baucua_start').setStyle(ButtonStyle.Success).setLabel('Confirm').setEmoji({
    name: '✔️'
  })
)
