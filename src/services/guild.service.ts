import { FilterQuery, QueryOptions } from 'mongoose'

import Guild, { GuildDocument } from '@/models/guild.model'

/**
 * Finds a guild by the given query. If no guild is found and the query contains a guildId,
 * a new guild will be created with that guildId.
 *
 * @param {FilterQuery<GuildDocument>} query - The query to find the guild.
 * @param {QueryOptions} [options={ lean: true }] - Options for the query, defaulting to lean mode.
 * @returns {Promise<GuildDocument | null>} The found or created guild document.
 */
export async function getGuild(query: FilterQuery<GuildDocument>, options: QueryOptions = { lean: true }) {
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
