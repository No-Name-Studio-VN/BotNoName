import type { Message, OmitPartialGroupDMChannel } from 'discord.js'
import fs from 'fs/promises'
import type { i18n } from 'i18next'
import DOMPurify from 'isomorphic-dompurify'
import { isEmpty } from 'lodash-es'
import path from 'path'

import * as CONFIG from '@/config/chatbot'
import type { BotClient } from '@/helpers/botClient'
import { ErrorEmbed } from '@/helpers/embedTemplate'
import { i18nInit } from '@/helpers/i18n'
import type { ChatbotResponse } from '@/types/chatbot'

import logger from './logger'
import { cacheGet, cacheSet } from './redis'

const ChatbotDataFilePath = path.resolve(process.cwd(), 'store/messageChatbot.json')

const PREDEFINED_RESPONSES = {
  surprise: 'Mother Fucker',
  hello: (author: string) => `Yo ${author} :V`,
  hi: (author: string) => `Aloha ${author}. :V`,
  'hey dude': (author: string) => `Địt nhau không ${author} :)))`,
  mlem: 'Đấy là biểu hiện của sự dâm tặc -.-',
  'Tôi có người yêu rồi nè.': `Thôi mày bớt xạo đi thằng ml. Thích người ta ${
    Math.floor(Math.random() * 10) + 1
  } năm rồi mà bị từ chối. Nhục -.-\nMà mày ngu thì chết chứ khóc lóc cái đếu gì. :)`
} as const

const SPECIAL_IMAGE_URL =
  'https://media.discordapp.net/attachments/747084985823133698/808638224712073227/134827215_1189270614804221_7022512776428040012_n.png'

export default async function (client: BotClient, message: OmitPartialGroupDMChannel<Message>) {
  const i18next = await i18nInit({ user: message.author })

  try {
    const remaining = await getRemainingCooldown(message.author.id)
    if (remaining > 0) {
      return ErrorEmbed(message, {
        description: i18next.t('chatbot.cooldown'),
        duration: 5000,
        method: 'reply'
      })
    }

    await applyCooldown(message.author.id)
    const input = message.content?.trim()
    if (isEmpty(input)) return

    message.channel.sendTyping()

    const data = await readDataFile()
    return input.includes('hd:') && input.includes('rep:')
      ? handleHdRepInput(message, data)
      : handleDefaultInput(message, data, i18next)
  } catch (error) {
    logger.error('Chatbot handler error:', error)
    return ErrorEmbed(message, {
      description: i18next.t('chatbot.error'),
      method: 'reply'
    })
  }
}

async function handleHdRepInput(message: Message, data: ChatbotResponse) {
  const input = message.content.toLowerCase().trim()

  const parts = input.split('rep:')
  if (parts.length < 2) {
    return ErrorEmbed(message, {
      description: 'Sai cú pháp rồi bạn ơi.',
      method: 'reply'
    })
  }

  const hdContent = parts[0].split('hd:')[1]?.trim()
  const repContent = parts[1]?.trim()

  if (isEmpty(hdContent) || isEmpty(repContent)) {
    return ErrorEmbed(message, {
      description: 'Sai cú pháp rồi bạn ơi.',
      method: 'reply'
    })
  }

  const sanitizedHdContent = DOMPurify.sanitize(hdContent).toString().toLowerCase()
  const sanitizedRepContent = DOMPurify.sanitize(repContent).toString()

  // Initialize array if key doesn't exist, then add the response
  if (!data[sanitizedHdContent]) {
    data[sanitizedHdContent] = []
  }
  data[sanitizedHdContent].push(sanitizedRepContent)

  try {
    const response = await toFile(data)
    return message.reply(response)
  } catch (error) {
    logger.error('Failed to save chatbot data:', JSON.stringify(error))
    return ErrorEmbed(message, {
      description: 'Có lỗi xảy ra khi ghi dữ liệu.',
      method: 'reply',
      ephemeral: false
    })
  }
}

async function handleDefaultInput(message: Message, data: ChatbotResponse, i18next: i18n) {
  const input = message.content.toLowerCase().trim()
  const predefinedResponse = getPredefinedResponse(message, input)

  if (predefinedResponse) {
    return message.reply(predefinedResponse)
  }

  if (data[input]) {
    const responses = data[input]
    return message.reply(responses[Math.floor(Math.random() * responses.length)])
  }

  return handleChatResponse(message, i18next)
}

async function handleChatResponse(message: Message, i18next: i18n) {
  try {
    const tokenCount = await checkTokenCount(message.content)
    if (tokenCount > CONFIG.MAX_TOKENS) {
      return ErrorEmbed(message, {
        description: i18next.t('chatbot.tokenExceeded'),
        method: 'reply',
        ephemeral: false
      })
    }

    await message.reply('Just testing the chat response feature. Please wait...')
  } catch (error) {
    logger.error('Chat response error:', error)
    throw error
  }
}

function getPredefinedResponse(message: Message, input: string): string | null {
  const author = message.author.toString()

  // Check direct matches first
  const directResponse = PREDEFINED_RESPONSES[input as keyof typeof PREDEFINED_RESPONSES]
  if (directResponse) {
    return typeof directResponse === 'function' ? directResponse(author) : directResponse
  }

  // Check pattern matches
  if (input.startsWith('bye')) {
    return `Bye ${author}.`
  }

  // Check content-based matches (use original content for case sensitivity)
  const originalContent = message.content
  if (originalContent.includes('oni-chan') && originalContent.includes('loli')) {
    return SPECIAL_IMAGE_URL
  }

  return null
}

/**
 * Calculate token count for input validation
 * @param input - User input string
 * @returns Token count estimate or max+1 for invalid input
 */
async function checkTokenCount(input: string): Promise<number> {
  if (isEmpty(input)) {
    return CONFIG.MAX_TOKENS + 1
  }

  try {
    const payload = {
      contents: [
        {
          role: 'user' as const,
          parts: [{ text: input }]
        }
      ]
    }
    return JSON.stringify(payload).length
  } catch (error) {
    logger.error('Token count calculation failed:', error)
    return CONFIG.MAX_TOKENS + 1
  }
}

/**
 * Asynchronously read and parse the JSON data file
 * @returns Parsed JSON data as ChatbotResponse
 * @throws {Error} If file reading or parsing fails
 */
async function readDataFile() {
  const rawData = await fs.readFile(ChatbotDataFilePath, {
    encoding: 'utf-8'
  })
  return JSON.parse(rawData)
}

/**
 * Asynchronously write the data to the file
 */
async function toFile(data: ChatbotResponse) {
  await fs.writeFile(ChatbotDataFilePath, JSON.stringify(data, null, 2))
  return 'nhớ rồi, lần sau nói lại nhé.'
}

/**
 * Apply cooldown for the user after sending a message
 */
async function applyCooldown(memberId: string) {
  const key = `chatcooldown:${memberId}`
  await cacheSet(key, Date.now(), CONFIG.COOLDOWN_SECONDS)
}

/**
 * Get the remaining cooldown for the user
 */
async function getRemainingCooldown(memberId: string) {
  const key = `chatcooldown:${memberId}`
  const cachedValue = await cacheGet(key)
  if (cachedValue) {
    const remaining = (Date.now() - Number(cachedValue)) * 0.001
    return CONFIG.COOLDOWN_SECONDS - remaining
  }
  return 0
}
