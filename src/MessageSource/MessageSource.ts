import EventEmitter from 'events'
import { KHEventPacket, KHPacket } from '../types/kaiheila/packet'

export class MessageSource extends EventEmitter {
  constructor() {
    super()
  }
  async connect(): Promise<boolean> {
    return false
  }
  protected buffer: KHEventPacket[] = []
  protected sn = 0
  protected onEventArrive(packet: KHEventPacket): void {
    if ((packet as KHEventPacket).sn === this.sn + 1) {
      this.sn += 1
      this.emit('message', packet)
      this.buffer.sort((a, b) => a.sn - b.sn)
      while (this.buffer.length > 0 && this.buffer[0].sn < this.sn + 1) {
        this.buffer.shift()
      }
      while (this.buffer.length > 0 && this.buffer[0].sn === this.sn + 1) {
        const packet = this.buffer.shift()
        this.emit('message', packet)
        while (this.buffer.length > 0 && this.buffer[0].sn < this.sn + 1) {
          this.buffer.shift()
        }
      }
    } else if ((packet as KHEventPacket).sn > this.sn + 1) {
      this.buffer.push(packet as KHEventPacket)
    }
  }
}
