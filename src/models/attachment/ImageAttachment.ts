import { Attachment } from './base'

export class ImageAttachment extends Attachment {
  url!: string
  type = 'image'
}
