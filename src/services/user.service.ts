import { FilterQuery, QueryOptions } from 'mongoose'

import User, { UserDocument } from '@/models/user.model'

/**
 * Finds a user by the given query. If no user is found and the query contains a userId,
 * a new user will be created with that userId.
 *
 * @param {FilterQuery<UserDocument>} query - The query to find the user.
 * @param {QueryOptions} [options={ lean: true }] - Options for the query, defaulting to lean mode.
 * @returns {Promise<UserDocument | null>} The found or created user document.
 */
export async function getUser(query: FilterQuery<UserDocument>, options: QueryOptions = { lean: true }) {
  let user = await User.findOne(query, null, options)

  if (!user && query.userId) {
    const defaultUser: Partial<UserDocument> = {
      userId: query.userId as string
    }
    user = await User.create(defaultUser)

    if (options.lean) {
      return user.toObject()
    }
  }

  return user
}
