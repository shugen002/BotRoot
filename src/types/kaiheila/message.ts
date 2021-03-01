import {
  KHImageAttachment,
  KHVideoAttachment,
  KHFileAttachment,
  KHAudioAttachment,
} from './attachment'
import { KHAuthor } from './common'
import { KHEventBase } from './packet'

export interface KHSystemMessage extends KHEventBase {
  type: 255
  author_id: '1'
  extra: {
    type: string
    body: any
  }
  nonce: any
}

export interface KHTextMessage extends KHEventBase {
  type: 1
  extra: {
    type: 1
    guild_id: string
    channel_name: string
    mention: string[]
    mention_all: boolean
    mention_roles: string[]
    mention_here: boolean
    code: string
    author: KHAuthor
    quote?: KHTextMessage
  }
}

/**
 * 图片消息
 */
export interface KHImageMessage extends KHEventBase {
  type: 2
  /**
   * 图片URL
   */
  content: string
  extra: {
    type: 2
    attachments: KHImageAttachment
    author: KHAuthor
    code: string
    guild_id: string
  }
}

/**
 * 视频消息
 */
export interface KHVideoMessage extends KHEventBase {
  type: 3
  extra: {
    type: 3
    guild_id: string
    attachments: KHVideoAttachment
    author: KHAuthor
  }
}

/**
 * 文件消息
 */
export interface KHFileMessage extends KHEventBase {
  type: 4
  extra: {
    type: 4
    guild_id: string
    code: string
    attachments: KHFileAttachment
    author: KHAuthor
  }
}

/**
 * 音频消息
 */
export interface KHAudioMessage extends KHEventBase {
  type: 8
  extra: {
    type: 8
    author: KHAuthor
    attachments: KHAudioAttachment
  }
}

export interface KHKMarkDownMessage extends KHEventBase {
  type: 9
  extra: {
    type: 9
    guild_id: string
    channel_name: string
    mention: string[]
    mention_all: boolean
    mention_roles: string[]
    mention_here: boolean
    nav_channels: string[]
    code: string
    author: KHAuthor
    kmarkdown: {
      raw_content: string
      mention_part: {
        id: number
        username: string
        full_name: string
        avatar: string
      }[]
      mention_role_part: {
        role_id: number
        name: string
      }[]
    }
  }
}

export interface KHCardMessage extends KHEventBase {
  type: 10
  extra: {
    type: 10
    guild_id: string
    channel_name: string
    mention: string[]
    mention_all: boolean
    mention_roles: string[]
    mention_here: boolean
    nav_channels: string[]
    code: string
    author: KHAuthor
    kmarkdown: {
      raw_content: string
      mention_part: {
        id: number
        username: string
        full_name: string
        avatar: string
      }[]
      mention_role_part: {
        role_id: number
        name: string
      }[]
    }
  }
}

export type KHMessage =
  | KHSystemMessage
  | KHTextMessage
  | KHImageMessage
  | KHVideoMessage
  | KHFileMessage
  | KHAudioMessage
  | KHKMarkDownMessage
  | KHCardMessage
