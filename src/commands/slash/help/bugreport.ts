import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  ForumChannel,
  MessageFlags,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  ThreadAutoArchiveDuration,
  UserResolvable
} from 'discord.js'

import { bugReportChannelId } from '@/config/SuperUser'
import logger from '@/handlers/logger'
import type { SlashCommand } from '@/types/Command'

export default {
  name: 'bugreport',
  cooldown: 60,
  description: 'Submit a bug report to help improve the bot',
  type: 1,
  category: 'UTILITY',
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const { member, channel } = interaction

    // validate channel perms
    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('bugreport_btnSetup').setLabel('Submit Bug Report').setStyle(ButtonStyle.Primary)
    )

    const sentMsg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            'Thank you for helping us improve the bot. Please click the button below to submit your bug report.'
          )
          .setColor('Random')
      ],
      components: [buttonRow]
    })

    const btnInteraction = await channel.awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i: ButtonInteraction) =>
        i.customId === 'bugreport_btnSetup' && i.user.id === member.user.id && i.message.id === sentMsg.id,
      time: 20000
    })

    if (!btnInteraction)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Bug report submission timed out. Please try again when you're ready.")
            .setColor('Red')
        ],
        components: []
      })

    // display modal
    await btnInteraction.showModal(
      new ModalBuilder()
        .setCustomId('bugreport-modalsetup')
        .setTitle('Bug Report Form')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('Bug Summary')
              .setPlaceholder('Brief description of the issue (e.g., "Command fails when used in DMs")')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('Detailed Description')
              .setPlaceholder(
                'Please describe what happened, what you expected to happen, and any error messages you received.'
              )
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('reproduce')
              .setLabel('Steps to Reproduce')
              .setPlaceholder('1. Go to...\n2. Click on...\n3. See error...')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('additional')
              .setLabel('Additional Information (Optional)')
              .setPlaceholder('Screenshots, device info, or any other relevant details...')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false)
          )
        )
    )

    // receive modal input
    const modal = await btnInteraction.awaitModalSubmit({
      time: 1 * 60 * 1000 * 1000,
      filter: (m: ModalSubmitInteraction) =>
        m.customId === 'bugreport-modalsetup' && m.user.id === member.user.id && m.message.id === sentMsg.id
    })

    if (!modal)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Bug report submission timed out. Please try again when you're ready.")
            .setColor('Red')
        ],
        components: []
      })

    await modal.reply({
      embeds: [new EmbedBuilder().setDescription('Processing your bug report...').setColor('Blurple')],
      flags: MessageFlags.Ephemeral
    })

    const t1 = modal.fields.getTextInputValue('title')
    const t2 = modal.fields.getTextInputValue('description')
    const t3 = modal.fields.getTextInputValue('reproduce')
    const t4 = modal.fields.getTextInputValue('additional') || 'No additional information provided.'

    const forum = interaction.client.channels.cache.get(bugReportChannelId) as ForumChannel

    const e1 = new EmbedBuilder().setDescription(`**Steps to Reproduce:**\n${t3}`).setColor('Red')

    const e2 = new EmbedBuilder()
      .setDescription(`**Additional Information:**\n${t4}`)
      .setFooter({ text: `Reported by ${member.user.username} (${member.user.id})` })
      .setTimestamp()
      .setColor('Red')

    await forum.threads
      .create({
        name: `[Bug] ${t1}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
        message: {
          content: `**Bug Description:**\n${t2}`
        },
        reason: `Bug report: ${t1}`
      })
      .then((threadChannel) => {
        threadChannel.send({ embeds: [e1, e2] })
        interaction.client.users.send(
          member as UserResolvable,
          `Your bug report has been successfully submitted! Report ID: **\`${threadChannel.id}\`**\n\nThank you for helping us improve the bot. Our development team will review your report.`
        )
        interaction.user.send({
          embeds: [new EmbedBuilder().setTitle(`Bug Report: ${t1}`).setDescription(t2).setColor('Blurple'), e1, e2]
        })
      })
      .catch((err: Error) => logger.error(err))

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor('Green')
          .setDescription(
            '✅ Your bug report has been successfully submitted! Thank you for helping us improve the bot.'
          )
      ],
      components: []
    })
  }
} as SlashCommand
