import { FilterQuery, QueryOptions } from 'mongoose'

import EconomySchema, { EconomyUserDocument } from '@/models/economy.user.model'

export async function getUserEconomy(query: FilterQuery<EconomyUserDocument>, options: QueryOptions = { lean: false }) {
  let user = await EconomySchema.findOne(query, null, options)

  if (!user && query._id) {
    const defaultUser: Partial<EconomyUserDocument> = {
      _id: query._id as string
    }
    user = await EconomySchema.create(defaultUser)

    if (options.lean) {
      return user.toObject()
    }
  }

  return user
}

export async function getTopEconomy(limit: number = 10) {
  const economyData = await EconomySchema.find({}).sort({ 'balance.cash': -1 }).limit(limit).lean()

  return economyData
}
