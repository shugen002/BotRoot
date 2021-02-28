import { AttachmentBase } from './AttachmentBase'

export interface FileAttachment extends AttachmentBase {
  type: 'file'
  fileType: string
  size: number
  url: string
}
