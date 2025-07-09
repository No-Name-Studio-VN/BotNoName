import {
  AttachmentBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  User
} from 'discord.js'

import { ErrorEmbed, noUserInGuild } from '@/helpers/embedTemplate'
import { createRankCard } from '@/helpers/levelingUtils'
import type { SlashCommand } from '@/types/Command'

export default {
  name: 'leveling',
  description: 'Shows the rank card of the user in this guild',
  type: 1,
  category: 'INFORMATION',
  botPermissions: ['EmbedLinks'],
  cooldown: 30,
  contexts: [0],
  integration_types: [0],
  options: [
    {
      name: 'user',
      type: 6,
      description: 'The user to show the rank card',
      required: false
    }
  ],
  async execute(interaction, client, i18n) {
    await interaction.deferReply()
    const mem = interaction.options.getUser('user') || interaction.member
    const mention = interaction.guild.members.cache.get(mem instanceof User ? mem.id : mem.user.id)
    if (!mention) return await noUserInGuild(interaction)

    if (mention.user.bot || mention.user.system)
      return await ErrorEmbed(interaction, {
        description: i18n.t('leveling.botNoLevelingData')
      })

    if (mention) {
      const image = await createRankCard(client, {
        guild: interaction.guild,
        targetUser: mention
      })
      if (!image)
        return await ErrorEmbed(interaction, {
          description: 'leveling.noGuildLevelingData'
        })

      const attachment = new AttachmentBuilder(image, { name: 'RankCard.png' })

      const components = [
        new ContainerBuilder()
          .setAccentColor(5793266)
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${'leveling.cardTitle'}`))
          .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
          .addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(`attachment://${attachment.name}`))
          )
          .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${'leveling.leaderboardTip'}`))
      ]

      await interaction.editReply({
        components: components,
        files: [attachment],
        flags: MessageFlags.IsComponentsV2
      })
      return
    }
  }
} as SlashCommand
