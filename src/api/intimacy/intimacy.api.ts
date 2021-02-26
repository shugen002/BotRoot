import { BotInstance } from '../../BotInstance'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import {
  IntimacyIndexResponseInternal,
  KHIntimacyIndexResponse,
} from './intimacy.types'

export class IntimacyAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }
  /**
   * 获取用户亲密度
   * @param userId 用户id
   */
  async index(userId: string): Promise<IntimacyIndexResponseInternal> {
    const data = (
      await this.self.get('v3/intimacy/index', {
        user_id: userId,
      })
    ).data as KHAPIResponse<KHIntimacyIndexResponse>
    if (data.code === 0) {
      return {
        imgUrl: data.data.img_url,
        socialInfo: data.data.social_info,
        lastRead: data.data.last_read,
        imgList: data.data.img_list.map((e) => {
          return {
            id: e.id,
            url: e.url,
          }
        }),
      } as IntimacyIndexResponseInternal
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   *
   * @param userId 用户id
   * @param score 亲密度，0-2200
   * @param socialInfo 机器人与用户的社交信息，500 字以内
   * @param imgId 	id必须在用户亲密度接口返回的 img_list 中
   */
  async update(
    userId: string,
    score?: number,
    socialInfo?: string,
    imgId?: number
  ): Promise<boolean> {
    const data = (
      await this.self.post('v3/intimacy/update', {
        user_id: userId,
        score,
        social_info: socialInfo,
        img_id: imgId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
