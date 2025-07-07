import mongoose from 'mongoose'

import { defaultLang } from '@/config/i18n'

export interface GuildDocument extends mongoose.Document {
  guildId: string
  prefix: string
  language: string
  force_server_language: boolean
  manager_roles: string[]
  disabledCommands: string[]
  isPremium: boolean
  premium: {
    redeemedBy: {
      id: string
      tag: string
    }
    redeemedAt: Date
    expiresAt: Date
    plan: string
  }
  LevelingUserNotify: boolean
  moderation: {
    logChannelId: string
    mute_role: string
    delete_after_executed: boolean
    delete_reply: boolean
    include_reason: boolean
    remove_roles: boolean
    ban_action: number
    kick_action: number
    warn_action: number
    mute_action: number
    ban_message: {
      toggle: boolean
      message: string
    }
    auto_punish: {
      toggle: boolean
      amount: number
      punishment: number
      dm: number
    }
    channel: string
    caseN: number
    color: string
    toggle: boolean
    ban: boolean
    kick: boolean
    mute: boolean
    role: boolean
    purge: boolean
    lock: boolean
    warns: boolean
    muteRole: string
    slowmode: {
      toggle: boolean
      time: number
    }
    automod: {
      toggle: boolean
      ignore_bots: boolean
      debug: boolean
      strikes: number
      action: number
      wh_channels: string[]
      anti_attachments: number
      anti_invites: number
      anti_links: number
      anti_toxic: number
      anti_ghostping: number
      anti_massmention: number
      max_lines: number
      max_mentions: number
      max_role_mentions: number
      ignore_role: string[]
      modlog_channel: string
    }
  }
}

const guildSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      default: 'nn_'
    },
    language: {
      type: String,
      default: defaultLang
    },
    force_server_language: {
      type: Boolean,
      default: false
    },
    manager_roles: [String],
    disabledCommands: [String],
    isPremium: {
      type: Boolean,
      default: false
    },
    premium: {
      redeemedBy: {
        id: String,
        tag: String
      },
      redeemedAt: Date,
      expiresAt: Date,
      plan: String
    },
    LevelingUserNotify: {
      type: Boolean,
      default: false
    },
    moderation: {
      logChannelId: String,
      mute_role: String,
      delete_after_executed: {
        type: Boolean,
        default: false
      },
      delete_reply: {
        type: Boolean,
        default: false
      },
      include_reason: {
        type: Boolean,
        default: false
      },
      remove_roles: {
        type: Boolean,
        default: false
      },
      ban_action: {
        type: Number,
        default: 0
      },
      kick_action: {
        type: Number,
        default: 0
      },
      warn_action: {
        type: Number,
        default: 0
      },
      mute_action: {
        type: Number,
        default: 0
      },
      ban_message: {
        toggle: {
          type: Boolean,
          default: false
        },
        message: String
      },
      auto_punish: {
        toggle: {
          type: Boolean,
          default: false
        },
        amount: {
          type: Number,
          default: 1
        },
        punishment: {
          type: Number,
          default: 1
        },
        dm: {
          type: Number,
          default: 1
        }
      },

      channel: String,
      caseN: {
        type: Number,
        default: 1
      },
      color: {
        type: String,
        default: '#000000'
      },
      toggle: {
        type: Boolean,
        default: false
      },

      ban: {
        type: Boolean,
        default: true
      },
      kick: {
        type: Boolean,
        default: true
      },
      mute: {
        type: Boolean,
        default: true
      },
      role: {
        type: Boolean,
        default: true
      },
      purge: {
        type: Boolean,
        default: true
      },
      lock: {
        type: Boolean,
        default: true
      },
      warns: {
        type: Boolean,
        default: true
      },
      muteRole: String,
      slowmode: {
        toggle: { type: Boolean, default: false },
        time: { type: Number, default: 0 }
      },
      automod: {
        toggle: { type: Boolean, default: false },
        ignore_bots: { type: Boolean, default: false },
        debug: { type: Boolean, default: false },
        strikes: { type: Number, default: 10 },
        action: { type: Number, default: 0 },
        wh_channels: [String],
        anti_attachments: { type: Number, default: 0 },
        anti_invites: { type: Number, default: 0 },
        anti_links: { type: Number, default: 0 },
        anti_toxic: { type: Number, default: 0 },
        anti_ghostping: { type: Number, default: 0 },
        anti_massmention: { type: Number, default: 0 },
        max_lines: Number,
        max_mentions: Number,
        max_role_mentions: Number,
        ignore_role: [String],
        modlog_channel: String
      }
    }
  },
  { timestamps: true }
)

export default mongoose.model<GuildDocument>('Guild', guildSchema)
