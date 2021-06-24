import { BotInstance } from '../../BotInstance'
import { transformUserInGuildNonStandard } from '../../helper/transformer/user'
import RequestError from '../../models/Error/RequestError'
import { UserInGuildNonStandard } from '../../types/common'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { KHUserInGuild } from '../../types/kaiheila/common'
import { MessageType } from '../../types/MessageType'
import {
  KHMessageCreateResponse,
  MessageCreateResponseInternal,
} from './message.types'

export class MessageAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  // TODO: LIST

  /**
   * 发送频道聊天消息
   * 注意： 强列建议过滤掉机器人发送的消息，再进行回应。否则会很容易形成两个机器人循环自言自语导致发送量过大，进而导致机器人被封禁。如果确实需要机器人联动的情况，慎重进行处理，防止形成循环。
   * @param type 消息类型, 见[type], 不传默认为 `1`, 代表文本类型。`2` 图片消息，`3` 视频消息，`4` 文件消息，`9` 代表 kmarkdown 消息, `10` 代表卡片消息。
   * @param targetId 目标频道 id
   * @param content 消息内容
   * @param quote 回复某条消息的 `msgId`
   * @param tempTargetId 用户id,如果传了，代表该消息是临时消息，该消息不会存数据库，但是会在频道内只给该用户推送临时消息。用于在频道内针对用户的操作进行单独的回应通知等。
   */
  async create(
    type: MessageType,
    targetId: string,
    content: string,
    quote?: string,
    tempTargetId?: string
  ): Promise<MessageCreateResponseInternal> {
    const data = (
      await this.self.post('v3/message/create', {
        type,
        target_id: targetId,
        content,
        quote,
        temp_target_id: tempTargetId,
        nonce: Math.random(),
      })
    ).data as KHAPIResponse<KHMessageCreateResponse>
    if (data.code === 0) {
      return {
        msgId: data.data.msg_id,
        msgTimestamp: data.data.msg_timestamp,
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 更新频道聊天消息
   * @param msgId 消息 id
   * @param content 消息内容
   * @param quote 回复某条消息的 msgId。如果为空，则代表删除回复，不传则无影响。
   */
  async update(
    msgId: string,
    content: string,
    quote?: string,
    tempTargetId?: string
  ): Promise<boolean> {
    const data = (
      await this.self.post('v3/message/update', {
        msg_id: msgId,
        content: content,
        quote: quote,
        temp_target_id: tempTargetId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除频道聊天消息
   * @param msgId 消息 id
   */
  async delete(msgId: string): Promise<boolean> {
    const data = (
      await this.self.post('v3/message/delete', {
        msg_id: msgId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 获取频道消息某回应的用户列表
   * @param msgId 频道消息的id
   * @param emoji emoji的id, 可以为GuilEmoji或者Emoji
   */
  async reactionList(
    msgId: string,
    emoji: string
  ): Promise<UserInGuildNonStandard[]> {
    const data = (
      await this.self.get('v3/message/reaction-list', {
        msg_id: msgId,
        emoji,
      })
    ).data as KHAPIResponse<KHUserInGuild[]>
    if (data.code === 0) {
      return data.data.map((e) => transformUserInGuildNonStandard(e))
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 给某个消息添加回应
   * @param msgId 频道消息的id
   * @param emoji emoji的id, 可以为GuilEmoji或者Emoji
   */
  async addReaction(msgId: string, emoji: string): Promise<boolean> {
    const data = (
      await this.self.post('v3/message/add-reaction', {
        msg_id: msgId,
        emoji,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 给某个消息添加回应
   * @param msgId 频道消息的id
   * @param emoji emoji的id, 可以为GuilEmoji或者Emoji
   * @param userId 用户的id, 如果不填则为自己的id。删除别人的reaction需要有管理频道消息的权限
   */
  async deleteReaction(
    msgId: string,
    emoji: string,
    userId: string
  ): Promise<boolean> {
    const data = (
      await this.self.post('v3/message/delete-reaction', {
        msg_id: msgId,
        emoji,
        user_id: userId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
