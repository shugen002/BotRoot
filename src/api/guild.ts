import { KaiheilaBot } from '..'
import RequestError from '../error/RequestError'
import {
  KHAPIMultiPage,
  KHAPIResponse,
  KHGuildUserListResponse,
} from '../types/kaiheila/api'
import { KHGuild } from '../types/kaiheila/kaiheila.type'
import { Guild } from '../types/types'

export class GuildAPI {
  private self: KaiheilaBot

  constructor(self: KaiheilaBot) {
    this.self = self
  }

  async list() {
    const data = (await this.self.get('v3/guild/list', {}))
      .data as KHAPIResponse<KHAPIMultiPage<KHGuild>>
    if (data.code === 0) {
      return {
        items: data.data.items.map((e) => {
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
            welcomeChannelId: e.welcome_channel_id,
          } as Guild
        }) as Guild[],
        meta: {
          page: data.data.meta.page,
          totalPage: data.data.meta.page_total,
          pageSize: data.data.meta.page_size,
          total: data.data.meta.total,
        },
        sort: data.data.sort,
      }
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
  async userList(
    guildId: string,
    channelId?: string,
    search?: string,
    roleId?: number,
    mobileVerified?: boolean,
    activeTime?: boolean,
    joinedAt?: boolean,
    page?: number,
    pageSize?: number
  ) {
    const data = (
      await this.self.get('v3/guild/user-list', {
        guild_id: guildId,
        channel_id: channelId,
        search: search,
        role_id: roleId,
        mobile_verified: mobileVerified,
        active_time: activeTime,
        joined_at: joinedAt,
        page: page,
        page_size: pageSize,
      })
    ).data as KHAPIResponse<KHGuildUserListResponse>
    if (data.code === 0) {
      return {
        items: data.data.items.map((e) => {
          return {
            id: e.id,
            username: e.username,
            avatar: e.avatar,
            online: e.online,
            nickname: e.nickname,
            joinedAt: e.joined_at,
            activeTime: e.active_time,
            roles: e.roles,
            isMaster: e.is_master,
            identitfyNum: e.abbr || e.identify_num,
          }
        }),
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async nickname(guildId: string, nickname?: string, userId?: string) {
    const data = (
      await this.self.post('v3/guild/nickname', {
        guild_id: guildId,
        nickname,
        user_id: userId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async leave(guildId: string) {
    const data = (
      await this.self.post('v3/guild/leave', {
        guild_id: guildId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async kickout(guildId: string, targetId: string) {
    const data = (
      await this.self.post('v3/guild/kickout', {
        guild_id: guildId,
        target_id: targetId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
