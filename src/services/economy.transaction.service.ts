import { FilterQuery, QueryOptions } from 'mongoose'

import EconomyTransactionModel, { TransactionDocument } from '@/models/economy.transaction.model'

export async function getTransaction(query: FilterQuery<TransactionDocument>, options: QueryOptions = { lean: false }) {
  const transaction = await EconomyTransactionModel.findOne(query, null, options)
  return transaction
}
