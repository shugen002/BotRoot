import { KHEventBase } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/message'

export class MessageBase {
  /**
   * 消息类型
   */
  type: MessageType
  msgId: string
  msgTimestamp: number
  channelId: string
  guildId = ''
  channelType: string
  authorId: string

  constructor(message: KHEventBase, reply = false) {
    this.type = message.type
    this.channelType = message.channel_type
    this.channelId = message.target_id
    if (reply) {
      this.authorId = message.author.id
      this.guildId = message.guild_id
      this.msgId = message.id
      this.msgTimestamp = message.create_at
    } else {
      this.authorId = message.author_id
      this.msgId = message.msg_id
      this.guildId = message.extra.guild_id
      this.msgTimestamp = message.msg_timestamp
    }
  }
}
