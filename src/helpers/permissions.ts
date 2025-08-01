import type { PermissionResolvable } from 'discord.js'

const permissions: Record<string, string> = {
  AddReactions: 'Add Reactions',
  Administrator: 'Administrator',
  AttachFiles: 'Attach files',
  BanMembers: 'Ban members',
  ChangeNickname: 'Change nickname',
  Connect: 'Connect',
  CreateInstantInvite: 'Create instant invite',
  CreatePrivateThreads: 'Create private threads',
  CreatePublicThreads: 'Create public threads',
  DeafenMembers: 'Deafen members',
  EmbedLinks: 'Embed links',
  KickMembers: 'Kick members',
  ManageChannels: 'Manage channels',
  ManageEmojisAndStickers: 'Manage emojis and stickers',
  ManageEvents: 'Manage Events',
  ManageGuild: 'Manage server',
  ManageMessages: 'Manage messages',
  ManageNicknames: 'Manage nicknames',
  ManageRoles: 'Manage roles',
  ManageThreads: 'Manage Threads',
  ManageWebhooks: 'Manage webhooks',
  MentionEveryone: 'Mention everyone',
  ModerateMembers: 'Moderate Members',
  MoveMembers: 'Move members',
  MuteMembers: 'Mute members',
  PrioritySpeaker: 'Priority speaker',
  ReadMessageHistory: 'Read message history',
  RequestToSpeak: 'Request to Speak',
  SendMessages: 'Send messages',
  SendMessagesInThreads: 'Send Messages In Threads',
  SendTTSMessages: 'Send TTS messages',
  Speak: 'Speak',
  Stream: 'Video',
  UseApplicationCommands: 'Use Application Commands',
  UseEmbeddedActivities: 'Use Embedded Activities',
  UseExternalEmojis: 'Use External Emojis',
  UseExternalStickers: 'Use External Stickers',
  UseVAD: 'Use voice activity',
  ViewAuditLog: 'View audit log',
  ViewChannel: 'View channel',
  ViewGuildInsights: 'View server insights'
}

export function parsePermissions(perms: PermissionResolvable[]) {
  const permissionWord = `permission${perms.length > 1 ? 's' : ''}`
  return '`' + perms.map((perm) => permissions[perm as string] || perm).join(', ') + '` ' + permissionWord
}
