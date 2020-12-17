import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { createDecipheriv } from 'crypto'
import { KaiheilaEventRequest } from './kaiheila'
import { writeFile } from 'fs'
import { BotConfig } from './bot'
import { zeroPadding } from './utils'
import { EventEmitter } from 'events'

export default class KaiheilaBot extends EventEmitter {
  constructor (config:BotConfig) {
    super()
    const key = zeroPadding(config.key || '')

    const app = new Koa()

    app.use(bodyParser())
    app.use(async (ctx) => {
      const request = ctx.request.body
      let eventRequest:KaiheilaEventRequest
      // 自动解密
      if (typeof request.encrypt === 'string') {
        const encrypted = Buffer.from(request.encrypt, 'base64')
        const iv = encrypted.subarray(0, 16)
        const encryptedData = Buffer.from(encrypted.subarray(16, encrypted.length).toString(), 'base64')
        const decipher = createDecipheriv('aes-256-cbc', key, iv)
        const decrypt = Buffer.concat([decipher.update(encryptedData), decipher.final()])
        const data = JSON.parse(decrypt.toString())
        eventRequest = data as KaiheilaEventRequest
      } else {
        eventRequest = ctx.request.body as KaiheilaEventRequest
      }

      if (eventRequest.d) {
        if (eventRequest.d.type === 255 && eventRequest.d.channel_type === 'WEBHOOK_CHALLENGE') {
          ctx.body = {
            challenge: eventRequest.d.challenge
          }
          return
        }
        switch (eventRequest.d.type) {
          case 255:

            break
          case 1:
            break
          default:
            ctx.body = 1
            this.emit('textMessage', eventRequest.d)
            break
        }
        if (typeof eventRequest.d.msg_id === 'string') {
          writeFile(`cache/${eventRequest.d.msg_id}.json`, JSON.stringify(eventRequest.d, undefined, 2), (e) => {
            if (e) {
              console.error(e)
            }
          })
        }
      }
    })

    app.listen(8600)
  }
}
