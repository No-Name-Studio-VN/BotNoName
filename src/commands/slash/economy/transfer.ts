import type { User } from 'discord.js'
import {
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder
} from 'discord.js'
import type { i18n } from 'i18next'
import { DateTime } from 'luxon'

import Economy from '@/helpers/economy'
import Embed from '@/helpers/embedTemplate'
import { getUserName } from '@/helpers/user'
import { TransactionDocument } from '@/models/economy.transaction.model'
import type { SlashCommand } from '@/types/Command'

export default {
  name: 'transfer',
  type: 1,
  cooldown: 15,
  description: 'Transfer some balance to other user',
  category: 'ECONOMY',
  botPermissions: ['EmbedLinks'],
  options: [
    {
      name: 'amount',
      description: 'The amount you want to Transfer',
      type: 4,
      required: true
    },
    {
      name: 'user',
      description: 'The user you want to send to',
      type: 6,
      required: true
    },
    {
      name: 'note',
      description: 'Optional note for the transfer',
      type: 3,
      required: false
    }
  ],
  contexts: [0, 1, 2],
  integration_types: [0, 1],
  async execute(interaction, client, i18next) {
    await interaction.deferReply()
    const userId = interaction.user.id

    const userEconomy = await Economy.init(userId)
    const userDb = userEconomy.userEconomy

    const amount = interaction.options.getInteger('amount')
    const receiver = interaction.options.getUser('user')
    const note = interaction.options.getString('note')

    if (receiver === interaction.user)
      return Embed.error(interaction, { description: i18next.t('economy.transfer.selfTransfer') })
    if (receiver.bot) return Embed.error(interaction, { description: i18next.t('economy.botNotAllowed') })

    if (!userEconomy.validateInput('amount', amount))
      return Embed.error(interaction, { description: i18next.t('economy.invalidAmount') })
    if (userDb.balance.cash < amount)
      return Embed.error(interaction, { description: i18next.t('economy.insufficientBalance') })

    const receiverEconomy = await Economy.init(receiver.id)

    const [deductionResult, additionResult] = await Promise.all([
      userEconomy.deductBalance({
        currency: 'cash',
        amount,
        content: note ?? `Transferred to ${receiver.username} <@${receiver.id}>`,
        source: `<@${userId}>`,
        location: 'balance'
      }),
      receiverEconomy.addBalance({
        currency: 'cash',
        amount,
        content: note ?? `Received from ${interaction.user.username} <@${userId}>`,
        source: `<@${userId}>`,
        location: 'balance'
      })
    ])

    const senderComponent = createSenderEmbed(interaction.user, receiver, deductionResult, additionResult, i18next)
    const receiverComponent = createReceiverEmbed(interaction.user, receiver, deductionResult, additionResult, i18next)

    receiver
      .send({
        components: [receiverComponent],
        flags: MessageFlags.IsComponentsV2
      })
      .catch(() => {
        // If the user has DMs disabled, we don't want to throw an error
      })

    interaction.user
      .send({
        components: [senderComponent],
        flags: MessageFlags.IsComponentsV2
      })
      .catch(() => {
        // If the user has DMs disabled, we don't want to throw an error
      })

    return interaction.editReply({
      components: [senderComponent],
      flags: MessageFlags.IsComponentsV2
    })
  }
} as SlashCommand

function createBaseEmbed(
  targetUser: User,
  targetLabel: string,
  transaction: TransactionDocument,
  amount: number,
  i18next: i18n
) {
  return new ContainerBuilder()
    .setAccentColor(3066993)
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL('https://static.nnsvn.me/success.gif'))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              `## ${i18next.t('economy.transfer.title')}`,
              `# 💵 ${Economy.formatCurrency(amount)}`,
              `-# **${transaction.id}**`
            ].join('\n')
          )
        )
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(targetUser.displayAvatarURL({ size: 512 })))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`-# ${targetLabel}`),
          new TextDisplayBuilder().setContent(`## ${getUserName(targetUser)}\n-# **${targetUser.id}**`)
        )
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        [
          `Time: **${DateTime.fromJSDate(transaction.createdAt).toFormat('dd-MM-yyyy HH:mm:ss')}**`,
          `Note: **${transaction.content}**`
        ].join('\n')
      )
    )
}

function createSenderEmbed(
  sender: User,
  receiver: User,
  deductionResult: TransactionDocument,
  additionResult: TransactionDocument,
  i18next: i18n
) {
  return createBaseEmbed(receiver, 'Receiver', deductionResult, additionResult.amount, i18next)
}

function createReceiverEmbed(
  sender: User,
  receiver: User,
  deductionResult: TransactionDocument,
  additionResult: TransactionDocument,
  i18next: i18n
) {
  return createBaseEmbed(sender, 'Sender', additionResult, additionResult.amount, i18next)
}
