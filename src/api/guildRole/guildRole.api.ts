import { BotInstance } from '../../BotInstance'
import RequestError from '../../models/Error/RequestError'
import { Role } from '../../types/common'
import { KHAPIResponse } from '../../types/kaiheila/api'
import { KHRole } from '../../types/kaiheila/types'
import {
  KHGrantUserRoleResponse,
  KHRevokeUserRoleResponse,
  UserRoleGrantResponseInternal,
  UserRoleRevokeResponseInternal,
} from './guildRole.types'

export class GuildRoleAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  /**
   * 获取服务器角色列表
   * @param guildId 服务器的id
   */
  async index(guildId: string): Promise<Role[]> {
    const data = (
      await this.self.get('v3/guild-role/index', {
        guild_id: guildId,
      })
    ).data as KHAPIResponse<KHRole[]>
    if (data.code === 0) {
      return data.data.map((role) => {
        return {
          roleId: role.role_id,
          name: role.name,
          color: role.color,
          position: role.position,
          hoist: role.hoist,
          mentionable: role.mentionable,
          permissions: role.permissions,
        }
      }) as Role[]
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 创建服务器角色
   * @param name 角色名称
   * @param guildId 服务器id
   * @returns 创建的角色
   */
  async create(guildId: string, name?: string): Promise<Role> {
    const data = (
      await this.self.post('v3/guild-role/create', {
        name,
        guild_id: guildId,
      })
    ).data as KHAPIResponse<KHRole>
    if (data.code === 0) {
      return {
        roleId: data.data.role_id,
        name: data.data.name,
        color: data.data.color,
        position: data.data.position,
        hoist: data.data.hoist,
        mentionable: data.data.mentionable,
        permissions: data.data.permissions,
      } as Role
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 给用户角色
   *
   * @param {string} guildId 服务器ID
   * @param {string} userId 用户ID
   * @param {string|number} roleId 角色ID
   */
  async grant(
    guildId: string,
    userId: string,
    roleId: string | number
  ): Promise<UserRoleGrantResponseInternal> {
    if (typeof roleId === 'string') roleId = parseInt(roleId)
    const data = (
      await this.self.post('v3/guild-role/grant', {
        guild_id: guildId,
        user_id: userId,
        role_id: roleId,
      })
    ).data as KHAPIResponse<KHGrantUserRoleResponse>
    if (data.code === 0) {
      return {
        userId: data.data.user_id,
        guildId: data.data.guild_id,
        roles: data.data.roles,
      } as UserRoleGrantResponseInternal
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 更新服务器角色权限
   * @param role 角色预期修改后的样子
   * @param guildId 服务器id
   * @returns 更新后的角色
   */
  async update(guildId: string, role: Role): Promise<Role> {
    const data = (
      await this.self.post('v3/guild-role/update', {
        guild_id: guildId,
        name: role.name,
        color: role.color,
        role_id: role.roleId,
        hoist: role.roleId,
        mentionable: role.mentionable,
        permissions: role.permissions,
      })
    ).data as KHAPIResponse<KHRole>
    if (data.code === 0) {
      return {
        roleId: data.data.role_id,
        name: data.data.name,
        color: data.data.color,
        position: data.data.position,
        hoist: data.data.hoist,
        mentionable: data.data.mentionable,
        permissions: data.data.permissions,
      } as Role
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除用户角色
   * @param guildId 服务器id
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  async revoke(
    guildId: string,
    userId: string,
    roleId: string | number
  ): Promise<UserRoleRevokeResponseInternal> {
    if (typeof roleId === 'string') roleId = parseInt(roleId)
    const data = (
      await this.self.post('v3/guild-role/revoke', {
        guild_id: guildId,
        user_id: userId,
        role_id: roleId,
      })
    ).data as KHAPIResponse<KHRevokeUserRoleResponse>
    if (data.code === 0) {
      return {
        userId: data.data.user_id,
        guildId: data.data.guild_id,
        roles: data.data.roles,
      } as UserRoleRevokeResponseInternal
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除服务器角色
   * @param guildId 服务器id
   * @param roleId 角色id
   */
  async delete(guildId: string, roleId: string | number): Promise<boolean> {
    const data = (
      await this.self.post('v3/guild-role/delete', {
        guild_id: guildId,
        role_id: roleId,
      })
    ).data as KHAPIResponse<[]>
    if (data.code === 0) {
      return true
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
