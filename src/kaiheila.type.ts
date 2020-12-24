/* eslint-disable camelcase */
export enum KaiheilaCMD {
  msg= 0,
  handshake= 1,
  ping= 2,
  pong= 3,
  resume= 4,
  reconnect= 5,
  resumeack= 6
}

interface WebhookChallenge {
  verify_token: string
  type: 255
  channel_type: 'WEBHOOK_CHALLENGE'
  challenge: string
  msg_id:undefined
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
  [key:string]:any
}

export interface KHAuthor {
  identify_num: string
  avatar: string
  bot?: true
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

export interface KHAttachment{
  type: string
  name: string
  url: string
}

export interface KHSystemMessage extends KHEventBase {
  type: 255
  author_id: '1'
  extra: {
    type: string,
    body: any
  },
  nonce:any
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

export interface KHImageAttachment extends KHAttachment{
  type:'image'
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

export interface KHVideoAttachment extends KHAttachment{
  type:'video'
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

export interface KHFileAttachment extends KHAttachment{
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
export interface KHAudioAttachment{
  type:'audio'
  voice: string
  mime_type: string
  duration: number
}
/**
 * 音频消息
 */
export interface KHAudioMessage extends KHEventBase{
  type: 8
  extra: {
    type: 8
    author: KHAuthor,
    attachments: KHAudioAttachment
  }
}

export interface KHKMarkDownMessage extends KHEventBase{
  type: 9
  extra: {
    type:9,
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
        id:number
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

export type KaiheilaEvent =
  | KHSystemMessage
  | KHTextMessage
  | KHImageMessage
  | KHVideoMessage
  | KHFileMessage
  | KHAudioMessage
  | KHKMarkDownMessage

export interface KaiheilaEncryptRequest{
  encrypt:string
}
export interface KaiheilaEventRequest {
  s: KaiheilaCMD.msg
  d: KaiheilaEvent | WebhookChallenge
  sn: number
}
export type KaiheilaWebhookRequest = KaiheilaEncryptRequest | KaiheilaEventRequest
