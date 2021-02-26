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

export interface UserRoleGrantResponseInternal {
  /**
   * 用户ID
   */
  userId: string
  /**
   * 服务器ID
   */
  guildId: string
  /**
   * 用户当前拥有的角色（操作后）
   */
  roles: number[]
}

export interface UserRoleRevokeResponseInternal {
  /**
   * 用户ID
   */
  userId: string
  /**
   * 服务器ID
   */
  guildId: string
  /**
   * 用户当前拥有的角色（操作后）
   */
  roles: number[]
}
