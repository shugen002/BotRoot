import { KHPacket } from './packet'

/* eslint-disable camelcase */
interface KHWebhookChallenge {
  verify_token: string
  type: 255
  channel_type: 'WEBHOOK_CHALLENGE'
  challenge: string
  msg_id: undefined
}

export interface KHEventBase {
  channel_type: 'GROUP'
  type: number
  target_id: string
  author_id: string
  content: string
  msg_id: string
  msg_timestamp: number
  nonce: string
  verify_token?: string
  extra: any

  [key: string]: any
}

export interface KHAuthor {
  identify_num: string
  avatar: string
  bot?: boolean
  username: string
  id: string
  nickname: string
  roles: number[]
  online?: boolean
  tag_info?: {
    color: string
    text: string
  }
}

export interface KHAttachment {
  type: string
  name: string
  url: string
}

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

export interface KHImageAttachment extends KHAttachment {
  type: 'image'
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

export interface KHVideoAttachment extends KHAttachment {
  type: 'video'
  url: string
  file_type: string
  name: string
  size: number
  height: number
  width: number
  duration: number
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

export interface KHFileAttachment extends KHAttachment {
  type: 'file'
  file_type: string
  size: number
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

export interface KHAudioAttachment {
  type: 'audio'
  voice: string
  mime_type: string
  duration: number
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

export type KHMessage =
  | KHSystemMessage
  | KHTextMessage
  | KHImageMessage
  | KHVideoMessage
  | KHFileMessage
  | KHAudioMessage
  | KHKMarkDownMessage

export interface KaiheilaEncryptPacket {
  encrypt: string
}

export type KaiheilaWebhookRequest = KaiheilaEncryptPacket | KHPacket

export interface KHemoji {}

export interface KHChannel {}

export interface KHGuild {
  /**
   * 默认频道
   */
  default_channel_id: string
  /**
   * 是否为公开服务器
   */
  enable_open: number
  /**
   * 服务器icon的地址
   */
  icon: string
  /**
   * 服务器id
   */
  id: string
  /**
   * 是否开启邀请
   */
  invite_enabled: number
  /**
   * 当前用户是否为服务器主人
   */
  is_master: boolean
  /**
   * 服务器名称
   */
  name: string
  /**
   * 通知类型, `0`代表默认使用服务器通知设置，`1`代表接收所有通知, `2`代表仅@被提及，`3`代表不接收通知
   */
  notify_type: number
  /**
   * 公开服务器id
   * 文档写string，实际为number
   */
  open_id: string
  /**
   * 服务器主题
   */
  topic: string
  /**
   * 欢迎频道
   */
  welcome_channel_id: string
  /**
   * 服务器主的id
   */
  master_id: string
  /**
   * 服务器默认使用语音区域
   */
  region: string
}
