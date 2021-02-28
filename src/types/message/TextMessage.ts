import { User } from '../common'
import { MessageType } from '../MessageType'
import { MessageBase } from './MessageBase'

export interface TextMessage extends MessageBase {
  type: MessageType.text
  author: User
  quote?: TextMessage
  channelName?: string
  code: string
  content: string
  mention: {
    user: string[]
    roles: string[]
    all: boolean
    here: boolean
  }
}
