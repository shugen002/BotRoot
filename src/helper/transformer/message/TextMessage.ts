import { KHTextMessage } from '../../../types/kaiheila/kaiheila.type'
import { TextMessage } from '../../../types/message/TextMessage'
import { transformUser } from '../User'
import { transformMessageBase } from './base'

export function transformTextMessage(
  message: KHTextMessage,
  reply = false
): TextMessage {
  const base = (transformMessageBase(message, reply) as unknown) as TextMessage
  base.content = message.content
  if (reply) {
    base.channelName = ''
    base.author = transformUser(message.author)
    base.code = message.code
    base.mention = {
      user: message.mention,
      roles: message.mention_roles,
      all: message.mention_all,
      here: message.mention_here,
    }
  } else {
    base.channelName = message.extra.channel_name
    base.code = message.extra.code
    base.author = transformUser(message.extra.author)
    base.mention = {
      user: message.extra.mention,
      roles: message.extra.mention_roles,
      all: message.extra.mention_all,
      here: message.extra.mention_here,
    }
  }

  if (!reply && message.extra.quote) {
    base.quote = transformTextMessage(message.extra.quote, true)
    // patch for non exist properties in reply
    base.quote.channelName = base.channelName
    base.quote.channelType = base.channelType
    base.quote.channelId = base.channelId
  }
  return base
}
