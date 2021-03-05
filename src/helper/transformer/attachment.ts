import { AttachmentBase } from '../../types/attachment/base'
import { AudioAttachment } from '../../types/attachment/audio'
import { FileAttachment } from '../../types/attachment/file'
import { ImageAttachment } from '../../types/attachment/image'
import { VideoAttachment } from '../../types/attachment/video'
import {
  KHAttachment,
  KHImageAttachment,
  KHVideoAttachment,
  KHFileAttachment,
  KHAudioAttachment,
} from '../../types/kaiheila/attachment'

export function transformAttachmentBase(
  attachment: KHAttachment
): AttachmentBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: any = {}
  base.name = attachment.name
  base.type = attachment.type
  base.url = attachment.url
  return base
}

export function transformImageAttachment(
  attachment: KHImageAttachment
): ImageAttachment {
  const base = (transformAttachmentBase(
    attachment
  ) as unknown) as ImageAttachment
  return base as ImageAttachment
}

export function transformVideoAttachment(
  attachment: KHVideoAttachment
): VideoAttachment {
  const base = (transformAttachmentBase(
    attachment
  ) as unknown) as VideoAttachment
  base.size = attachment.size
  base.fileType = attachment.file_type
  base.height = attachment.height
  base.width = attachment.width
  base.duration = attachment.duration
  return base
}

export function transfromFileAttachment(
  attachment: KHFileAttachment
): FileAttachment {
  const base = (transformAttachmentBase(
    attachment
  ) as unknown) as FileAttachment
  base.fileType = attachment.file_type
  base.size = attachment.size
  return base
}

export function transformAudioAttachment(
  attachment: KHAudioAttachment
): AudioAttachment {
  const base = (transformAttachmentBase({
    type: 'audio',
    name: 'audio',
    url: attachment.voice,
  }) as unknown) as AudioAttachment
  base.voice = attachment.voice
  base.mimeType = attachment.mime_type
  base.duration = attachment.duration
  return base
}
