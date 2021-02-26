import { BotInstance } from '../../BotInstance'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { MessageType } from '../../types/message'
import {
  KHMessageCreateResponse,
  MessageCreateResponseInternal,
} from './message.types'

export class MessageAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }
  async create(
    type: MessageType,
    targetId: string,
    content: string,
    quote: string,
    tempTargetId?: string
  ): Promise<MessageCreateResponseInternal> {
    const data = (
      await this.self.post('/api/v3/message/create', {
        type,
        target_id: targetId,
        content,
        quote,
        temp_target_id: tempTargetId,
      })
    ).data as KHAPIResponse<KHMessageCreateResponse>
    if (data.code === 0) {
      return {
        msgId: data.data.msg_id,
        msgTimestamp: data.data.msg_timestamp,
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
