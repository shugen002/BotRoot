import { KHFileAttachment } from '../../types/kaiheila/kaiheila.type'
import { AttachmentBase } from './AttachmentBase'

export class FileAttachment extends AttachmentBase {
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
