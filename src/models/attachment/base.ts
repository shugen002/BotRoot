import { KHAttachment } from '../../types/kaiheila/kaiheila.type'
/**
 * 附件
 *
 * 请注意类型为Audio的的url是空的！
 */
export class Attachment {
  name: string
  type: string
  url?: string

  constructor(attachment: KHAttachment) {
    this.name = attachment.name
    this.type = attachment.type
    this.url = attachment.url
  }
}
