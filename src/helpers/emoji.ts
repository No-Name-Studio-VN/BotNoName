/**
 * Parse emojis from a particular content string.
 * It supports both custom Discord emojis and standard Unicode emojis.
 * Returns an array of objects containing emoji details or null if no emojis are found.
 */
export async function parseEmojis(content: string) {
  if (!content) throw new Error('No content provided')

  const EmoteRegex = /<a?:([^:]+):(\d+)>|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu
  const imageUrl = `https://cdn.discordapp.com/emojis/`

  const matches = content.match(EmoteRegex) || []
  const uniqueEmojis = [...new Set(matches)]

  const links = uniqueEmojis
    .map((i) => {
      const emoteMatch = i.match(/<a?:([^:]+):(\d+)>/)
      if (emoteMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, name, id] = emoteMatch
        const animated = i.startsWith('<a:')
        const link = `${imageUrl}${id}${animated ? '.gif' : '.png'}`
        return { name, id, tag: i, link, animated }
      }
      return null
    })
    .filter(Boolean)

  return links.length ? links : null
}
