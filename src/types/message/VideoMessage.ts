import { VideoAttachment } from '../attachment/VideoAttachment'
import { UserInGuildNonStandard } from '../common'
import { MessageType } from '../MessageType'
import { MessageBase } from './MessageBase'

export interface VideoMessage extends MessageBase {
  type: MessageType.video
  attachment: VideoAttachment
  author: UserInGuildNonStandard
}
