import { FileAttachment } from '../attachment/FileAttachment'
import { User } from '../common'
import { MessageType } from '../MessageType'
import { MessageBase } from './MessageBase'

export interface FileMessage extends MessageBase {
  type: MessageType.file
  attachment: FileAttachment
  author: User
}
