import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import envConfig from '@/lib/env.js'

class LogHandler {
  static #instance: LogHandler | null = null
  #logger: winston.Logger | null = null

  constructor() {
    if (LogHandler.#instance) {
      return LogHandler.#instance
    }
    this.#initLogger()
    LogHandler.#instance = this
  }

  #initLogger() {
    const logLevel = envConfig.LOG_LEVEL || 'verbose'
    const logDir = envConfig.LOG_DIR || 'logs'

    const logFormat = winston.format.printf(
      ({ timestamp, level, message, stack }) => `${timestamp} | ${level}: ${stack ? `${message}\n${stack}` : message}`
    )

    const baseFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      logFormat
    )

    const consoleTransport = new winston.transports.Console({
      level: logLevel,
      format: winston.format.combine(winston.format.colorize(), baseFormat)
    })

    const fileTransport = new DailyRotateFile({
      level: logLevel,
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      maxSize: '20m',
      maxFiles: '14d',
      format: baseFormat
    })

    const transports = [consoleTransport, fileTransport]

    this.#logger = winston.createLogger({
      level: logLevel,
      transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports
    })
  }

  static getInstance(): LogHandler {
    if (!LogHandler.#instance) {
      LogHandler.#instance = new LogHandler()
    }
    return LogHandler.#instance
  }

  getLogger(): winston.Logger {
    if (!this.#logger) {
      throw new Error('Logger not initialized. Call getInstance() first.')
    }
    return this.#logger
  }
}

const logger = LogHandler.getInstance().getLogger()
export default logger
