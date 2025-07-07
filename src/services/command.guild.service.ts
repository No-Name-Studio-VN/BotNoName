import { FilterQuery, QueryOptions } from 'mongoose'

import CommandGuild, { CommandGuildDocument } from '@/models/command.guild.model'

/**
 * Finds a guild by the given query. If no guild is found and the query contains a guildId,
 * a new guild will be created with that guildId.
 *
 * @param {FilterQuery<CommandGuildDocument>} query - The query to find the guild.
 * @param {QueryOptions} [options={ lean: true }] - Options for the query, defaulting to lean mode.
 * @returns {Promise<CommandGuildDocument | null>} The found or created guild document.
 */
export async function getGuildCommandSettings(
  query: FilterQuery<CommandGuildDocument>,
  options: QueryOptions = { lean: true }
) {
  let guild = await CommandGuild.findOne(query, null, options)

  if (!guild && query.guildId) {
    const defaultGuild: Partial<CommandGuildDocument> = {
      _id: query.guildId, // Ensure _id is set to guildId
      guildId: query.guildId as string
    }
    guild = await CommandGuild.create(defaultGuild)

    if (options.lean) {
      return guild.toObject()
    }
  }

  return guild
}
