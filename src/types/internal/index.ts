/**
 * 用户
 *
 * 使用非标准属性时请做好没有的处理
 */
export interface UserInternal {
  /**
   * 用户id
   */
  id: string
  /**
   * 用户名
   */
  username: string
  /**
   * 用户名 # 后的 4 位识别 id
   */
  identifyNum: string
  /**
   * 是否在线
   */
  online: boolean
  /**
   * 头像图片地址
   */
  avatar: string
  /**
   * 是否为机器人
   */
  bot: boolean
  /**
   * 用户在服务器的昵称
   */
  nickname: string
  /**
   * 用户在当前服务器中的角色 id 组成的列表
   */
  roles: number[]
  /**
   * 是否服务器主人
   */
  isMaster?: boolean
  /**
   * 加入时间 (非标准)
   */
  joinedAt?: number
  /**
   * 最后活动时间（非标准）
   */
  activeTime?: number
  /**
   * 手机验证（非标准）
   */
  mobileVerified?: boolean
  /**
   * 名称颜色（非标准）
   */
  color?: number
  /**
   * 角色设定
   */
  hoistInfo?: {
    color: number
    name: string
    roleId: number
  }
  /**
   * 正在玩的游戏
   */
  game?: {
    icon: string
    id: number
    name: string
    startTime: number
    type: number
  }
  /**
   * 正在听的歌
   */
  music?: {
    musicName: string
    singer: string
    software: string
    startTime: number
  }
  [key: string]: unknown
}

/**
 * 服务器
 */
export interface GuildInternal {
  /**
   * 服务器id
   */
  id: string
  /**
   * 服务器名称
   */
  name: string
  /**
   * 服务器主题
   */
  topic: string
  /**
   * 服务器主的id
   */
  masterId: string
  /**
   * 当前用户是否为服务器主
   */
  isMaster: boolean
  /**
   * 服务器icon的地址
   */
  icon: string
  /**
   * 是否开启邀请
   */
  inviteEnabled: number
  /**
   * 通知类型, 0代表默认使用服务器通知设置，1代表接收所有通知, 2代表仅@被提及，3代表不接收通知
   */
  notifyType: number
  /**
   * 服务器默认使用语音区域
   */
  region: string
  /**
   * 是否为公开服务器
   */
  enableOpen: number
  /**
   * 公开服务器id
   */
  openId: string
  /**
   * 默认频道
   */
  defaultChannelId: string
  /**
   * 欢迎频道
   */
  welcomeChannelId: string
}
/**
 * 角色
 */
export interface RoleInternal {
  /**
   * 角色的id
   */
  roleId: number
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

/**
 * 频道
 */
export interface ChannelInternal {
  /**
   * 频道id
   */
  id: string
  /**
   * 频道名称
   */
  name: string
  /**
   * 创建者id
   */
  userId: string
  /**
   * 服务器id
   */
  guildId: string
  /**
   * 频道简介
   */
  topic: string
  /**
   * 是否为分组
   */
  isCategory: number
  /**
   * 上级分组的id
   */
  parentId: string
  /**
   * 排序level
   */
  level: number
  /**
   * 慢速模式下限制发言的最短时间间隔, 单位为秒(s)
   */
  slowMode: number
  /**
   * 频道类型: 1 文字频道, 2 语音频道
   */
  type: string
  /**
   * 针对角色在该频道的权限覆写规则组成的列表
   */
  permissionOverwrites: string
  /**
   * 针对用户在该频道的权限覆写规则组成的列表
   * TODO
   */
  permissionUsers: UserInternal[]
  /**
   * 权限设置是否与分组同步, 1 or 0
   */
  permissionSync: number
}
