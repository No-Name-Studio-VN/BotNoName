import { FilterQuery, QueryOptions } from 'mongoose'

import CommandGuild, { CommandGuildDocument } from '@/models/command.guild.model'

/**
 * Finds a guild command setting by the given query. If no guild is found and the query contains a guildId,
 * a new document will be created with that guildId.
 */
export async function getGuildCommandSettings(
  query: FilterQuery<CommandGuildDocument>,
  options: QueryOptions = { lean: false }
) {
  let guild = await CommandGuild.findOne(query, null, options)

  if (!guild && query.guildId) {
    const defaultGuild: Partial<CommandGuildDocument> = {
      guildId: query.guildId as string
    }
    guild = await CommandGuild.create(defaultGuild)

    if (options.lean) {
      return guild.toObject()
    }
  }

  return guild
}
