import { KHTextMessage } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/MessageType'
import { User } from '../User'
import { MessageBase } from './MessageBase'

export class TextMessage extends MessageBase {
  type = MessageType.text
  author: User
  quote?: TextMessage
  channelName?: string
  code = ''
  content: string
  mention: {
    user: string[]
    roles: string[]
    all: boolean
    here: boolean
  }

  constructor(message: KHTextMessage, reply = false) {
    super(message, reply)
    this.content = message.content
    if (reply) {
      this.channelName = ''
      this.author = new User(message.author)
      this.code = message.code
      this.mention = {
        user: message.mention,
        roles: message.mention_roles,
        all: message.mention_all,
        here: message.mention_here,
      }
    } else {
      this.channelName = message.extra.channel_name
      this.code = message.extra.code
      this.author = new User(message.extra.author)
      this.mention = {
        user: message.extra.mention,
        roles: message.extra.mention_roles,
        all: message.extra.mention_all,
        here: message.extra.mention_here,
      }
    }

    if (!reply && message.extra.quote) {
      this.quote = new TextMessage(message.extra.quote, true)
      // patch for non exist properties in reply
      this.quote.channelName = this.channelName
      this.quote.channelType = this.channelType
      this.quote.channelId = this.channelId
    }
  }
}
