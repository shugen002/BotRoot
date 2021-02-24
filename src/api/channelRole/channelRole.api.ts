import { KaiheilaBot } from '../..'
import RequestError from '../../error/RequestError'
import { transformUser } from '../../helper'
import { KHAPIResponse } from '../../types/kaiheila/api'
import {
  ChannelRoleListResponseInternal,
  ChannelRoleUpdateResponseInternal,
  KHChannelRoleListResponse,
  KHChannelRoleUpdateResponse,
} from './channelRole.types'

export class ChannelRoleAPI {
  private self: KaiheilaBot
  constructor(self: KaiheilaBot) {
    this.self = self
  }

  /**
   * 频道角色权限详情
   * @param channelId 频道id
   */
  async index(channelId: string): Promise<ChannelRoleListResponseInternal> {
    const data = (
      await this.self.get('v3/channel-role/index', {
        channel_id: channelId,
      })
    ).data as KHAPIResponse<KHChannelRoleListResponse>
    if (data.code === 0) {
      return {
        permissionOverwrites: data.data.permission_overwrites.map((e) => {
          return {
            roleId: e.role_id,
            allow: e.allow,
            deny: e.deny,
          }
        }),
        permissionUsers: data.data.permission_users.map((e) => {
          return {
            user: transformUser(e.user),
            allow: e.allow,
            deny: e.deny,
          }
        }),
        permissionSync: !!data.data.permission_sync,
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 创建频道角色权限
   * @param channelId 频道id, 如果频道是分组的id,会同步给所有sync=1的子频道
   * @param type value的类型，只能为"role_id","user_id",不传则默认为"role_id"
   * @param value value的值
   */
  async create(
    channelId: string,
    type: 'role_id' | 'user_id',
    value: string
  ): Promise<boolean> {
    const data = (
      await this.self.post('v3/channel-role/create', {
        channel_id: channelId,
        type,
        value,
      })
    ).data as KHAPIResponse<Record<string, never>>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async update(
    channelId: string,
    type: 'role_id' | 'user_id',
    value: string,
    allow: number,
    deny: number
  ): Promise<ChannelRoleUpdateResponseInternal> {
    const data = (
      await this.self.post('v3/channel-role/update', {
        channel_id: channelId,
        type,
        value,
        allow,
        deny,
      })
    ).data as KHAPIResponse<KHChannelRoleUpdateResponse>
    if (data.code === 0) {
      return {
        role: data.data.role,
        allow: data.data.allow,
        deny: data.data.deny,
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除频道角色权限
   * @param channelId 频道id, 如果频道是分组的id,会同步给所有sync=1的子频道
   * @param type value的类型，只能为"role_id","user_id",不传则默认为"role_id"
   * @param value value的值，默认为0
   */
  async delete(channelId: string, type: string, value = '0'): Promise<boolean> {
    const data = (
      await this.self.post('v3/channel-role/delete', {
        channel_id: channelId,
        type,
        value,
      })
    ).data as KHAPIResponse<Record<string, never>>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
