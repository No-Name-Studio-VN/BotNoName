import { GuildMember, User } from 'discord.js'

/**
 * Gets the most appropriate display name for a User or GuildMember.
 */
export const getUserName = (user: User | GuildMember | null | undefined): string => {
  if (!user) {
    return 'N/A'
  }

  return user.displayName
}
