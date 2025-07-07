import mongoose from 'mongoose'

export interface CommandGuildItem {
  name: string
  status: boolean
}

export interface CommandGuildDocument extends mongoose.Document {
  guildId: string
  commands: Array<CommandGuildItem>
}

const commandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  }
})

const commandPerGuild = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  commands: [commandSchema]
})

export default mongoose.model<CommandGuildDocument>('commandPerGuild', commandPerGuild)
