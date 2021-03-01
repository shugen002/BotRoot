import { ImageAttachment } from '../attachment/ImageAttachment'
import { UserInGuildNonStandard } from '../common'
import { MessageType } from '../MessageType'
import { MessageBase } from './MessageBase'

export interface ImageMessage extends MessageBase {
  type: MessageType.image
  code: string
  content: string
  author: UserInGuildNonStandard
  attachment: ImageAttachment
}
