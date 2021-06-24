import { BotInstance } from '../../BotInstance'
import { transformUserInGuildNonStandard } from '../../helper/transformer/user'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { InviteCreateResponseInternal } from './invite.types'

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
   * 获取频道列表
   * @param guildId 服务器id
   */
  async list(guildId?: string, channelId?: string) {
    this.argChecker(guildId, channelId)
    const data = (
      await this.self.get('v3/invite/list', {
        guild_id: guildId,
        channel_id: channelId,
      })
    ).data as KHAPIResponse<any>
    if (data.code === 0) {
      return data.data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async create(guildId?: string, channelId?: string) {
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

  async delete(urlCode: string, guildId?: string, channelId?: string) {
    this.argChecker(guildId, channelId)
    const data = (
      await this.self.post('v3/invite/delete', {
        url_code: urlCode,
        guild_id: guildId,
        channel_id: channelId,
      })
    ).data as KHAPIResponse<boolean>
    if (data.code === 0) {
      return data.data
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
