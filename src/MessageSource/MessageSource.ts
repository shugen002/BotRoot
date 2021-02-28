import EventEmitter from 'events'
import { cloneDeep } from 'lodash'
import { BotInstance } from '../BotInstance'
import { transformMessage } from '../helper/transformer/message'
import { KHEventPacket } from '../types/kaiheila/packet'

export interface MessageSource extends EventEmitter {
  type: string

  on(event: 'message', listener: (eventRequest: KHEventPacket) => void): this

  connect(): Promise<boolean>
}

export class MessageSource extends EventEmitter {
  protected self: BotInstance
  constructor(self: BotInstance) {
    super()
    this.self = self
  }
  async connect(): Promise<boolean> {
    return false
  }
  protected buffer: KHEventPacket[] = []
  protected sn = 0
  protected onEventArrive(packet: KHEventPacket): void {
    if ((packet as KHEventPacket).sn === this.sn + 1) {
      this.sn += 1
      this.emit('message', cloneDeep(packet))
      this.eventProcess(packet)
      this.buffer.sort((a, b) => a.sn - b.sn)
      while (this.buffer.length > 0 && this.buffer[0].sn < this.sn + 1) {
        this.buffer.shift()
      }
      while (this.buffer.length > 0 && this.buffer[0].sn === this.sn + 1) {
        const packet = this.buffer.shift()
        this.emit('message', cloneDeep(packet))
        this.eventProcess((packet as unknown) as KHEventPacket)
        while (this.buffer.length > 0 && this.buffer[0].sn < this.sn + 1) {
          this.buffer.shift()
        }
      }
    } else if ((packet as KHEventPacket).sn > this.sn + 1) {
      this.buffer.push(packet as KHEventPacket)
    }
  }

  protected eventProcess(packet: KHEventPacket): void {
    const result = transformMessage(packet.d)
    this.self.emit(result.type, result.data)
  }
}
