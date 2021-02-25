import { KHFileAttachment } from '../../types/kaiheila/kaiheila.type'
import { Attachment } from './base'

export class FileAttachment extends Attachment {
  type = 'file'
  fileType: string
  size: number
  url!: string
  constructor(attchement: KHFileAttachment) {
    super(attchement)
    this.fileType = attchement.file_type
    this.size = attchement.size
  }
}
