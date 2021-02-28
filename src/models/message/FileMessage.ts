import { KHFileMessage } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/MessageType'
import { FileAttachment } from '../Attachment'
import { User } from '../User'
import { MessageBase } from './MessageBase'

export class FileMessage extends MessageBase {
  type = MessageType.file
  attachment: FileAttachment
  author: User

  constructor(message: KHFileMessage) {
    super(message)
    this.author = new User(message.extra.author)
    this.attachment = new FileAttachment(message.extra.attachments)
  }
}
