import { FilterQuery, QueryOptions } from 'mongoose'

import Guild, { GuildDocument } from '@/models/guild.model'

/**
 * Finds a guild by the given query. If no guild is found and the query contains a guildId,
 * a new guild will be created with that guildId.
 */
export async function getGuild(query: FilterQuery<GuildDocument>, options: QueryOptions = { lean: false }) {
  let guild = await Guild.findOne(query, null, options)

  if (!guild && query._id) {
    const defaultGuild: Partial<GuildDocument> = {
      _id: query._id as string
    }
    guild = await Guild.create(defaultGuild)

    if (options.lean) {
      return guild.toObject()
    }
  }

  return guild
}
