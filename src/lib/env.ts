import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV?: string
  PORT?: number
  TOKEN_Prod?: string
  TOKEN_Test?: string

  CLIENT_ID_Prod?: string
  CLIENT_SECRET_Prod?: string
  CLIENT_ID_Test?: string
  CLIENT_SECRET_Test?: string

  MONGO_Prod?: string
  MONGO_Test?: string
  // logger config
  LOG_LEVEL?: string
  LOG_DIR?: string

  // redis
  REDIS_HOST?: string
  REDIS_PASSWORD?: string
  REDIS_PORT?: number
  REDIS_DB?: number
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,

    TOKEN_Prod: process.env.TOKEN_Prod,
    TOKEN_Test: process.env.TOKEN_Test,
    MONGO_Prod: process.env.MONGO_Prod,
    MONGO_Test: process.env.MONGO_Test,
    CLIENT_ID_Prod: process.env.CLIENT_ID_Prod,
    CLIENT_SECRET_Prod: process.env.CLIENT_SECRET_Prod,
    CLIENT_ID_Test: process.env.CLIENT_ID_Test,
    CLIENT_SECRET_Test: process.env.CLIENT_SECRET_Test,

    LOG_LEVEL: process.env.LOG_LEVEL ?? 'verbose',
    LOG_DIR: process.env.LOG_DIR ?? path.resolve(process.cwd(), 'logs'),

    // Redis config
    REDIS_HOST: process.env.REDIS_HOST ?? '127.0.0.1',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? '',
    REDIS_PORT: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    REDIS_DB: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : 0
  }
}

const envConfig = getConfig()

export default envConfig
