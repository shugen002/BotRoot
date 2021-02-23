import { KaiheilaBot } from '..'
import RequestError from '../error/RequestError'
import { KHAPIResponse } from '../types/kaiheila/api'

interface KHGuildMuteListResponse {
  '1': string[]
  '2': string[]
}

export class GuildMuteAPI {
  private self: KaiheilaBot
  constructor(self: KaiheilaBot) {
    this.self = self
  }

  /**
   * 服务器静音闭麦列表
   * @param guildId 服务器id
   */
  async list(guildId: string) {
    const data = (
      await this.self.get('v3/guild-mute/list', {
        guild_id: guildId,
        // TODO: 写入types
      })
    ).data as KHAPIResponse<KHGuildMuteListResponse>
    if (data.code === 0) {
      return {
        heatset: data.data['1'],
        mic: data.data['2'],
        // TODO: 写入types
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 添加服务器静音或闭麦
   * @param guildId 服务器id
   * @param userId 用户id
   * @param type `1`代表麦克风闭麦，`2`代表耳机静音
   */
  async create(guildId: string, userId: string, type: string | 1 | 2) {
    const data = (
      await this.self.post('v3/guild-mute/create', {
        guild_id: guildId,
        user_id: userId,
        type: type,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除服务器静音或闭麦
   * @param guildId 服务器id
   * @param userId 用户id
   * @param type `1`代表麦克风闭麦，`2`代表耳机静音
   */
  async delete(guildId: string, userId: string, type: string | 1 | 2) {
    const data = (
      await this.self.post('v3/guild-mute/delete', {
        guild_id: guildId,
        user_id: userId,
        type: type,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
