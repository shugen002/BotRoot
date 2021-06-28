import { Channel } from '../../types'
import { KHAPIMultiPage } from '../../types/kaiheila/api'
import { KHChannel } from '../../types/kaiheila/common'

export interface ChannelListResponseInternal {
  items: Channel[]
  meta: {
    page: number
    pageTotal: number
    pageSize: number
    total: number
  }
  sort: Record<string, never>
}

export interface KHChannelListResponse extends KHAPIMultiPage<KHChannel> {
  meta: {
    page: number
    page_total: number
    page_size: number
    total: number
  }
  sort: Record<string, never>
}
