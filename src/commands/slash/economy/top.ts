import { EmbedBuilder } from 'discord.js'
import { millify } from 'millify'

import logger from '@/handlers/logger'
import type { BotClient } from '@/helpers/botClient'
import Economy from '@/helpers/economy'
import { getUserName } from '@/helpers/user'
import { EconomyUserDocument } from '@/models/economy.user.model'
import { getTopEconomy } from '@/services/economy.user.service'
import type { SlashCommand } from '@/types/Command'

const LIMIT = 10

export default {
  name: 'top',
  type: 1,
  description: 'Find the most wealthy users in the economy',
  category: 'ECONOMY',
  cooldown: 60,
  contexts: [0],
  integration_types: [0],
  async execute(interaction, client) {
    await interaction.deferReply()
    const embed = new EmbedBuilder().setColor('Yellow').setTitle(`Top ${LIMIT}`)

    const userDBs = await getTopEconomy(LIMIT)

    if (userDBs) {
      embed.setDescription(getUserDescription(client, userDBs))
      await interaction.editReply({ embeds: [embed] })
    }
  }
} as SlashCommand

function getUserDescription(client: BotClient, userDBs: EconomyUserDocument[]): string {
  return userDBs
    .map((userDb, index) => {
      try {
        const fetchedUser = client.users.cache.get(userDb._id)
        if (!fetchedUser) return
        const username = getUserName(fetchedUser)
        return `**${index + 1}.** ${username} - XP: **${millify(userDb.xp)}** - Balance: ${Economy.formatCurrency(userDb.balance.cash)}`
      } catch (err) {
        logger.error(err)
      }
    })
    .join('\n')
}
