import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createDecipheriv } from 'crypto'
import { KaiheilaEventRequest, KaiheilaEvent, KHSystemMessage } from './kaiheila.type'
import { zeroPadding } from './utils'
import { EventEmitter } from 'events'
import { AudioMessage, FileMesage as FileMessage, ImageMessage, KMarkDownMessage, MessageType, TextMessage, VideoMessage } from './types'
import axios, { AxiosInstance } from 'axios'

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
   * 是否忽略解密错误的消息
   * 也不会产生error事件，会直接next
   */
  ignoreDecryptError: boolean;

}

interface snMap{
  [key:number]:number
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
  on(event: 'rawEvent', listener: (event:KaiheilaEvent) => void): this;
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
  on(event: 'unknownEvent', listener: (event:KaiheilaEvent) => void): this;
}

export class KaiheilaBot extends EventEmitter implements BotEventEmitter {
  private key?: Buffer
  config:BotConfig
  private snMap: snMap={}
  axios: AxiosInstance
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
    this.axios = axios.create({
      baseURL: 'https://www.kaiheila.cn/api',
      headers: {
        Authorization: 'Bot ' + this.config.token
      }
    })
    if (config.key) {
      this.key = zeroPadding(config.key || '')
    }
  }

  /**
   * 获取中间件
   * 可用于共用Koa实例。
   */
  getMiddleware () {
    return this.route.bind(this)
  }

  private async route (context:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>, next:Koa.Next) {
    const request = context.request.body
    let eventRequest:KaiheilaEventRequest
    if (this.key) {
      try {
        eventRequest = this.decryptRequest(request)
      } catch (error) {
        if (this.config.ignoreDecryptError) {
          return next()
        } else {
          this.emit('error', error)
          context.throw('Not Kaiheila Request or bad encryption or unencrypted request', 500)
        }
      }
    } else {
      eventRequest = request
    }
    if (!this.verifyRequest(eventRequest)) {
      return next()
    }
    if (this.handleChallenge(eventRequest, context)) {
      return
    }
    context.body = 1
    if (!this.verifySN(eventRequest)) {
      return
    }
    this.handleMessage(eventRequest)
  }

  private handleMessage (eventRequest:KaiheilaEventRequest) {
    try {
      this.emit('rawEvent', eventRequest.d)
    } catch (error) {
      this.emit('error', error)
    }

    switch (eventRequest.d.type) {
      case 255:
        this.emit('systemMessage', eventRequest.d)
        break
      case 1:
        this.emit('message', new TextMessage(eventRequest.d))
        break
      case 2:
        this.emit('message', new ImageMessage(eventRequest.d))
        break
      case 3:
        this.emit('message', new VideoMessage(eventRequest.d))
        break
      case 4:
        this.emit('message', new FileMessage(eventRequest.d))
        break
      case 8:
        this.emit('message', new AudioMessage(eventRequest.d))
        break
      case 9:
        this.emit('message', new KMarkDownMessage(eventRequest.d))
        break
      default:
        this.emit('unknownEvent', eventRequest.d)
        break
    }
  }

  /**
   * 解密
   * @param request 请求体
   */
  private decryptRequest (request:any) {
    if (typeof request.encrypt === 'string') {
      if (!this.key) {
        throw new Error('No Key')
      }
      const encrypted = Buffer.from(request.encrypt, 'base64')
      const iv = encrypted.subarray(0, 16)
      const encryptedData = Buffer.from(encrypted.subarray(16, encrypted.length).toString(), 'base64')
      const decipher = createDecipheriv('aes-256-cbc', this.key, iv)
      const decrypt = Buffer.concat([decipher.update(encryptedData), decipher.final()])
      const data = JSON.parse(decrypt.toString())
      return data as KaiheilaEventRequest
    } else {
      if (this.config.ignoreDecryptError) {
        throw new Error('Unencrypted Request')
      }
      return request as KaiheilaEventRequest
    }
  }

  private verifyRequest (body:any) {
    if (typeof body !== 'object' || typeof body.s !== 'number' || typeof body.d !== 'object') {
      return false
    }
    if (this.config.mode === 'webhook' && body.verify_token !== this.config.verifyToken) {
      return false
    }
    return true
  }

  private verifySN (body:KaiheilaEventRequest) {
    if (this.snMap[body.sn as number] && this.snMap[body.sn as number] - Date.now() < 1000 * 600) {
      return false
    }
    this.snMap[body.sn as number] = Date.now()
    return true
  }

  private handleChallenge (eventRequest:KaiheilaEventRequest, context:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>) {
    if (eventRequest.d.type === 255 && eventRequest.d.channel_type === 'WEBHOOK_CHALLENGE') {
      context.body = {
        challenge: eventRequest.d.challenge
      }
      return true
    }
    return false
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

  getUserIntimacy (userId:string) {
    return this.get('/api/v3/intimacy/index', {
      user_id: userId
    })
  }

  updateUserIntimacy (userId:string, score?:number, socialInfo?:string, imgId?:number) {
    return this.post('/api/v3/intimacy/update', {
      user_id: userId,
      score,
      social_info: socialInfo,
      img_id: imgId
    })
  }

  private post (url:string, data:any) {
    return this.axios.post(url, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  private get (url:string, params:any) {
    return this.axios.get(url, {
      params: new URLSearchParams(params)
    })
  }

  /**
   * 启动监听
   *
   * 会在指定端口号启动一个http服务
   */
  listen () {
    const app = new Koa()
    app.use(bodyParser())
    app.use(this.getMiddleware())
    app.listen(this.config.port)
  }

  /**
   * 链接Websocket
   */
  connect () {
    throw new Error('not support yet')
  }
}
