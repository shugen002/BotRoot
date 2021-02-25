import { KHVideoMessage } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/message'
import { VideoAttachment } from '../attachment/VideoAttachment'
import { User } from '../User'
import { MessageBase } from './MessageBase'

export class VideoMessage extends MessageBase {
  type = MessageType.video
  attachment: VideoAttachment
  author: User

  constructor(message: KHVideoMessage) {
    super(message)
    this.author = new User(message.extra.author)
    this.attachment = new VideoAttachment(message.extra.attachments)
  }
}
