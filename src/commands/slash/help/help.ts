import type { Guild, InteractionEditReplyOptions, Message } from 'discord.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction
} from 'discord.js'

import commandCategories from '@/config/commandCategories'
import { CMDS_PER_PAGE, EMBED_COLORS } from '@/config/index'
import type { BotClient } from '@/helpers/botClient'
import type { SlashCommand } from '@/types/Command'

// Constants
const COLLECTOR_TIMEOUT = 5 * 60 * 1000
const COLLECTOR_IDLE = 60 * 1000

export default {
  name: 'help',
  cooldown: 5,
  description: 'Get help with the slash commands',
  type: 1,
  category: 'UTILITY',
  options: [
    {
      name: 'commands',
      type: 3,
      description: 'The slash command to know',
      required: false
    }
  ],
  async execute(interaction, client) {
    await interaction.deferReply()
    const commandName = interaction.options.getString('commands')

    if (!commandName) {
      const response = await getHelpMenu(client, interaction.guild!)
      const sentMsg = await interaction.editReply(response)
      return waiter(sentMsg, interaction.user.id)
    }

    const slashCommand = client.slashCommands.get(commandName)
    if (!slashCommand) {
      return interaction.editReply("This command doesn't exist or is either invalid.")
    }

    const embed = new EmbedBuilder()
      .setTitle(`Command Usage: ${slashCommand.name}`)
      .addFields(
        { name: 'Name 📥', value: `\`${slashCommand.name}\`` },
        { name: 'Description 📥', value: `\`${slashCommand.description}\`` },
        { name: 'Cooldown 📥', value: `\`${slashCommand.cooldown || 0}s\`` }
      )

    if (slashCommand.ownerOnly) {
      embed.addFields({ name: 'Owner Only 📥', value: '`Yes`' })
    }

    return interaction.editReply({ embeds: [embed] })
  }
} as SlashCommand

async function getHelpMenu(client: BotClient, guild: Guild): Promise<InteractionEditReplyOptions> {
  const options = Object.entries(commandCategories).map(([key, category]) => ({
    label: category.name,
    value: key,
    description: `View commands in ${category.name} category`,
    emoji: category.emoji
  }))

  const menuRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder('Choose the command category')
      .addOptions(options)
  )

  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId('previousBtn').setEmoji('⬅️').setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId('nextBtn').setEmoji('➡️').setStyle(ButtonStyle.Secondary).setDisabled(true)
  )

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(client.user!.displayAvatarURL())
    .setDescription(
      '**About Me:**\n' +
        `Hello I am ${guild.members.me!.displayName}!\n` +
        'A cool multipurpose discord bot which can serve all your needs\n\n' +
        `**Invite Me:** [Here](https://bot.nnsvn.me/invite)\n` +
        `**Support Server:** [Join](https://bot.nnsvn.me/discord)`
    )

  return { embeds: [embed], components: [menuRow, buttonsRow] }
}

const waiter = (msg: Message, userId: string): void => {
  const collector = msg.createMessageComponentCollector({
    filter: (interaction) => interaction.user.id === userId,
    idle: COLLECTOR_IDLE,
    time: COLLECTOR_TIMEOUT
  })

  let embeds: EmbedBuilder[] = []
  let currentPage = 0

  const updateButtons = (embedCount: number, page: number) => {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('previousBtn')
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === 0 || embedCount <= 1),
      new ButtonBuilder()
        .setCustomId('nextBtn')
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page >= embedCount - 1 || embedCount <= 1)
    )
  }

  const updateMessage = async (page: number = currentPage) => {
    if (!msg.editable || !embeds.length) return

    const components = [
      msg.components[0], // Keep menu row
      updateButtons(embeds.length, page)
    ]

    await msg.edit({ embeds: [embeds[page]], components })
  }

  collector.on('collect', async (interaction) => {
    await interaction.deferUpdate()

    switch (interaction.customId) {
      case 'help-menu':
        if (interaction instanceof StringSelectMenuInteraction) {
          embeds = getSlashCategoryEmbeds(msg.client as BotClient, interaction.values.join(''))
          currentPage = 0
          await updateMessage()
        }
        break

      case 'previousBtn':
        if (currentPage > 0) {
          currentPage--
          await updateMessage()
        }
        break

      case 'nextBtn':
        if (currentPage < embeds.length - 1) {
          currentPage++
          await updateMessage()
        }
        break
      default:
        return
    }
  })

  collector.on('end', async () => {
    if (msg.editable && msg.guild) {
      await msg.edit({ components: [] }).catch(() => {})
    }
  })
}

function getSlashCategoryEmbeds(client: BotClient, category: string): EmbedBuilder[] {
  const categoryKey = category as keyof typeof commandCategories
  const commands = Array.from(client.slashCommands.filter((cmd) => cmd.category === category).values())

  if (commands.length === 0) {
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setAuthor({ name: `${category} Commands` })
      .setDescription('No commands in this category')

    if (commandCategories[categoryKey]?.image) {
      embed.setThumbnail(commandCategories[categoryKey].image)
    }
    return [embed]
  }

  const pages: string[][] = []
  for (let i = 0; i < commands.length; i += CMDS_PER_PAGE) {
    const pageCommands = commands.slice(i, i + CMDS_PER_PAGE)
    pages.push(
      pageCommands.map((cmd) => {
        const subCommands = cmd.options?.filter((opt) => opt.type === 1) || []
        const subCommandsText = subCommands.length
          ? `❯ **SubCommands [${subCommands.length}]**: ${subCommands.map((s) => s.name).join(', ')}\n`
          : ''

        return `\`/${cmd.name}\`\n❯ **Description**: ${cmd.description}\n${subCommandsText}`
      })
    )
  }

  return pages.map((page, index) =>
    new EmbedBuilder()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setThumbnail(commandCategories[categoryKey]?.image)
      .setAuthor({ name: `${category} Commands • Page ${index + 1}/${pages.length}` })
      .setDescription(page.join('\n\n'))
      .setFooter({ text: 'Use ⬅️ ➡️ to navigate pages' })
  )
}
