/**
 * 角色
 */
export interface Role {
  /**
   * 角色的id
   */
  roleId: number;
  /**
   * 角色的名称
   */
  name: string;
  /**
   * 角色的色值0x000000 - 0xFFFFFF
   */
  color: number;
  /**
   * 顺序，值越小载靠前
   */
  position: number;
  /**
   * 只能为0或者1，是否把该角色的用户在用户列表排到前面
   */
  hoist: number;
  /**
   * 只能为0或者1，该角色是否可以被提及
   */
  mentionable: number;
  /**
   * 权限,参见[权限说明](#权限说明)
   */
  permissions: number;
}

/**
 * 频道
 */
export interface Channel {
  /**
   * 频道id
   */
  id: string;
  /**
   * 频道名称
   */
  name: string;
  /**
   * 创建者id
   */
  userId: string;
  /**
   * 服务器id
   */
  guildId: string;
  /**
   * 频道简介
   */
  topic: string;
  /**
   * 是否为分组
   */
  isCategory: number;
  /**
   * 上级分组的id
   */
  parentId: string;
  /**
   * 排序level
   */
  level: number;
  /**
   * 慢速模式下限制发言的最短时间间隔, 单位为秒(s)
   */
  slowMode: number;
  /**
   * 频道类型: 1 文字频道, 2 语音频道
   */
  type: string;
  /**
   * 针对角色在该频道的权限覆写规则组成的列表
   */
  permissionOverwrites: string;
  /**
   * 针对用户在该频道的权限覆写规则组成的列表
   * TODO
   */
  permissionUsers: any[];
  /**
   * 权限设置是否与分组同步, 1 or 0
   */
  permissionSync: number;
}

/**
 * 服务器
 */
export interface Guild {
  /**
   * 服务器id
   */
  id: string;
  /**
   * 服务器名称
   */
  name: string;
  /**
   * 服务器主题
   */
  topic: string;
  /**
   * 服务器主的id
   */
  masterId: string;
  /**
   * 当前用户是否为服务器主
   */
  isMaster: boolean;
  /**
   * 服务器icon的地址
   */
  icon: string;
  /**
   * 是否开启邀请
   */
  inviteEnabled: number;
  /**
   * 通知类型, 0代表默认使用服务器通知设置，1代表接收所有通知, 2代表仅@被提及，3代表不接收通知
   */
  notifyType: number;
  /**
   * 服务器默认使用语音区域
   */
  region: string;
  /**
   * 是否为公开服务器
   */
  enableOpen: number;
  /**
   * 公开服务器id
   */
  openId: string;
  /**
   * 默认频道
   */
  defaultChannelId: string;
  /**
   * 欢迎频道
   */
  welcomeChannelId: string;
}
