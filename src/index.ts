import { KHMessage, KHSystemMessage } from './types/kaiheila/kaiheila.type'
import { KHPacket } from './types/kaiheila/packet'
import { zeroPadding } from './utils'
import { EventEmitter } from 'events'
import { AudioMessage, FileMesage as FileMessage, ImageMessage, KMarkDownMessage, MessageSource, MessageType, TextMessage, VideoMessage } from './types'
import axios, { AxiosInstance } from 'axios'
import { cloneDeep } from 'lodash'
import WebhookSource from './MessageSource/WebhookSource'
import { KHGetGatewayResponse, KHAPIResponse, KHGetCurrentUserInfoResponse, KHGrantUserRoleResponse } from './types/kaiheila/api'
import RequestError from './error/RequestError'
import { CurrentUserInfo, GetGatewayResponse } from './types/api'
import WebSocketSource from './MessageSource/WebSocketSource'
export interface BotConfig{
  mode: 'webhook'|'websocket'|'pc';
  port?: number;
  key?: string;
  token:string;
  /**
   * 校验码，需要和
   */
  verifyToken?:string;
  /**
   * cookie 客户端模拟模式必填。
   */
  cookies?:string;
  /**
   * 是否忽略解密错误的消息
   * 也不会产生error事件，会直接next
   */
  ignoreDecryptError: boolean;

}

function DefaultConfig () {
  return {
    mode: 'webhook',
    port: 8600,
    ignoreDecryptError: true
  }
}
export interface BotEventEmitter {
  /**
   * 获取原始事件，challenge已被剔除
   */
  on(event: 'rawEvent', listener: (event:KHMessage) => void): this;
  /**
   * 系统事件，目前还没有，占坑，勿用
   */
  on(event: 'systemMessage', listener: (event:KHSystemMessage) => void): this;
  /**
   * 注册监听所有处理过的事件
   */
  on(event: 'message', listener: (event:TextMessage|ImageMessage|VideoMessage|FileMessage|AudioMessage|KMarkDownMessage) => void): this;
  /**
   * 注册监听未知的事件
   */
  on(event: 'unknownEvent', listener: (event:KHMessage) => void): this;
}

export class KaiheilaBot extends EventEmitter {
  config:BotConfig
  axios: AxiosInstance
  messageSource:MessageSource
  /**
   * 开黑啦机器人实例
   * @param config 设置
   */
  constructor (config:BotConfig) {
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
        Authorization: 'Bot ' + this.config.token
      }
    })
    // }
    switch (this.config.mode) {
      case 'websocket':
        this.messageSource = new WebSocketSource(this)
        break

      default:
        this.messageSource = new WebhookSource(config as {
          key?:string,
          port:number,
          verifyToken?:string
        })
        this.messageSource.on('message', this.handleMessage.bind(this))
        break
    }
  }

  private handleMessage (eventRequest:KHPacket) {
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
  sendChannelMessage (type:MessageType, channelId:string, content:string, quote?:string) {
    return this.post('v3/channel/message', {
      object_name: type,
      channel_id: channelId,
      content: content,
      quote,
      nonce: Math.random()
    })
  }

  /**
   * 获取用户亲密度
   * @param userId 用户id
   */
  getUserIntimacy (userId:string) {
    return this.get('v3/intimacy/index', {
      user_id: userId
    })
  }

  updateUserIntimacy (userId:string, score?:number, socialInfo?:string, imgId?:number) {
    return this.post('v3/intimacy/update', {
      user_id: userId,
      score,
      social_info: socialInfo,
      img_id: imgId
    })
  }

  post (url:string, data:any) {
    return this.axios.post(url, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  get (url:string, params:any) {
    return this.axios.get(url, {
      params: new URLSearchParams(params)
    })
  }

  /**
   * 拉取机器人所在的所有服务器。
   */
  async getGuildList () {
    const res = await this.get('v3/guild/index', {})
    return res.data
  }

  async getGateWay (compress = 0) {
    const data = (await this.get('v3/gateway/index', {
      compress
    })).data as KHAPIResponse<KHGetGatewayResponse>
    if (data.code === 0) {
      return data.data as GetGatewayResponse
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  async getCurrentUserInfo () {
    const data = (await this.get('v3/user/me', {})).data as KHAPIResponse<KHGetCurrentUserInfoResponse>
    if (data.code === 0) {
      return {
        id: data.data.id,
        username: data.data.username,
        identifyNum: data.data.identify_num,
        online: data.data.online,
        status: data.data.status,
        avatar: data.data.avatar,
        bot: data.data.bot,
        mobileVerified: data.data.mobile_verified,
        system: data.data.system,
        mobilePrefix: data.data.mobile_prefix,
        invitedCount: data.data.invited_count,
        mobile: data.data.mobile
      } as CurrentUserInfo
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
   * @memberof KaiheilaBot
   */
  async grantUserRole (guildId: string, userId: string, roleId: string|number) {
    if (typeof roleId === 'string') roleId = parseInt(roleId)
    const data = (await this.post('v3/guild-role/grant', { guild_id: guildId, user_id: userId, role_id: roleId})).data as KHAPIResponse<KHGrantUserRoleResponse>
    if (data.code === 0) {
      return {
        userId: data.data.user_id,
        guildId: data.data.guild_id,
        roles: data.data.roles
      }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }

  /**
   * 链接消息源
   */
  connect () {
    this.messageSource.connect()
  }

  /**
   * 启动监听
   *
   * webhook模式下会在指定端口号启动一个http服务
   * @deprecated 使用connect替代
   */
  listen () {
    this.messageSource.connect()
  }
}
