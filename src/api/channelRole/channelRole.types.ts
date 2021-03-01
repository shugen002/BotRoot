import { UserInGuildNonStandard } from '../../types/common'
import { KHUserInGuild } from '../../types/kaiheila/common'

export interface KHChannelRoleListResponse {
  permission_overwrites: {
    role_id: number
    allow: number
    deny: number
  }[]
  permission_users: {
    user: KHUserInGuild
    allow: number
    deny: number
  }[]
  permission_sync: number
}

export interface KHChannelRoleUpdateResponse {
  role: number
  allow: number
  deny: number
}

export interface ChannelRoleListResponseInternal {
  permissionOverwrites: {
    roleId: number
    allow: number
    deny: number
  }[]
  permissionUsers: {
    user: UserInGuildNonStandard
    allow: number
    deny: number
  }[]
  permissionSync: boolean
}

export interface ChannelRoleUpdateResponseInternal {
  role: number
  allow: number
  deny: number
}
