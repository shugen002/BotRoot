import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { cloneDeep } from 'lodash'
import { EventEmitter } from 'events'
import FormData, { Stream } from 'form-data'

import { KHMessage, KHSystemMessage } from './types/kaiheila/kaiheila.type'
import { KHPacket } from './types/kaiheila/packet'
import {
  AudioMessage,
  FileMessage,
  ImageMessage,
  KMarkDownMessage,
  MessageSource,
  MessageType,
  TextMessage,
  VideoMessage,
} from './types'
import WebhookSource from './MessageSource/WebhookSource'
import { KHAPIResponse, KHGrantUserRoleResponse } from './types/kaiheila/api'
import RequestError from './error/RequestError'
import { UserRoleResponse } from './types/api'
import WebSocketSource from './MessageSource/WebSocketSource'
import { RoleInternal } from './types/internal'
import { KHRole } from './types/kaiheila/types'
import { API } from './api'
import { URLSearchParams } from 'url'

export interface BotConfig {
  mode: 'webhook' | 'websocket' | 'pc'
  port?: number
  key?: string
  token: string
  /**
   * 校验码，需要和
   */
  verifyToken?: string
  /**
   * cookie 客户端模拟模式必填。
   */
  cookies?: string
  /**
   * 是否忽略解密错误的消息
   * 也不会产生error事件，会直接next
   */
  ignoreDecryptError: boolean
}

function DefaultConfig() {
  return {
    mode: 'webhook',
    port: 8600,
    ignoreDecryptError: true,
  }
}

export interface BotEventEmitter {
  /**
   * 获取原始事件，challenge已被剔除
   */
  on(event: 'rawEvent', listener: (event: KHMessage) => void): this

  /**
   * 系统事件，目前还没有，占坑，勿用
   */
  on(event: 'systemMessage', listener: (event: KHSystemMessage) => void): this

  /**
   * 注册监听所有处理过的事件
   */
  on(
    event: 'message',
    listener: (
      event:
        | TextMessage
        | ImageMessage
        | VideoMessage
        | FileMessage
        | AudioMessage
        | KMarkDownMessage
    ) => void
  ): this

  /**
   * 注册监听未知的事件
   */
  on(event: 'unknownEvent', listener: (event: KHMessage) => void): this
}

export class KaiheilaBot extends EventEmitter {
  config: BotConfig
  axios: AxiosInstance
  messageSource: MessageSource
  API: API

  /**
   * 开黑啦机器人实例
   * @param config 设置
   */
  constructor(config: BotConfig) {
    super()
    this.config = DefaultConfig() as BotConfig
    Object.assign(this.config, config)
    if (!config.token) {
      throw new Error('Token Not Provided')
    }
    this.config = config
    // if (this.config.mode === 'pc') {
    //   this.axios = axios.create({
    //     baseURL: 'https://www.kaiheila.cn/api',
    //     headers: {
    //       cookies: this.config.cookies
    //     }
    //   })
    // } else {
    this.axios = axios.create({
      baseURL: 'https://www.kaiheila.cn/api',
      headers: {
        Authorization: 'Bot ' + this.config.token,
      },
    })
    // }
    this.API = new API(this)
    switch (this.config.mode) {
      case 'websocket':
        this.messageSource = new WebSocketSource(this)
        this.messageSource.on('message', this.handleMessage.bind(this))
        break
      default:
        this.messageSource = new WebhookSource(
          config as {
            key?: string
            port: number
            verifyToken?: string
          }
        )
        this.messageSource.on('message', this.handleMessage.bind(this))
        break
    }
  }

  private handleMessage(eventRequest: KHPacket) {
    try {
      this.emit('rawEvent', cloneDeep(eventRequest.d))
    } catch (error) {
      this.emit('error', error)
    }

    switch (eventRequest.d.type) {
      case 255:
        this.emit('systemMessage', cloneDeep(eventRequest.d))
        break
      case 1:
        this.emit('message', new TextMessage(cloneDeep(eventRequest.d)))
        break
      case 2:
        this.emit('message', new ImageMessage(cloneDeep(eventRequest.d)))
        break
      case 3:
        this.emit('message', new VideoMessage(cloneDeep(eventRequest.d)))
        break
      case 4:
        this.emit('message', new FileMessage(cloneDeep(eventRequest.d)))
        break
      case 8:
        this.emit('message', new AudioMessage(cloneDeep(eventRequest.d)))
        break
      case 9:
        this.emit('message', new KMarkDownMessage(cloneDeep(eventRequest.d)))
        break
      default:
        this.emit('unknownEvent', cloneDeep(eventRequest.d))
        break
    }
  }

  /**
   * 发送频道聊天消息
   * @param type 消息类型
   * @param channelId 目标频道 id
   * @param content 消息内容
   * @param quote 回复某条消息的 msgId
   */
  sendChannelMessage(
    type: MessageType,
    channelId: string,
    content: string,
    quote?: string
  ) {
    return this.post('v3/channel/message', {
      object_name: type,
      channel_id: channelId,
      content: content,
      quote,
      nonce: Math.random(),
    })
  }

  /**
   * 获取用户亲密度
   * @param userId 用户id
   */
  getUserIntimacy(userId: string) {
    return this.get('v3/intimacy/index', {
      user_id: userId,
    })
  }

  updateUserIntimacy(
    userId: string,
    score?: number,
    socialInfo?: string,
    imgId?: number
  ) {
    return this.post('v3/intimacy/update', {
      user_id: userId,
      score,
      social_info: socialInfo,
      img_id: imgId,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  post(url: string, data: any): Promise<AxiosResponse<any>> {
    return this.axios.post(url, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  get(url: string, params: any): Promise<AxiosResponse<any>> {
    return this.axios.get(url, {
      params: new URLSearchParams(params),
    })
  }

  /**
   * 给用户角色
   *
   * @param {string} guildId 服务器ID
   * @param {string} userId 用户ID
   * @param {string|number} roleId 角色ID
   */
  async grantUserRole(
    guildId: string,
    userId: string,
    roleId: string | number
  ) {
    if (typeof roleId === 'string') roleId = parseInt(roleId)
    const data = (
      await this.post('v3/guild-role/grant', {
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
      } as UserRoleResponse
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async revokeUserRole(
    guildId: string,
    userId: string,
    roleId: string | number
  ) {
    if (typeof roleId === 'string') roleId = parseInt(roleId)
    const data = (
      await this.post('v3/guild-role/revoke', {
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
      } as UserRoleResponse
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 获取服务器角色列表
   * @param guildId 服务器的id
   */
  async getGuildRolesList(guildId: string) {
    const data = (
      await this.get('v3/guild-role/index', {
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
      }) as RoleInternal[]
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
  async createGuildRole(guildId: string, name?: string) {
    const data = (
      await this.post('v3/guild-role/create', {
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
      } as RoleInternal
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
  async updateGuildRole(guildId: string, role: RoleInternal) {
    const data = (
      await this.post('v3/guild-role/create', {
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
      } as RoleInternal
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 删除服务器角色
   * @param guildId 服务器id
   * @param roleId 角色id
   */
  async deleteGuildRole(guildId: string, roleId: string | number) {
    const data = (
      await this.post('v3/guild-role/delete', {
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

  /**
   * 上传文件
   * @param file 文件，看到参数错误时需要在选项中补齐文件相关内容。
   * @param option 选项，参见 [form-data](https://github.com/form-data/form-data)
   */
  async createAsset(file: Buffer | Stream, option?: FormData.AppendOptions) {
    const form = new FormData()
    form.append('file', file, option)
    const data = (
      await this.axios.post('v3/asset/create', form, {
        headers: form.getHeaders(),
      })
    ).data as KHAPIResponse<{ url: string }>
    if (data.code === 0) {
      return data.data.url
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 链接消息源
   */
  connect() {
    this.messageSource.connect()
  }

  /**
   * 启动监听
   *
   * webhook模式下会在指定端口号启动一个http服务
   * @deprecated 使用connect替代
   */
  listen() {
    this.messageSource.connect()
  }
}
