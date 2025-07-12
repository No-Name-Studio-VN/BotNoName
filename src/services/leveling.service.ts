import { FilterQuery, QueryOptions } from 'mongoose'

import Leveling, { LevelingDocument } from '@/models/leveling.model'

export async function getUserLeveling(query: FilterQuery<LevelingDocument>, options: QueryOptions = { lean: false }) {
  let config = await Leveling.findOne(query, null, options)

  if (!config && query.guildId && query.userId) {
    const defaultConfig: Partial<LevelingDocument> = {
      guildId: query.guildId as string,
      userId: query.userId as string
    }
    config = await Leveling.create(defaultConfig)

    if (options.lean) {
      return config.toObject()
    }
  }

  return config
}

export async function getGuildLeveling(query: FilterQuery<LevelingDocument>, options: QueryOptions = { lean: false }) {
  const config = await Leveling.find(query, null, options)
  return config
}
