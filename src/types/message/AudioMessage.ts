import { AudioAttachment } from '../attachment/AudioAttachment'
import { User } from '../common'
import { MessageType } from '../MessageType'
import { MessageBase } from './MessageBase'

export interface AudioMessage extends MessageBase {
  type: MessageType.voice
  attachment: AudioAttachment
  author: User
}
