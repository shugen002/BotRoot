import { AttachmentBase } from './AttachmentBase'

export interface AudioAttachment extends AttachmentBase {
  type: string
  mimeType: string
  voice: string
  duration: number
}
