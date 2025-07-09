import mongoose from 'mongoose'

import { AnnouncementType, DEFAULT_LEVEL_UP_MESSAGE, NoXpType } from '@/config/leveling'

export interface LevelingConfigDocument extends mongoose.Document {
  guildId: string
  enabled: boolean
  xp_rate: number
  voice_xp: boolean
  level_up_announcement_type: number
  level_up_announcement_message: string
  level_up_announcement_delete_after: number
  level_up_announcement_channel?: string
  disable_pro_members_xp_boost: boolean
  noxp: {
    role_type: number
    roles_exempted?: string[]
    channel_type: number
    channels_exempted?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const levelingConfig = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
      index: true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    xp_rate: {
      type: Number,
      default: 1,
      min: 0
    },
    voice_xp: {
      type: Boolean,
      default: false
    },
    level_up_announcement_type: {
      type: Number,
      default: AnnouncementType.NONE,
      enum: Object.values(AnnouncementType)
    },
    level_up_announcement_message: {
      type: String,
      default: DEFAULT_LEVEL_UP_MESSAGE
    },
    level_up_announcement_delete_after: {
      type: Number,
      default: 0,
      min: 0
    },
    level_up_announcement_channel: String,
    disable_pro_members_xp_boost: {
      type: Boolean,
      default: false
    },
    noxp: {
      role_type: {
        type: Number,
        default: NoXpType.ALLOW_ALL,
        enum: Object.values(NoXpType)
      },
      roles_exempted: [String],
      channel_type: {
        type: Number,
        default: NoXpType.ALLOW_ALL,
        enum: Object.values(NoXpType)
      },
      channels_exempted: [String]
    }
  },
  { timestamps: true }
)

export default mongoose.model<LevelingConfigDocument>('leveling-config', levelingConfig)
