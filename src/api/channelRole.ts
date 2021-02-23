import { KaiheilaBot } from '..'
import RequestError from '../error/RequestError'
import { KHAPIResponse } from '../types/kaiheila/api'

export class ChannelRoleAPI {
  private self: KaiheilaBot
  constructor(self: KaiheilaBot) {
    this.self = self
  }

  /**
   * 频道角色权限详情
   * @param channelId 频道id
   */
  async index(channelId: string) {
    const data = (
      await this.self.get('v3/channel-role/index', {
        channel_id: channelId,
      })
    ).data as KHAPIResponse<{}>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除频道角色权限
   * @param channelId 频道id, 如果频道是分组的id,会同步给所有sync=1的子频道
   * @param type value的类型，只能为"role_id","user_id",不传则默认为"role_id"
   * @param value value的值，默认为0
   */
  async delete(channelId: string, type: string, value: string = '0') {
    const data = (
      await this.self.post('v3/channel-role/delete', {
        channel_id: channelId,
        type,
        value,
      })
    ).data as KHAPIResponse<{}>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
