import { FilterQuery, QueryOptions } from 'mongoose'

import Guild, { GuildDocument } from '@/models/guild.model'

/**
 * Finds a guild by the given query. If no guild is found and the query contains a guildId,
 * a new guild will be created with that guildId.
 */
export async function getGuild(query: FilterQuery<GuildDocument>, options: QueryOptions = { lean: false }) {
  let guild = await Guild.findOne(query, null, options)

  if (!guild && query.guildId) {
    const defaultGuild: Partial<GuildDocument> = {
      guildId: query.guildId as string
    }
    guild = await Guild.create(defaultGuild)

    if (options.lean) {
      return guild.toObject()
    }
  }

  return guild
}
