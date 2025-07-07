import fs from 'fs'
import path from 'path'

/** @const {number} */
const THIRTY_DAYS_IN_SECONDS = 2592000

/** @const {string} */
const JSON_EXTENSION = '.json'

/**
 * @typedef {Object} I18nConfig
 * @property {string} defaultLanguage - Default language code
 * @property {string} languageDir - Path to language files
 * @property {number} cacheDuration - Cache duration in seconds
 */

/** @type {I18nConfig} */
const CONFIG = Object.freeze({
  defaultLanguage: 'en',
  languageDir: path.resolve(process.cwd(), 'src/languages'),
  cacheDuration: THIRTY_DAYS_IN_SECONDS
})

/**
 * Custom error class for i18n-related errors.
 * @extends {Error}
 */
class I18nError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'I18nError'
  }
}

/**
 * Retrieves list of supported languages from the language directory.
 * @throws {I18nError} If language directory is not accessible
 * @returns {string[]} Array of supported language codes
 */
const getSupportedLanguages = () => {
  try {
    if (!fs.existsSync(CONFIG.languageDir)) {
      throw new I18nError('Language directory does not exist')
    }

    return fs
      .readdirSync(CONFIG.languageDir)
      .filter((file) => file.endsWith(JSON_EXTENSION))
      .map((file) => file.slice(0, -JSON_EXTENSION.length))
  } catch (error: Error | unknown) {
    throw new I18nError(
      error instanceof I18nError
        ? error.message
        : `Failed to read language directory: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

const supportedLanguages = Object.freeze(getSupportedLanguages())

export const defaultLang = CONFIG.defaultLanguage
export const allSupportedLangs = supportedLanguages
export const cacheDuration = CONFIG.cacheDuration
export const allLanguages = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  jp: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' }
}
