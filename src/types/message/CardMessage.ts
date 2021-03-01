import { User } from '../common'
import { MessageType } from '../MessageType'
import { MessageBase } from './MessageBase'

export interface CardMessage extends MessageBase {
  type: MessageType.card
  author: User
  mention: {
    user: string[]
    roles: string[]
    all: boolean
    here: boolean
    channels: string[]
  }
  channelName: string
  content: string
  code: string
}
