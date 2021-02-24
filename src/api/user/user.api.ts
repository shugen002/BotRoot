import { KaiheilaBot } from '../..'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { CurrentUserInfoInternal, KHGetCurrentUserInfoResponse } from './user.types'

export class UserAPI {
  private self: KaiheilaBot
  constructor(self: KaiheilaBot) {
    this.self = self
  }
  async getCurrentUserInfo() {
    const data = (await this.self.get('v3/user/me', {}))
      .data as KHAPIResponse<KHGetCurrentUserInfoResponse>
    if (data.code === 0) {
      return {
        id: data.data.id,
        username: data.data.username,
        identifyNum: data.data.identify_num,
        online: data.data.online,
        status: data.data.status,
        avatar: data.data.avatar,
        bot: data.data.bot,
        mobileVerified: data.data.mobile_verified,
        system: data.data.system,
        mobilePrefix: data.data.mobile_prefix,
        invitedCount: data.data.invited_count,
        mobile: data.data.mobile,
      } as CurrentUserInfoInternal
    } else {
      throw new RequestError(data.code, data.message)
    }
}
