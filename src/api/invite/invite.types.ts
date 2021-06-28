import { UserInGuildNonStandard } from '../../types/common'
import { KHAPIMultiPage } from '../../types/kaiheila/api'
import { KHUserInGuild } from '../../types/kaiheila/common'

export interface KHInviteCreateResponse {
  url: string
}

export interface InviteCreateResponseInternal {
  url: string
}

export interface InviteListResponseInternal
  extends KHAPIMultiPage<{
    channel_id: string
    guild_id: string
    url: string
    url_code: string
    user: KHUserInGuild
  }> {
  sort: Record<string, never>
}

export interface KHInviteListResponse {
  items: {
    channelId: string
    guildId: string
    url: string
    urlCode: string
    user: UserInGuildNonStandard
  }[]
  meta: {
    page: number
    pageTotal: number
    pageSize: number
    total: number
  }
  sort: Record<string, never>
}
