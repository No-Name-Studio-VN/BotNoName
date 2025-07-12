import { FilterQuery, QueryOptions } from 'mongoose'

import User, { UserDocument } from '@/models/user.model'

/**
 * Finds a user by the given query. If no user is found and the query contains a userId,
 * a new user will be created with that userId.
 */
export async function getUser(query: FilterQuery<UserDocument>, options: QueryOptions = { lean: false }) {
  let user = await User.findOne(query, null, options)

  if (!user && query._id) {
    const defaultUser: Partial<UserDocument> = {
      _id: query._id as string
    }
    user = await User.create(defaultUser)

    if (options.lean) {
      return user.toObject()
    }
  }

  return user
}
