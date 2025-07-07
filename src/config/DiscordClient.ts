import type { ClientOptions } from 'discord.js'
import { GatewayIntentBits, Partials } from 'discord.js'

const DiscordClientConfig: ClientOptions = {
  allowedMentions: {
    parse: ['users', 'roles']
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.AutoModerationConfiguration
  ],
  partials: [Partials.Channel, Partials.Message]
}

export default DiscordClientConfig
