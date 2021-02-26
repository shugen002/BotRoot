import { AttachmentBase } from './AttachmentBase'

export class ImageAttachment extends AttachmentBase {
  url!: string
  type = 'image'
}
