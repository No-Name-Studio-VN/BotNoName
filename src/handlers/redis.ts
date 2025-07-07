import type { Input, ParsedRedisResponse } from '@/types/redis'

import { getRedisClient } from './dbinit'

const CACHE_DEFAULT_TTL = 3600 // 1 hour in seconds

const formatInputData = (data: Input) => {
  return typeof data === 'object' ? JSON.stringify(data) : String(data)
}

const formatOutputData = (data: string) => {
  if (!data) return null
  if (typeof data !== 'string') return data

  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

export async function cacheSet(key: string, value: Input, ttl = CACHE_DEFAULT_TTL) {
  if (!key || typeof key !== 'string') throw new Error('Invalid key provided')
  if (value === undefined) throw new Error('Invalid value provided')

  const redis = await getRedisClient()
  const formattedValue = formatInputData(value)
  return redis.set(key, formattedValue, 'EX', ttl)
}

export async function cacheGet(key: string): Promise<ParsedRedisResponse> {
  if (!key || typeof key !== 'string') throw new Error('Invalid key provided')

  const redis = await getRedisClient()
  const value = await redis.get(key)
  if (value === null) return null

  try {
    return formatOutputData(value)
  } catch {
    return value // Return as string if parsing fails
  }
}
