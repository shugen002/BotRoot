import { createDecipheriv } from 'crypto'
import { EventEmitter } from 'events'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { cloneDeep } from 'lodash'
import { BotInstance } from '../BotInstance'
import FailDecryptError from '../models/Error/FailDecryptError'

import { KHEventPacket, KHPacket } from '../types/kaiheila/packet'

import { zeroPadding } from '../utils'
import { MessageSource } from './MessageSource'

interface snMap {
  [key: number]: number
}

export default class WebhookSource extends MessageSource {
  type = 'webhook'
  private snMap: snMap = {}
  private key?: Buffer
  public verifyToken?: string
  public port = 8600
  public httpServer?: Koa<Koa.DefaultState, Koa.DefaultContext>
  connect: () => Promise<boolean>

  constructor(
    self: BotInstance,
    config: {
      key?: string
      port: number
      verifyToken?: string
    } = {
      port: 8600,
    }
  ) {
    super(self)
    if (config.key) {
      this.key = zeroPadding(config.key || '')
    }
    if (config.port) {
      this.port = config.port
    }
    if (config.verifyToken) {
      this.verifyToken = config.verifyToken
    }
    this.connect = this.listen
  }

  /**
   * 获取中间件
   * 可用于共用Koa实例。
   */
  getMiddleware() {
    return this.route.bind(this)
  }

  private async route(
    context: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
    next: Koa.Next
  ) {
    const request = context.request.body
    let eventRequest: KHPacket
    if (this.key) {
      try {
        eventRequest = this.decryptRequest(request)
      } catch (error) {
        console.warn('Decrypt Error', error)
        return next()
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
    this.onEventArrive(eventRequest as KHEventPacket)
  }
  protected onEventArrive(packet: KHEventPacket): void {
    if (!this.verifySN(packet)) {
      return
    }
    this.emit('message', cloneDeep(packet))
    this.eventProcess(packet)
  }
  /**
   * 解密
   * @param request 请求体
   */
  private decryptRequest(request: any) {
    if (typeof request.encrypt === 'string') {
      if (!this.key) {
        throw new FailDecryptError('No Key')
      }
      const encrypted = Buffer.from(request.encrypt, 'base64')
      const iv = encrypted.subarray(0, 16)
      const encryptedData = Buffer.from(
        encrypted.subarray(16, encrypted.length).toString(),
        'base64'
      )
      const decipher = createDecipheriv('aes-256-cbc', this.key, iv)
      const decrypt = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ])
      const data = JSON.parse(decrypt.toString())
      return data as KHPacket
    } else {
      console.log('Unencrypted Request')

      return request as KHPacket
    }
  }

  private verifyRequest(body: any) {
    if (
      typeof body !== 'object' ||
      typeof body.s !== 'number' ||
      typeof body.d !== 'object'
    ) {
      return false
    }
    if (
      typeof this.verifyToken !== 'undefined' &&
      body.d.verify_token !== this.verifyToken
    ) {
      return false
    }
    return true
  }

  private verifySN(body: KHPacket) {
    if (
      this.snMap[body.sn as number] &&
      this.snMap[body.sn as number] - Date.now() < 1000 * 600
    ) {
      return false
    }
    this.snMap[body.sn as number] = Date.now()
    return true
  }

  private handleChallenge(
    eventRequest: KHPacket,
    context: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>
  ) {
    if (
      eventRequest.d.type === 255 &&
      eventRequest.d.channel_type === 'WEBHOOK_CHALLENGE'
    ) {
      context.body = {
        challenge: eventRequest.d.challenge,
      }
      return true
    }
    return false
  }

  /**
   * 启动监听
   *
   * webhook模式下会在指定端口号启动一个http服务
   */
  async listen() {
    const app = new Koa()
    app.use(bodyParser())
    app.use(this.getMiddleware())
    this.httpServer = app
    app.listen(this.port)
    return true
  }
}
