import { EventEmitter } from 'events'
import { KHPacket } from '../kaiheila/packet'

export interface MessageSource extends EventEmitter {
  type: string

  on(event: 'message', listener: (eventRequest: KHPacket) => void): this

  connect(): Promise<boolean>
}
