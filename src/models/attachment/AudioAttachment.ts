import { KHAudioAttachment } from '../../types/kaiheila/kaiheila.type'
import { AttachmentBase } from './AttachmentBase'

export class AudioAttachment extends AttachmentBase {
  type = 'audio'
  mimeType: string
  voice: string
  duration: number

  constructor(attachment: KHAudioAttachment) {
    super({
      type: 'audio',
      name: 'audio',
      url: '',
    })
    this.voice = attachment.voice
    this.mimeType = attachment.mime_type
    this.duration = attachment.duration
  }
}
