import mongoose from 'mongoose'

export interface EconomyUserDocument extends mongoose.Document {
  _id: string
  balance: {
    cash: number
    gem: number
  }
  bank: {
    cash: number
    gem: number
  }
  daily: {
    streak: number
    timestamp: Date
  }
  xp: number
  reputation: number
  createdAt: Date
  updatedAt: Date
}

const economySchema = new mongoose.Schema(
  {
    _id: String,
    balance: {
      cash: { type: Number, default: 0 },
      gem: { type: Number, default: 0 }
    },
    bank: {
      cash: { type: Number, default: 0 },
      gem: { type: Number, default: 0 }
    },
    daily: {
      streak: {
        type: Number,
        default: 0
      },
      timestamp: Date
    },
    xp: {
      type: Number,
      default: 0
    },
    reputation: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model<EconomyUserDocument>('economy', economySchema)
