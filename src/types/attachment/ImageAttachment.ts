import { AttachmentBase } from './AttachmentBase'

export interface ImageAttachment extends AttachmentBase {
  url: string
  type: 'image'
}
