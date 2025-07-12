import { EmbedBuilder, MessageFlags } from 'discord.js'
import { DateTime } from 'luxon'

import Embed from '@/helpers/embedTemplate'
import { UserContextCommand } from '@/types/Command'

export default {
  name: 'Get User',
  cooldown: 5,
  type: 2,
  async execute(interaction, client, i18next) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })
    const guild = client.guilds.cache.get(interaction.guildId)
    if (!guild) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder().setColor('Red').setDescription('Bot need to be in the server to get user information.')
        ]
      })
    }
    const mem = guild.members.cache.get(interaction.targetId)
    const member = mem ? await mem.fetch(true) : await guild.members.fetch(interaction.targetId)

    if (member) {
      const getPermission = () => {
        if (member.permissions.has('Administrator')) return i18next.t('roleList.administrator')
        if (member.permissions.has('BanMembers') || member.permissions.has('KickMembers'))
          return i18next.t('roleList.moderator')
        if (member.permissions.has('ModerateMembers')) return i18next.t('roleList.helper')
        return i18next.t('roleList.member')
      }

      const status = () => {
        if (member.presence?.status) {
          switch (member.presence.status) {
            case 'online':
              return '🟢 ' + i18next.t('online')
            case 'idle':
              return '🌒 ' + i18next.t('idle')
            case 'dnd':
              return '🔴 ' + i18next.t('dontdisturb')
            case 'offline':
              return '👤 ' + i18next.t('offline')
            default:
              return i18next.t('nostatusfound')
          }
        }
        return '👤 ' + i18next.t('offline')
      }

      const usertype = () => {
        if (member.user.bot) return 'Bot'
        if (member.user.system) return 'System'
        return 'User'
      }

      const generateMemberInfo = (fields: Array<{ key: string; value: string | number }>) => {
        return fields.reduce((acc, field, index) => {
          const label = i18next.t(field.key)
          acc.push(`**\`〘${label}〙\`** ${field.value}`)
          if (index < fields.length - 1) acc.push('')
          return acc
        }, [] as string[])
      }

      const memberFields = [
        { key: 'user', value: member.user.username },
        { key: 'userNickname', value: member.nickname || 'None' },
        { key: 'role', value: getPermission() },
        {
          key: 'CreatedDate',
          value: `<t:${DateTime.fromMillis(member.user.createdTimestamp).toUnixInteger()}:R>`
        },
        {
          key: 'JoinedDate',
          value: `<t:${DateTime.fromMillis(member.joinedTimestamp || 0).toUnixInteger()}:R>`
        },
        { key: 'AccountType', value: usertype() },
        { key: 'HighestRole', value: member.roles.highest.name },
        { key: 'currentStatus', value: status() }
      ]

      const memberInfo = generateMemberInfo(memberFields)

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Random')
            .setThumbnail(member.user.displayAvatarURL({ size: 4096 }))
            .setDescription(memberInfo.join('\n'))
            .setAuthor({ name: `${member.user.tag}(s) Info` })
            .setImage(member.user.bannerURL({ size: 4096 }) || null)
        ]
      })
    } else {
      return Embed.noUserInGuild(interaction)
    }
  }
} as UserContextCommand
