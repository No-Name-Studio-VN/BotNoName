import { isEmpty, isInteger } from 'lodash-es'

import EconomyConfig from '@/config/economy'
import { diffHours, getRemainingTime } from '@/helpers/time'
import EconomyTransactionModel from '@/models/economy.transaction.model'
import { EconomyUserDocument } from '@/models/economy.user.model'
import { getUserEconomy } from '@/services/economy.user.service'

const Errors = {
  MISSING_PARAMETERS: 'Missing required parameters',
  ECONOMY_NOT_FOUND: 'Economy not found',
  INVALID_PARAMETERS: (name: string) => `Invalid ${name}`
}

const throwError = (errorType: string | ((detail: string) => string), detail = '') => {
  if (typeof errorType === 'string') throw new Error(errorType)
  else throw new Error(errorType(detail))
}

class Economy {
  userDb: EconomyUserDocument
  LevelingRate: number

  /**
   * @description A promise that represents an in-flight save operation.
   * This prevents parallel save errors by ensuring only one save is active at a time.
   * Subsequent calls will await the existing promise.
   */
  private _savePromise: Promise<EconomyUserDocument> | null = null

  constructor(database: EconomyUserDocument) {
    this.userDb = database
    this.LevelingRate = 0.1
  }

  get userEconomy() {
    return this.userDb
  }

  /**
   * Calculate the level based on XP and rate
   */
  get level() {
    return Math.floor(this.LevelingRate * Math.sqrt(this.userEconomy.xp)) + 1
  }

  /**
   * Create a new Economy instance for the given user ID
   */
  static async init(id: string) {
    if (isEmpty(id)) throwError(Errors.INVALID_PARAMETERS, '_id')
    const userDb = await getUserEconomy({ _id: id })
    if (!userDb) throwError(Errors.ECONOMY_NOT_FOUND)
    return new Economy(userDb)
  }

  static formatCurrency(amount: number) {
    return Intl.NumberFormat().format(amount)
  }

  /**
   * @description OPTIMIZED: A managed save method to prevent parallel save errors.
   * It queues save requests by returning the existing save promise if one is already in flight.
   * This ensures all in-memory changes are batched into the next successful save.
   */
  private commitChanges(): Promise<EconomyUserDocument> {
    // If a save operation is already in progress, return its promise.
    // This effectively "queues" the caller to wait for the current save to finish.
    if (this._savePromise) {
      return this._savePromise
    }

    // If no save is in progress, start a new one and store its promise.
    // The `finally` block ensures we clear the promise after it settles (resolves or rejects).
    this._savePromise = this.userDb.save().finally(() => {
      this._savePromise = null
    })

    return this._savePromise
  }

  validateInput(name: string, value: unknown) {
    if (!name || value === undefined) throwError(Errors.MISSING_PARAMETERS)
    const validations: Record<string, () => boolean> = {
      amount: () => isInteger(value) && (value as number) >= 0,
      currency: () => ['cash', 'gem'].includes(value as string),
      type: () => ['deposit', 'withdraw'].includes(value as string),
      location: () => ['bank', 'balance'].includes(value as string),
      content: () => !isEmpty(value) && (value as string).length <= 2000,
      source: () => !isEmpty(value) && (value as string).length <= 1000
    }
    const isValid = validations[name] ? validations[name]() : false
    if (!isValid) throwError(Errors.INVALID_PARAMETERS, name)
    return value
  }

  async modifyBalance(params: {
    currency: string
    amount: number
    location: string
    type: string
    source: string
    content: string
  }) {
    const { currency, amount, location, type } = params

    ;['currency', 'amount', 'source', 'content', 'location'].forEach((field) =>
      this.validateInput(field, params[field as keyof typeof params])
    )

    const operation = type === 'deposit' ? amount : -amount
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(this.userEconomy[location as keyof Pick<EconomyUserDocument, 'balance' | 'bank'>] as any)[currency] += operation

    const transaction = await this.createTransaction(params)

    await this.commitChanges()
    return transaction
  }

  async addBalance(params: { currency: string; amount: number; location: string; source: string; content: string }) {
    return this.modifyBalance({ ...params, type: 'deposit' })
  }

  async deductBalance(params: { currency: string; amount: number; location: string; source: string; content: string }) {
    return this.modifyBalance({ ...params, type: 'withdraw' })
  }

  async giveDailyReward() {
    const userDb = this.userEconomy
    let streak = 0

    const now = new Date()
    if (userDb.daily.timestamp) {
      const lastUpdated = new Date(userDb.daily.timestamp)
      const difference = diffHours(now, lastUpdated)
      if (difference < 24) {
        const remainingTime = await getRemainingTime(lastUpdated)
        throwError(remainingTime)
      }
      streak = userDb.daily.streak || streak
      if (difference < 24 * 2) {
        streak += 1
      } else {
        streak = 0
      }
    }

    userDb.daily.streak = streak
    userDb.daily.timestamp = new Date()

    await this.addBalance({
      currency: 'cash',
      amount: Math.round(EconomyConfig.DailyCoins + streak * 0.06 * EconomyConfig.DailyCoins),
      content: 'Daily reward streak ' + streak,
      source: 'Bot No Name',
      location: 'balance'
    })

    return this
  }

  async createTransaction({
    type,
    amount,
    source = 'unknown',
    currency,
    location,
    content
  }: {
    type: string
    amount: number
    source?: string
    currency: string
    location: string
    content?: string
  }) {
    if (!type || !amount || !location || !currency) throwError('Missing required parameters')

    const transaction = new EconomyTransactionModel({
      userId: this.userDb._id,
      type: this.validateInput('type', type),
      location: this.validateInput('location', location),
      currency: this.validateInput('currency', currency),
      amount: this.validateInput('amount', amount),
      source: this.validateInput('source', source),
      content: this.validateInput('content', content) || null
    })

    await transaction.save()
    return transaction
  }

  async addXp(xp: number) {
    if (!this.validateInput('amount', xp)) throwError(Errors.INVALID_PARAMETERS, 'xp')

    this.userEconomy.xp += xp
    await this.commitChanges()
    return this
  }

  async addRep(amount: number) {
    if (!this.validateInput('amount', amount)) throwError(Errors.INVALID_PARAMETERS, 'rep')

    this.userEconomy.reputation += amount
    await this.commitChanges()
    return this
  }
}

export default Economy
