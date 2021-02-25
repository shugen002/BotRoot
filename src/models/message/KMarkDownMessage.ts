import { KHKMarkDownMessage } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/message'
import { User } from '../User'
import { MessageBase } from './MessageBase'

export class KMarkDownMessage extends MessageBase {
  type = MessageType.kmarkdown
  author: User
  mention: {
    user: string[]
    roles: string[]
    all: boolean
    here: boolean
    channels: string[]
  }
  channelName: string
  content: string
  code: string

  constructor(message: KHKMarkDownMessage) {
    super(message)
    this.content = message.content
    this.channelName = message.extra.channel_name
    this.code = message.extra.code
    this.author = new User(message.extra.author)
    this.mention = {
      user: message.extra.mention,
      roles: message.extra.mention_roles,
      all: message.extra.mention_all,
      here: message.extra.mention_here,
      channels: message.extra.nav_channels,
    }
  }
}
