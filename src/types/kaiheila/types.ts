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

}
