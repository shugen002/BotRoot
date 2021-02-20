import { KaiheilaBot } from '..'
import RequestError from '../error/RequestError'
import { KHAPIResponse, KHGuildUserListResponse } from '../types/kaiheila/api'
import { KHGuild } from '../types/kaiheila/kaiheila.type'
import { Guild } from '../types/types'
import { User } from '../types'

export class GuildAPI {
  self: KaiheilaBot

  constructor (self: KaiheilaBot) {
    this.self = self
  }

  async getGuildList () {
    const data = (await this.self.get('v3/guild/list', {})).data as KHAPIResponse<KHGuild[]>
    if (data.code === 0) {
      return data.data.map((e) => {
        return {
          id: e.id,
          name: e.name,
          topic: e.topic,
          masterId: e.master_id,
          isMaster: e.is_master,
          icon: e.icon,
          inviteEnabled: e.invite_enabled,
          notifyType: e.notify_type,
          region: e.region,
          enableOpen: e.enable_open,
          openId: e.open_id,
          defaultChannelId: e.default_channel_id,
          welcomeChannelId: e.welcome_channel_id
        } as Guild
      }) as Guild[]
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 获取服务器中的用户列表
   * @param guildId 服务器 Id
   * @param channelId 频道 Id
   * @param search 搜索关键字，在用户名或昵称中搜索
   * @param roleId 角色 ID，获取特定角色的用户列表
   * @param mobileVerified 只能为`0`或`1`，`0`是未认证，`1`是已认证
   * @param activeTime 根据活跃时间排序，`0`是顺序排列，`1`是倒序排列
   * @param joinedAt 根据加入时间排序，`0`是顺序排列，`1`是倒序排列
   * @param page 目标页
   * @param pageSize 每页数据数量
   * @return 用户列表
   */
  async getGuildUserList (guildId: string, channelId?: string, search?: string, roleId?: number, mobileVerified?: boolean, activeTime?: boolean, joinedAt?: boolean, page?: number, pageSize?: number) {
    const data = (await this.self.get('v3/guild/user-list', {
      guild_id: guildId,
      channel_id: channelId,
      search: search,
      role_id: roleId,
      mobile_verified: mobileVerified,
      active_time: activeTime,
      joined_at: joinedAt,
      page: page,
      page_size: pageSize
    })).data as KHAPIResponse<KHGuildUserListResponse>
    if (data.code === 0) {
      return {
        items: data.data.items.map((e) => {
          return {} as User
        })
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async getGuildUserListWithFilter (guildId:string, channelId:string, filterOption:{
    search:string,
    roleId: number,
    mobileVerified:boolean
  }, orderOption:{
    activeTime:boolean,
    joinedAt:boolean
  }) {

  }
}
