import { KHAudioMessage } from '../../types/kaiheila/kaiheila.type'
import { MessageType } from '../../types/message'
import { AudioAttachment } from '../attachment/AudioAttachment'
import { User } from '../User'
import { MessageBase } from './MessageBase'

export class AudioMessage extends MessageBase {
  type = MessageType.voice
  attachment: AudioAttachment
  author: User

  constructor(message: KHAudioMessage) {
    super(message)
    this.author = new User(message.extra.author)
    this.attachment = new AudioAttachment(message.extra.attachments)
  }
}
