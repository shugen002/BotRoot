import { User } from '../../types/common'
import { KHUser } from '../../types/kaiheila/types'

export interface KHChannelRoleListResponse {
  permission_overwrites: {
    role_id: number
    allow: number
    deny: number
  }[]
  permission_users: {
    user: KHUser
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
    user: User
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
