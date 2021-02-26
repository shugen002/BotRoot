import { BotInstance } from '../../BotInstance'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { KHUserChatSession, UserChatSessionInternal } from './userChat.types'

export class UserChatAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }
  /**
   * 获取私信聊天会话列表
   */
  async index(): Promise<UserChatSessionInternal[]> {
    const data = (await this.self.get('v3/user-chat/index', {}))
      .data as KHAPIResponse<KHUserChatSession[]>
    if (data.code === 0) {
      return data.data.map((e) => {
        return {
          code: e.code,
          lastReadTime: e.last_read_time,
          latestMsgTime: e.last_read_time,
          unreadCount: e.unread_count,
          targetInfo: {
            id: e.target_info.id,
            username: e.target_info.username,
            online: e.target_info.online,
            avatar: e.target_info.avatar,
          },
        }
      })
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 获取私信聊天会话详情
   * @param chatCode 私聊会话 Code
   */
  async view(chatCode: string): Promise<UserChatSessionInternal> {
    const data = (
      await this.self.get('v3/user-chat/view', {
        chat_code: chatCode,
      })
    ).data as KHAPIResponse<KHUserChatSession>
    if (data.code === 0) {
      return {
        code: data.data.code,
        lastReadTime: data.data.last_read_time,
        latestMsgTime: data.data.last_read_time,
        unreadCount: data.data.unread_count,
        isFriend: data.data.is_friend || false,
        isBlocked: data.data.is_blocked || false,
        isTargetBlocked: data.data.is_target_blocked || false,
        targetInfo: {
          id: data.data.target_info.id,
          username: data.data.target_info.username,
          online: data.data.target_info.online,
          avatar: data.data.target_info.avatar,
        },
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
  /**
   * 创建私信聊天会话
   * @param targetId 目标用户 id
   */
  async create(targetId: string): Promise<UserChatSessionInternal> {
    const data = (
      await this.self.post('v3/user-chat/create', {
        target_id: targetId,
      })
    ).data as KHAPIResponse<KHUserChatSession>
    if (data.code === 0) {
      return {
        code: data.data.code,
        lastReadTime: data.data.last_read_time,
        latestMsgTime: data.data.last_read_time,
        unreadCount: data.data.unread_count,
        isFriend: data.data.is_friend || false,
        isBlocked: data.data.is_blocked || false,
        isTargetBlocked: data.data.is_target_blocked || false,
        targetInfo: {
          id: data.data.target_info.id,
          username: data.data.target_info.username,
          online: data.data.target_info.online,
          avatar: data.data.target_info.avatar,
        },
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 创建私信聊天会话
   * @param targetId 目标用户 id
   */
  async delete(targetId: string): Promise<boolean> {
    const data = (
      await this.self.post('v3/user-chat/delete', {
        target_id: targetId,
      })
    ).data as KHAPIResponse<KHUserChatSession>
    if (data.code === 0) {
      return false
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
