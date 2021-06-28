import { BotInstance } from '../../BotInstance'
import { transformUserInGuildNonStandard } from '../../helper/transformer/user'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import {
  InviteCreateResponseInternal,
  InviteListResponseInternal,
  KHInviteCreateResponse,
  KHInviteListResponse,
} from './invite.types'

export class InviteAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  private argChecker(guildId?: string, channelId?: string) {
    if (!guildId && !channelId)
      throw new Error(
        'no guild id or channel id provided, should at least provide one.'
      )
  }

  /**
   * 获取邀请列表
   * @param guildId 服务器id
   */
  async list(
    guildId?: string,
    channelId?: string
  ): Promise<KHInviteListResponse> {
    this.argChecker(guildId, channelId)
    const data = (
      await this.self.get('v3/invite/list', {
        guild_id: guildId,
        channel_id: channelId,
      })
    ).data as KHAPIResponse<InviteListResponseInternal>
    if (data.code === 0) {
      return {
        items: data.data.items.map((e) => {
          return {
            channelId: e.channel_id,
            guildId: e.guild_id,
            url: e.url,
            urlCode: e.url_code,
            user: transformUserInGuildNonStandard(e.user),
          }
        }),
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

  async create(
    guildId?: string,
    channelId?: string
  ): Promise<KHInviteCreateResponse> {
    this.argChecker(guildId, channelId)
    const data = (
      await this.self.get('v3/invite/create', {
        guild_id: guildId,
        channel_id: channelId,
      })
    ).data as KHAPIResponse<InviteCreateResponseInternal>
    if (data.code === 0) {
      return data.data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async delete(
    urlCode: string,
    guildId?: string,
    channelId?: string
  ): Promise<boolean> {
    this.argChecker(guildId, channelId)
    const data = (
      await this.self.post('v3/invite/delete', {
        url_code: urlCode,
        guild_id: guildId,
        channel_id: channelId,
      })
    ).data as KHAPIResponse<null>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
