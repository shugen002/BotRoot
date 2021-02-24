export interface GetGatewayResponse {
  url: string
}

export interface UserRoleResponse {
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
