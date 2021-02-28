import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { EventEmitter } from 'events'

import WebhookSource from './MessageSource/WebhookSource'
import WebSocketSource from './MessageSource/WebSocketSource'
import { API } from './api'
import { URLSearchParams } from 'url'
import { MessageSource } from './MessageSource/MessageSource'

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

export class BotInstance extends EventEmitter {
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
        break
      default:
        this.messageSource = new WebhookSource(
          this,
          config as {
            key?: string
            port: number
            verifyToken?: string
          }
        )
        break
    }
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
   * 链接消息源
   */
  connect(): void {
    this.messageSource.connect()
  }
}
