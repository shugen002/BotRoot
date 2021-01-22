import { EventEmitter } from 'events'
import { MessageSource } from '../types'
import WebSocket from 'ws'
import { KaiheilaBot } from '..'
import { inflate, InputType } from 'zlib'
import { KHPacket } from '../types/kaiheila/packet'
export default class WebSocketSource extends EventEmitter implements MessageSource {
  type = 'websocket'
  private self: KaiheilaBot
  socket?: WebSocket
  private compress: boolean

  constructor (self:KaiheilaBot, compress:boolean = true) {
    super()
    this.self = self
    this.compress = compress
    this.connect()
  }

  async connect () {
    const url = (await this.self.getGateWay(this.compress ? 1 : 0)).url
    this.socket = new WebSocket(url)
    this.socket.on('message', this.dataHandler.bind(this))
    return true
  }

  private async dataHandler (data:Buffer|string) {
    let packet:KHPacket
    if (this.compress && Buffer.isBuffer(data)) {
      packet = JSON.parse((await inflatePromise(data)).toString())
    } else {
      packet = JSON.parse(data as string)
    }
    this.packetHandler(packet)
    // this.emit('message', packet)
  }

  private async packetHandler (packet:KHPacket) {

  }
}

function inflatePromise (data: InputType):Promise<Buffer> {
  return new Promise((resolve, reject) => {
    inflate(data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
