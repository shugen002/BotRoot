import { BotInstance } from '../../BotInstance'
import RequestError from '../../models/error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { GatewayResponseInternal, KHGatewayResponse } from './gateway.types'

export class GatewayAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }
  async index(compress = 0): Promise<GatewayResponseInternal> {
    const data = (
      await this.self.get('v3/gateway/index', {
        compress,
      })
    ).data as KHAPIResponse<KHGatewayResponse>
    if (data.code === 0) {
      return data.data as GatewayResponseInternal
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
