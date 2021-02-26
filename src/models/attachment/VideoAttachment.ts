import { KHVideoAttachment } from '../../types/kaiheila/kaiheila.type'
import { AttachmentBase } from './AttachmentBase'

export class VideoAttachment extends AttachmentBase {
  type = 'video'
  size: number
  fileType: string
  height: number
  width: number
  duration: number
  url!: string
  constructor(attachment: KHVideoAttachment) {
    super(attachment)
    this.size = attachment.size
    this.fileType = attachment.file_type
    this.height = attachment.height
    this.width = attachment.width
    this.duration = attachment.duration
  }
}
