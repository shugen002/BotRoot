import { KHEventBase } from '../../../types/kaiheila/kaiheila.type'
import { MessageBase } from '../../../types/message/MessageBase'

export function transformMessageBase(
  message: KHEventBase,
  reply = false,
  base: MessageBase = {
    type: 1,
    msgId: '',
    msgTimestamp: 0,
    channelId: '',
    guildId: '',
    channelType: '',
    authorId: '',
  }
): MessageBase {
  base.type = message.type
  base.channelType = message.channel_type
  base.channelId = message.target_id
  if (reply) {
    base.authorId = message.author.id
    base.guildId = message.guild_id
    base.msgId = message.id
    base.msgTimestamp = message.create_at
  } else {
    base.authorId = message.author_id
    base.msgId = message.msg_id
    base.guildId = message.extra.guild_id
    base.msgTimestamp = message.msg_timestamp
  }
  return base
}
