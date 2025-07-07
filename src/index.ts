import util from 'util'

import DiscordClientConfig from '@/config/DiscordClient.js'
import logger from '@/handlers/logger.js'
import { BotClient } from '@/helpers/botClient.js'
import { getBotStats } from '@/helpers/botUtils'
import envConfig from '@/lib/env.js'

import { getMongooseConnection, getRedisClient } from './handlers/dbinit'

const initializeBot = async () => {
  try {
    await getRedisClient()
    await getMongooseConnection()

    const client = BotClient.getInstance(DiscordClientConfig)
    const isProduction = envConfig.NODE_ENV === 'production'

    // Login
    await client.login(isProduction ? envConfig.TOKEN_Prod : envConfig.TOKEN_Test)

    // Get and log stats
    const appStats = await getBotStats(client)
    logger.info(
      `🟢🟢🟢 ${isProduction ? 'Production' : 'Development'} || ${appStats.bot.username} - ${appStats.system.versions.os} - ${appStats.bot.id} 🟢🟢🟢 !`
    )
    logger.debug(
      `NodeJS: ${appStats.system.versions.node}, DiscordJS: ${appStats.system.versions.discord}, OS: ${appStats.system.versions.os}`
    )

    const enabledFeatures = ['messageIntent', 'messageCommand', 'interactionCommand', 'dashboard']
      .filter((feature) => appStats.features[feature as keyof typeof appStats.features].enabled)
      .join(', ')
    logger.debug(`Enabled features: ${enabledFeatures}`)

    // Load handlers
    await client.loadHandlers()
  } catch (error) {
    logger.error('Failed to initialize bot:', error)
    // Graceful shutdown
    process.exit(1)
  }
}

initializeBot()

process.on('uncaughtException', (err) => {
  logger.error(`[UNCAUGHT] Exception at: ` + err + '\n')
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `"[FATAL] Rejection at: Promise ${util.inspect(promise, { showHidden: true, depth: 3 })} \n reason: ${reason}\n`
  )
})

process.on('uncaughtExceptionMonitor', (err, origin) => {
  logger.error(`[Error_Handling] :: Uncaught Exception/Catch (MONITOR)\n ${err} ${origin} \n`)
})
