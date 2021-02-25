import { KHImageMessage } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/message'
import { ImageAttachment } from '../attachment/ImageAttachment'
import { User } from '../User'
import { MessageBase } from './MessageBase'

export class ImageMessage extends MessageBase {
  type = MessageType.image
  code = ''
  content: string
  author: User
  attachment: ImageAttachment

  constructor(message: KHImageMessage) {
    super(message)
    this.content = message.content
    this.code = message.extra.code
    this.author = new User(message.extra.author)
    this.attachment = new ImageAttachment(message.extra.attachments)
  }
}
