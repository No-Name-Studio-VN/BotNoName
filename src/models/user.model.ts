import mongoose from 'mongoose'

import { defaultLang } from '@/config/i18n'

export interface AfkDetail {
  enabled: boolean
  reason: string
  time: Date
}

export interface GuildAfkDetail extends AfkDetail {
  guildId: string
}

export interface UserDocument extends mongoose.Document {
  _id: string
  nationality?: string
  language: string
  premium?: boolean
  chatGPTModule?: boolean
  loginLogs: Array<{
    ip: string
    agent: string
    location: string
    referrer: string
    timestamp: Date
  }>
  reputation: {
    received: number
    given: number
    timestamp?: Date
  }
  config: {
    signinNotificationViaDiscord: boolean
  }
  afk: {
    global: AfkDetail
    guilds: GuildAfkDetail[]
  }
  hasMigratedNotepad: boolean
  fullName: string
  createdAt: Date
  updatedAt: Date
}

const loginLogsSchema = new mongoose.Schema({
  ip: String,
  agent: String,
  location: String,
  referrer: String,
  timestamp: { type: Date, default: Date.now }
})

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new mongoose.Types.ObjectId().toString()
      }
    },
    nationality: {
      type: String,
      required: false
    },
    language: {
      type: String,
      default: defaultLang
    },
    premium: {
      type: Boolean
    },
    chatGPTModule: Boolean,
    loginLogs: [loginLogsSchema],
    reputation: {
      received: {
        type: Number,
        default: 0
      },
      given: {
        type: Number,
        default: 0
      },
      timestamp: Date
    },
    config: {
      signinNotificationViaDiscord: {
        type: Boolean,
        default: true
      }
    },
    afk: {
      global: {
        enabled: {
          type: Boolean,
          default: false
        },
        reason: {
          type: String,
          default: ''
        },
        time: Date
      },
      guilds: [
        {
          guildId: {
            type: String,
            required: true
          },
          enabled: {
            type: Boolean,
            default: false
          },
          reason: {
            type: String,
            default: ''
          },
          time: Date
        }
      ]
    },
    hasMigratedNotepad: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model<UserDocument>('User', userSchema)
