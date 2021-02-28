/* eslint-disable camelcase */
export interface KHRole {
  /**
   * 角色的id
   */
  role_id: number
  /**
   * 角色的名称
   */
  name: string
  /**
   * 角色的色值0x000000 - 0xFFFFFF
   */
  color: number
  /**
   * 顺序，值越小载靠前
   */
  position: number
  /**
   * 只能为0或者1，是否把该角色的用户在用户列表排到前面
   */
  hoist: number
  /**
   * 只能为0或者1，该角色是否可以被提及
   */
  mentionable: number
  /**
   * 权限,参见[权限说明](#权限说明)
   */
  permissions: number
}

export interface KHUser {
  id: string
  username: string
  avatar: string
  online: boolean
  nickname: string
  joined_at?: number
  active_time?: number
  roles?: number[]
  is_master?: boolean
  identify_num: string
  mobile_verified?: boolean
  color?: number
  bot?: boolean
  hoist_info?: {
    color: number
    name: string
    role_id: number
  }
  game?: {
    icon: string
    id: number
    name: string
    start_time: number
    type: number
  }
  tag_info?: {
    color: string
    text: string
  }
  os?: string
}
