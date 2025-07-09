import type { Message } from 'discord.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder
} from 'discord.js'

import { copyright, invite_link } from '@/config'
export default async (message: Message) => {
  // check if a user ping the bot (will only trigger if they ping without any message)
  const mentionRegex = RegExp(`^<@!?${message.client.user.id}>$`)
  if (message.content.match(mentionRegex)) {
    message.reply({
      components: [
        new ContainerBuilder()
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  [
                    "## Hello. What's Up? 👋",
                    `You might be wondering what you can do with me, so here are some of the things I can help you with:`,
                    '',
                    '- **Commands**: Type /help to see a list of commands I can perform.',
                    '- **Chatbot**: You can chat with me, I will try my best to respond to you.',
                    '- **Leveling System**: You can earn XP by chatting with me, and level up over time.',
                    '- **Music**: I can play music in voice channels, just use the `music` command to get started.',
                    '- **Moderation**: I can help you moderate your server with various moderation commands.',
                    '- **Fun Commands**: I have a variety of fun commands to entertain you and your friends.'
                  ].join('\n')
                )
              )
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(message.client.user.displayAvatarURL({ size: 4096 }))
              )
          )
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  [
                    `### Your bot looks amazing, how should I support it?`,
                    `- Give me a **vote** on \`TOP.GG\`!`,
                    '- Tell your friends about me and suggest them to consider No Name Bot too!'
                  ].join('\n')
                )
              )
              .setButtonAccessory(
                new ButtonBuilder()
                  .setLabel('Vote for Me')
                  .setStyle(ButtonStyle.Link)
                  .setURL('https://top.gg/bot/736915194772586598/vote')
              )
          )
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
          .addSectionComponents(
            new SectionBuilder()
              .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                  '### In case you have any questions, suggestions, or issues, feel free to reach out to our supportive staffs in our Discord server.'
                )
              )
              .setButtonAccessory(
                new ButtonBuilder()
                  .setLabel('Support Server')
                  .setStyle(ButtonStyle.Link)
                  .setURL('https://discord.gg/nnsvn')
              )
          )
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              ['### Thanks for using No Name, and we hope you have a great day!', '', `-# ${copyright}`].join('\n')
            )
          ),
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setLabel('Invite Me').setStyle(ButtonStyle.Link).setURL(invite_link)
        )
      ],
      flags: MessageFlags.IsComponentsV2
    })
    return true
  }
  return false
}
