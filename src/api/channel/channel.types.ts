import { UserInGuildNonStandard } from '../../types/common'
import { KHUserInGuild } from '../../types/kaiheila/common'

export interface KHChannelViewResponse {
  id: string
  guild_id: string
  master_id: string
  parent_id: string
  name: string
  topic: string
  type: number
  level: number
  slow_mode: number
  limit_amount: number
  voice_quality: number
  is_category: boolean
  server_type: number
  server_url: string
}
