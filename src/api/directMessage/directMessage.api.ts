import { BotInstance } from '../../BotInstance'
import { transformUser } from '../../helper/transformer/User'
import RequestError from '../../models/Error/RequestError'
import { User } from '../../types/common'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { KHUser } from '../../types/kaiheila/types'
import { MessageType } from '../../types/MessageType'
import {
  KHDirCstMessageCreateResponse,
  DirectMessageCreateResponseInternal,
} from './directMessage.types'

export class DirectMessageAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  // TODO: LIST

  /**
   * 发送私信聊天消息
   * @param type 消息类型, 见[type], 不传默认为 `1`, 代表文本类型。`2` 图片消息，`3` 视频消息，`4` 文件消息，`9` 代表 kmarkdown 消息, `10` 代表卡片消息。
   * @param targetId 目标用户 id，后端会自动创建会话。有此参数之后可不传 `chat_code` 参数
   * @param chatCode 目标会话 id
   * @param content 消息内容
   * @param quote 回复某条消息的 `msgId`
   */
  async create(
    type: MessageType,
    targetId: string,
    chatCode: string,
    content: string,
    quote?: string
  ): Promise<DirectMessageCreateResponseInternal> {
    const data = (
      await this.self.post('v3/direct-message/create', {
        type,
        target_id: targetId,
        content,
        quote,
        chat_code: chatCode,
        nonce: Math.random(),
      })
    ).data as KHAPIResponse<KHDirCstMessageCreateResponse>
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
   * 更新私信聊天消息
   * @param msgId 消息 id
   * @param content 消息内容
   * @param quote 回复某条消息的 msgId。如果为空，则代表删除回复，不传则无影响。
   */
  async update(
    msgId: string,
    content: string,
    quote?: string
  ): Promise<boolean> {
    const data = (
      await this.self.post('v3/direct-message/update', {
        msg_id: msgId,
        content,
        quote,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除私信聊天消息
   *
   * 只能删除自己的消息。
   * @param msgId 消息 id
   */
  async delete(msgId: string): Promise<boolean> {
    const data = (
      await this.self.post('v3/direct-message/delete', {
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
  async reactionList(msgId: string, emoji: string): Promise<User[]> {
    const data = (
      await this.self.get('v3/direct-message/reaction-list', {
        msg_id: msgId,
        emoji,
      })
    ).data as KHAPIResponse<KHUser[]>
    if (data.code === 0) {
      return data.data.map((e) => transformUser(e))
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
      await this.self.post('v3/direct-message/add-reaction', {
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
      await this.self.post('v3/direct-message/delete-reaction', {
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
