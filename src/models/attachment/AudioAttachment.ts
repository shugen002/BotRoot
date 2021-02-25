import { KHAudioAttachment } from '../../types/kaiheila/kaiheila.type'
import { Attachment } from './base'

export class AudioAttachment extends Attachment {
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
