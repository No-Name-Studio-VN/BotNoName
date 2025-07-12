import mongoose from 'mongoose'

export interface TransactionDocument extends mongoose.Document {
  userId: string
  type: 'deposit' | 'withdraw'
  location?: 'bank' | 'balance'
  currency: string
  amount: number
  source: string
  content: string
  createdAt: Date
  updatedAt: Date
}

// Define the Transaction schema
const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'withdraw'],
      required: true
    },
    location: {
      type: String,
      enum: ['bank', 'balance']
    },
    currency: String,
    amount: Number,
    source: String,
    content: String
  },
  {
    timestamps: true
  }
)

export default mongoose.model<TransactionDocument>('transaction', transactionSchema)
