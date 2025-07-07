import type { Redis, RedisOptions } from 'ioredis'
import IORedis from 'ioredis'
import type { Connection, ConnectOptions } from 'mongoose'
import mongoose from 'mongoose'
import { applySpeedGooseCacheLayer } from 'speedgoose'

import envConfig from '@/lib/env'

import logger from './logger'

// --- Configurations (Unchanged) ---

const REDIS_CONFIG: RedisOptions = {
  host: envConfig.REDIS_HOST,
  port: envConfig.REDIS_PORT,
  password: envConfig.REDIS_PASSWORD,
  db: envConfig.REDIS_DB,
  maxRetriesPerRequest: null,
  lazyConnect: false,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  reconnectOnError: (err) => err.message.includes('READONLY'),
  commandTimeout: 5000,
  disconnectTimeout: 2000,
  keepAlive: 10000,
  noDelay: true,
  connectionName: 'app_main'
}

const MONGO_CONFIG: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  minPoolSize: 10,
  maxPoolSize: 50,
  family: 4
}

const isProduction = envConfig.NODE_ENV === 'production'

// --- Redis Connection (Lazy-Initialized Singleton) ---

// These variables are module-scoped and act as singletons.
let redisInstance: Redis | null = null
let redisConnectionPromise: Promise<Redis> | null = null

/**
 * Internal function to establish a new Redis connection.
 */
async function connectToRedis(): Promise<Redis> {
  logger.info('Redis: Initializing connection...')
  const redisClient = new IORedis(REDIS_CONFIG)

  // Setup event listeners immediately
  redisClient
    .on('connect', () => logger.info('Redis: Client has connected to the server.'))
    .on('error', (err) => logger.error('Redis: Client error.', err))
    .on('close', () => logger.warn('Redis: Connection closed.'))
    .on('reconnecting', (ms: string | number) => logger.debug(`Redis: Reconnecting in ${ms}ms...`))

  try {
    // Wait for the 'ready' event to ensure the connection is fully usable.
    await new Promise<void>((resolve, reject) => {
      // If the client is already ready, resolve immediately.
      if (redisClient.status === 'ready') {
        return resolve()
      }
      // Otherwise, wait for the 'ready' event.
      redisClient.once('ready', resolve)
      redisClient.once('error', reject)
    })

    logger.info('Redis: Connection established and ready.')

    if (!isProduction) {
      await redisClient.flushall()
      logger.info('Redis: Cache flushed (development mode)')
    }

    return redisClient
  } catch (err) {
    logger.error('Redis: Initialization failed.', err)
    // Ensure the client is disconnected on a failed startup.
    if (redisClient.status !== 'end') {
      redisClient.disconnect()
    }
    throw err // Propagate the error.
  }
}

/**
 * Gets the singleton Redis client instance.
 * If not already connected, it will initiate the connection.
 * Returns a promise that resolves with the ready Redis client.
 */
export function getRedisClient(): Promise<Redis> {
  // If the instance is already created, return it instantly.
  if (redisInstance) {
    return Promise.resolve(redisInstance)
  }

  // If a connection attempt is already in progress, return the existing promise.
  if (redisConnectionPromise) {
    return redisConnectionPromise
  }

  // Start a new connection attempt.
  redisConnectionPromise = connectToRedis()
    .then((client) => {
      redisInstance = client
      return client
    })
    .catch((err) => {
      // On failure, reset the promise so a future call can retry.
      redisConnectionPromise = null
      throw err
    })

  return redisConnectionPromise
}

// --- Mongoose Connection (Lazy-Initialized Singleton) ---

let mongooseConnection: Connection | null = null
let mongooseConnectionPromise: Promise<Connection> | null = null

/**
 * Internal function to establish a new Mongoose connection.
 */
async function connectToMongoose(retryAttempts = 3): Promise<Connection> {
  const mongoUri = isProduction ? envConfig.MONGO_Prod : envConfig.MONGO_Test
  if (!mongoUri) {
    throw new Error('MongoDB URI is not defined in environment variables')
  }

  // Construct a proper Redis URI for SpeedGoose
  const redisUri = `redis://${REDIS_CONFIG.host}:${REDIS_CONFIG.port}/${REDIS_CONFIG.db}`

  mongoose.set('strictQuery', true)

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      logger.info(`Mongoose: Attempting to connect (Attempt ${attempt}/${retryAttempts})...`)

      await mongoose.connect(mongoUri, MONGO_CONFIG)

      // Ensure the Redis connection is ready before applying the cache layer
      await getRedisClient()
      await applySpeedGooseCacheLayer(mongoose, { redisUri })

      logger.info('Mongoose: Connection established and SpeedGoose layer applied.')
      return mongoose.connection
    } catch (err) {
      logger.warn(`Mongoose: Connection attempt ${attempt} failed.`, err)
      if (attempt === retryAttempts) {
        logger.error('Mongoose: Max retry attempts reached. Failed to connect.')
        throw err // Re-throw the final error
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }
  // This line is technically unreachable due to the throw in the loop, but good for safety.
  throw new Error('Mongoose: Failed to connect after all retries.')
}

/**
 * Gets the singleton Mongoose connection instance.
 * If not already connected, it will initiate the connection.
 * Returns a promise that resolves with the ready Mongoose connection.
 */
export function getMongooseConnection(): Promise<Connection> {
  // If the instance is already created, return it instantly.
  if (mongooseConnection) {
    return Promise.resolve(mongooseConnection)
  }

  // If a connection attempt is already in progress, return the existing promise.
  if (mongooseConnectionPromise) {
    return mongooseConnectionPromise
  }

  // Start a new connection attempt.
  mongooseConnectionPromise = connectToMongoose()
    .then((connection) => {
      mongooseConnection = connection
      return connection
    })
    .catch((err) => {
      // On failure, reset the promise so a future call can retry.
      mongooseConnectionPromise = null
      throw err
    })

  return mongooseConnectionPromise
}
