export interface GetGatewayResponse {
  url: string
}

export interface CurrentUserInfo {
  /**
   * 用户的id
   */
  id: string,
  /**
   * 用户的名称
   */
  username: string,
  /**
   * 用户名的认证数字，用户名正常为：user_name#identify_num
   */
  identifyNum: string,
  /**
   * 当前是否在线
   */
  online: boolean,
  /**
   * 用户的状态, 0代表正常，10代表被封禁
   */
  status: number,
  /**
   * 用户的头像的url地址
   */
  avatar: string,
  /**
   * 用户是否为机器人
   */
  bot: boolean,
  /**
   * 是否手机号已验证
   */
  mobileVerified: boolean,
  /**
   * 是否为官方账号
   */
  system: boolean,
  /**
   * 手机区号,如中国为86
   */
  mobilePrefix: string,
  /**
   * 用户手机号，带掩码
   */
  mobile: string,
  /**
   * 当前邀请注册的人数
   */
  invitedCount: number
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

