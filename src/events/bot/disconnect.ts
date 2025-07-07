import logger from '@/handlers/logger'
import type { BotClient } from '@/helpers/botClient'

export default (client: BotClient) => {
  logger.error(client.user?.username + ' has disconnected from Discord!')
}
