import { Guild, UserInGuildNonStandard } from '../../types/common'
import { KHAPIMultiPage } from '../../types/kaiheila/api'
import { KHGuild, KHUserInGuild } from '../../types/kaiheila/common'

export interface KHGuildListResponse extends KHAPIMultiPage<KHGuild> {
  sort: {
    id: number
  }
}

export interface KHGuildUserListResponse extends KHAPIMultiPage<KHUserInGuild> {
  user_count: number
  online_count: number
  offline_count: number
}

export interface GuildListResponseInternal {
  items: Guild[]
  meta: {
    page: number
    pageSize: number
    pageTotal: number
    total: number
  }
}

export interface GuildUserListInternal {
  items: UserInGuildNonStandard[]
}
