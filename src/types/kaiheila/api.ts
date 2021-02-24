/* eslint-disable camelcase */

import { KHUser } from './types'

export interface KHAPIResponse<KHRequestType> {
  code: number
  message: string
  data: KHRequestType
}

export interface KHAPIMultiPage<KHItemType> {
  items: KHItemType[]
  meta: {
    page: number
    page_total: number
    page_size: number
    total: number
  }
  [key: string]: unknown
}

export interface KHGrantUserRoleResponse {
  /**
   * 用户ID
   */
  user_id: string
  /**
   * 服务器ID
   */
  guild_id: string
  /**
   * 用户当前拥有的角色（操作后）
   */
  roles: number[]
}

export interface KHRevokeUserRoleResponse {
  /**
   * 用户ID
   */
  user_id: string
  /**
   * 服务器ID
   */
  guild_id: string
  /**
   * 角色id的列表
   */
  roles: number[]
}
