import { BotInstance } from '../../BotInstance'
import { transformChannel } from '../../helper/transformer/channel'
import RequestError from '../../models/Error/RequestError'
import { Channel } from '../../types'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { KHChannel } from '../../types/kaiheila/common'
import {
  ChannelListResponseInternal,
  KHChannelListResponse,
} from './channel.types'

export class ChannelAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  /**
   * 获取频道列表
   * @param guildId 服务器id
   */
  async list(guildId: string): Promise<ChannelListResponseInternal> {
    const data = (
      await this.self.get('v3/channel/list', {
        guild_id: guildId,
      })
    ).data as KHAPIResponse<KHChannelListResponse>
    if (data.code === 0) {
      return {
        items: data.data.items.map(transformChannel),
        meta: {
          page: data.data.meta.page,
          pageSize: data.data.meta.page_size,
          pageTotal: data.data.meta.page_total,
          total: data.data.meta.total,
        },
        sort: data.data.sort,
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async view(channelId: string): Promise<Channel> {
    const data = (
      await this.self.get('v3/channel/view', {
        target_id: channelId,
      })
    ).data as KHAPIResponse<KHChannel>
    if (data.code === 0) {
      return transformChannel(data.data)
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
  ): Promise<Channel> {
    const data = (
      await this.self.post('v3/channel/create', {
        guild_id: guildId,
        name,
        type,
        parent_id: parentId,
        limit_amount: limitAmount,
        voice_quality: voiceQuality,
      })
    ).data as KHAPIResponse<KHChannel>
    if (data.code === 0) {
      return transformChannel(data.data)
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async delete(channelId: string): Promise<boolean> {
    const data = (
      await this.self.post('v3/channel/delete', {
        channel_id: channelId,
      })
    ).data as KHAPIResponse<null>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async moveUser(channelId: string, userIds: string[]): Promise<boolean> {
    const data = (
      await this.self.post('v3/channel/move-user', {
        target_id: channelId,
        user_ids: userIds,
      })
    ).data as KHAPIResponse<null>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
