import { BotInstance } from '../../BotInstance'
import { transformUserInGuildNonStandard } from '../../helper/transformer/user'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'

export class ChannelAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  /**
   * 获取频道列表
   * @param guildId 服务器id
   */
  async list(guildId: string) {
    const data = (
      await this.self.get('v3/channel/list', {
        guild_id: guildId,
      })
    ).data as KHAPIResponse<any>
    if (data.code === 0) {
      return data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async view(channelId: string) {
    const data = (
      await this.self.get('v3/channel/view', {
        target_id: channelId,
      })
    ).data as KHAPIResponse<any>
    if (data.code === 0) {
      return data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async create(
    guildId: string,
    name: string,
    type?: string,
    parentId?: string,
    limitAmount?: number,
    voiceQuality?: number
  ) {
    const data = (
      await this.self.post('v3/channel/create', {
        guild_id: guildId,
        name,
        type,
        parent_id: parentId,
        limit_amount: limitAmount,
        voice_quality: voiceQuality,
      })
    ).data as KHAPIResponse<any>
    if (data.code === 0) {
      return data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async delete(channelId: string) {
    const data = (
      await this.self.post('v3/channel/delete', {
        channel_id: channelId,
      })
    ).data as KHAPIResponse<boolean>
    if (data.code === 0) {
      return data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async moveUser(channelId: string, userIds: string[]) {
    const data = (
      await this.self.post('v3/channel/move-user', {
        target_id: channelId,
        user_ids: userIds,
      })
    ).data as KHAPIResponse<boolean>
    if (data.code === 0) {
      return data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
