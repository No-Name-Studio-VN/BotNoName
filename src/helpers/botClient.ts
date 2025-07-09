import type { ClientOptions } from 'discord.js'
import { Client, Collection } from 'discord.js'

import DiscordClientConfig from '@/config/DiscordClient.js'
import logger from '@/handlers/logger.js'
import type { ContextCommand, SlashCommand } from '@/types/Command'

export class BotClient extends Client {
  static #instance: BotClient | null = null
  #handlers = ['index']
  messageCommands: Collection<string, SlashCommand> = new Collection()
  slashCommands: Collection<string, SlashCommand> = new Collection()
  contextCommands: Collection<string, ContextCommand> = new Collection()
  recent: Set<string> = new Set() // For XP cooldowns

  constructor(options: ClientOptions = DiscordClientConfig) {
    if (BotClient.#instance) {
      return BotClient.#instance
    }
    super(options)
    BotClient.#instance = this
  }

  static getInstance(options: ClientOptions = DiscordClientConfig) {
    if (!BotClient.#instance) {
      BotClient.#instance = new BotClient(options)
    }
    return BotClient.#instance
  }

  static destroyInstance() {
    BotClient.#instance = null
  }

  async loadHandlers() {
    for (const handler of this.#handlers) {
      import(`@/handlers/${handler}.js`)
        .then((module) => {
          const handlerFunction = module.default || module
          if (typeof handlerFunction === 'function') {
            handlerFunction(this)
          } else {
            logger.error(`Handler ${handler} is not a function.`)
          }
        })
        .catch((error) => {
          logger.error(`Failed to load handler ${handler}: ${error.message}`)
        })
    }
  }
}
