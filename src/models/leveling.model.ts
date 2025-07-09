import mongoose from 'mongoose'

import { DEFAULT_BACKGROUND_URL } from '@/config/leveling'

export interface LevelingDocument extends mongoose.Document {
  guildId: string
  userId: string
  xp: number
  level: number
  backgroundURL: string
  createdAt: Date
  updatedAt: Date
}

const levelingSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 0,
    min: 0
  },
  backgroundURL: {
    type: String,
    default: DEFAULT_BACKGROUND_URL
  }
})

export default mongoose.model<LevelingDocument>('leveling', levelingSchema)
