/* eslint-disable camelcase */
export interface KHAPIResponse<KHRequestType>{
  code: number,
  message: string
  data:KHRequestType
}

export interface KHGetGatewayResponse{
  url: string
}

export interface KHGetCurrentUserInfoResponse{
  /**
   * 用户的id
   */
  id:string,

  /**
   * 用户的名称
   */
  username:string,

  /**
   * 用户名的认证数字，用户名正常为：user_name#identify_num
   */
  identify_num:string,

  /**
   * 当前是否在线
   */
  online:boolean,

  /**
   * 用户的状态, 0代表正常，10代表被封禁
   */
  status:number,

  /**
   * 用户的头像的url地址
   */
  avatar:string,

  /**
   * 用户是否为机器人
   */
  bot:boolean,

  /**
   * 是否手机号已验证
   */
  mobile_verified:boolean,

  /**
   * 是否为官方账号
   */
  system:boolean,

  /**
   * 手机区号,如中国为86
   */
  mobile_prefix:string,

  /**
   * 用户手机号，带掩码
   */
  mobile:string,

  /**
   * 当前邀请注册的人数
   */
  invited_count:number

}

export interface KHGrantUserRoleResponse{
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

export interface KHRevokeUserRoleResponse{
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
export interface KHRole {
  /**
   * 角色的id
   */
  role_id:number
  /**
   * 角色的名称
   */
  name:string
  /**
   * 角色的色值0x000000 - 0xFFFFFF
   */
  color:number
  /**
   * 顺序，值越小载靠前
   */
  position:number
  /**
   * 只能为0或者1，是否把该角色的用户在用户列表排到前面
   */
  hoist:number
  /**
   * 只能为0或者1，该角色是否可以被提及
   */
  mentionable:number
  /**
   * 权限,参见[权限说明](#权限说明)
   */
  permissions:number
}
