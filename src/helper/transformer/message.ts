import { cloneDeep } from 'lodash'

import {
  KHMessage,
  KHTextMessage,
  KHImageMessage,
  KHVideoMessage,
  KHFileMessage,
  KHAudioMessage,
  KHKMarkDownMessage,
  KHCardMessage,
  KHSystemMessage,
} from '../../types/kaiheila/message'
import { KHMessageEventBase } from '../../types/kaiheila/packet'
import { AudioMessage } from '../../types/message/AudioMessage'
import { CardMessage } from '../../types/message/CardMessage'
import { FileMessage } from '../../types/message/FileMessage'
import { ImageMessage } from '../../types/message/ImageMessage'
import { KMarkdownMessage } from '../../types/message/KMarkDownMessage'
import { MessageBase } from '../../types/message/MessageBase'
import { TextMessage } from '../../types/message/TextMessage'
import { VideoMessage } from '../../types/message/VideoMessage'
import {
  transformAudioAttachment,
  transformImageAttachment,
  transformVideoAttachment,
  transfromFileAttachment,
} from './attachment'
import { transformEvent } from './event'
import { transformUserInGuildNonStandard } from './User'

export interface TransformResult {
  type: string
  data: any
}

export function transformMessage(message: KHMessage): TransformResult {
  switch (message.type) {
    case 255:
      return { type: 'systemMessage', data: transformSystemMessage(message) }
      break
    case 1:
      return { type: 'textMessage', data: transformTextMessage(message) }
      break
    case 2:
      return { type: 'imageMessage', data: transformImageMessage(message) }
      break
    case 3:
      return { type: 'videoMessage', data: transformVideoMessage(message) }
      break
    case 4:
      return { type: 'fileMessage', data: transformFileMessage(message) }
      break
    case 8:
      return { type: 'audioMessage', data: transformAudioMessage(message) }
      break
    case 9:
      return {
        type: 'kmarkdownMessage',
        data: transformKMarkdownMessage(message),
      }
      break
    case 10:
      return { type: 'cardMessage', data: transformCardMessage(message) }
      break
    default:
      return { type: 'unknownEvent', data: cloneDeep(message) }
      break
  }
}

export function transformMessageBase(
  message: KHMessageEventBase,
  reply = false
): MessageBase {
  const base = {
    type: 1,
    msgId: '',
    msgTimestamp: 0,
    channelId: '',
    guildId: '',
    channelType: '',
    authorId: '',
  }
  base.type = message.type
  base.channelType = message.channel_type
  base.channelId = message.target_id
  if (reply) {
    base.authorId = message.author.id
    base.guildId = message.guild_id
    base.msgId = message.id
    base.msgTimestamp = message.create_at
  } else {
    base.authorId = message.author_id
    base.msgId = message.msg_id
    base.guildId = message.extra.guild_id
    base.msgTimestamp = message.msg_timestamp
  }
  return base
}

export function transformTextMessage(
  message: KHTextMessage,
  reply = false
): TextMessage {
  const base = (transformMessageBase(message, reply) as unknown) as TextMessage
  base.content = message.content
  if (reply) {
    base.channelName = ''
    base.author = transformUserInGuildNonStandard(message.author)
    base.code = message.code
    base.mention = {
      user: message.mention,
      roles: message.mention_roles,
      all: message.mention_all,
      here: message.mention_here,
    }
  } else {
    base.channelName = message.extra.channel_name
    base.code = message.extra.code
    base.author = transformUserInGuildNonStandard(message.extra.author)
    base.mention = {
      user: message.extra.mention,
      roles: message.extra.mention_roles,
      all: message.extra.mention_all,
      here: message.extra.mention_here,
    }
  }

  if (!reply && message.extra.quote) {
    base.quote = transformTextMessage(message.extra.quote, true)
    // patch for non exist properties in reply
    base.quote.channelName = base.channelName
    base.quote.channelType = base.channelType
    base.quote.channelId = base.channelId
  }
  return base
}

export function transformImageMessage(message: KHImageMessage): ImageMessage {
  const base = (transformMessageBase(message) as unknown) as ImageMessage
  base.content = message.content
  base.code = message.extra.code
  base.author = transformUserInGuildNonStandard(message.extra.author)
  base.attachment = transformImageAttachment(message.extra.attachments)
  return base
}

export function transformVideoMessage(message: KHVideoMessage): VideoMessage {
  const base = (transformMessageBase(message) as unknown) as VideoMessage
  base.author = transformUserInGuildNonStandard(message.extra.author)
  base.attachment = transformVideoAttachment(message.extra.attachments)
  return base
}

export function transformFileMessage(message: KHFileMessage): FileMessage {
  const base = (transformMessageBase(message) as unknown) as FileMessage
  base.author = transformUserInGuildNonStandard(message.extra.author)
  base.attachment = transfromFileAttachment(message.extra.attachments)
  return base
}

export function transformAudioMessage(message: KHAudioMessage): AudioMessage {
  const base = (transformMessageBase(message) as unknown) as AudioMessage
  base.author = transformUserInGuildNonStandard(message.extra.author)
  base.attachment = transformAudioAttachment(message.extra.attachments)
  return base
}

export function transformKMarkdownMessage(
  message: KHKMarkDownMessage
): KMarkdownMessage {
  const base = (transformMessageBase(message) as unknown) as KMarkdownMessage
  base.content = message.content
  base.channelName = message.extra.channel_name
  base.code = message.extra.code
  base.author = transformUserInGuildNonStandard(message.extra.author)
  base.mention = {
    user: message.extra.mention,
    roles: message.extra.mention_roles,
    all: message.extra.mention_all,
    here: message.extra.mention_here,
    channels: message.extra.nav_channels,
  }
  return base
}

export function transformCardMessage(message: KHCardMessage): CardMessage {
  const base = (transformMessageBase(message) as unknown) as CardMessage
  base.content = message.content
  base.channelName = message.extra.channel_name
  base.code = message.extra.code
  base.author = transformUserInGuildNonStandard(message.extra.author)
  base.mention = {
    user: message.extra.mention,
    roles: message.extra.mention_roles,
    all: message.extra.mention_all,
    here: message.extra.mention_here,
    channels: message.extra.nav_channels,
  }
  return base
}

export function transformSystemMessage(message: KHSystemMessage): any {
  return transformEvent(message)
}
