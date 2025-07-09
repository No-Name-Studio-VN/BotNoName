import { FilterQuery, QueryOptions } from 'mongoose'

import LevelingGuild, { LevelingConfigDocument } from '@/models/leveling.guild.model'

/**
 * Finds a leveling configuration by the given query. If no configuration is found and the query contains a guildId,
 * a new configuration will be created with that guildId.
 */
export async function getGuildLevelingConfig(
  query: FilterQuery<LevelingConfigDocument>,
  options: QueryOptions = { lean: false }
) {
  let config = await LevelingGuild.findOne(query, null, options)

  if (!config && query.guildId) {
    const defaultConfig: Partial<LevelingConfigDocument> = {
      guildId: query.guildId as string
    }
    config = await LevelingGuild.create(defaultConfig)

    if (options.lean) {
      return config.toObject()
    }
  }

  return config
}
