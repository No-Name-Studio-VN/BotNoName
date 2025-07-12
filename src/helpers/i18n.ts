import type { Guild, User } from 'discord.js'
import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import path from 'path'

import { allLanguages, allSupportedLangs, cacheDuration, defaultLang } from '@/config/i18n.js'
import logger from '@/handlers/logger'
import { cacheGet, cacheSet } from '@/handlers/redis'
import type { GuildDocument } from '@/models/guild.model'
import type { UserDocument } from '@/models/user.model'
import { getGuild } from '@/services/guild.service'
import { getUser } from '@/services/user.service'

const i18nextBot = i18next.createInstance()
i18nextBot.use(i18nextBackend)

function getContextLang({
  guildSetting,
  userSetting
}: {
  guildSetting?: GuildDocument
  userSetting?: UserDocument
}): string {
  if (!guildSetting && !userSetting) return defaultLang
  return (guildSetting?.force_server_language ? guildSetting.language : userSetting?.language) || defaultLang
}

/**
 * @param {string} languageCode
 * @throws {Error} If language file cannot be loaded
 * @returns {Promise<Object>}
 */
async function loadLanguage(languageCode: string) {
  try {
    const filePath = path.resolve(process.cwd(), 'src/languages', `${languageCode}.json`)
    const file = await import(filePath)
    return file
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : `Failed to load language file for ${languageCode}`)
  }
}

export const languageOptions = Object.entries(allLanguages).map(([key, language]) => ({
  value: key,
  label: language.name === language.nativeName ? language.name : `${language.name} - ${language.nativeName}`,
  name: language.name
}))

export async function i18nInit({ guild, user }: { guild?: Guild; user?: User }) {
  if (!guild && !user) {
    throw new Error('Either guild or user must be provided')
  }

  try {
    const [guildData, userSettings] = await Promise.all([
      guild ? getGuild({ _id: guild.id }) : null,
      user ? getUser({ _id: user.id }) : null
    ])

    const languageCode = getContextLang({
      guildSetting: guildData as GuildDocument,
      userSetting: userSettings as UserDocument
    })

    const cacheKey = `langFile:${languageCode}`
    let languageData = await cacheGet(cacheKey)

    if (!languageData) {
      languageData = await loadLanguage(languageCode)
      await cacheSet(cacheKey, languageData, cacheDuration)
    }

    if (!i18nextBot.isInitialized) {
      await i18nextBot.init({
        lng: languageCode,
        debug: false,
        fallbackLng: defaultLang,
        preload: allSupportedLangs,
        backend: {
          loadPath: './src/languages/{{lng}}.json'
        }
      })
    } else if (i18nextBot.language !== languageCode) {
      await i18nextBot.changeLanguage(languageCode)
    }

    return i18nextBot
  } catch (error) {
    logger.error(`i18n initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      guildId: guild?.id,
      userId: user?.id
    })
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize i18n')
  }
}
