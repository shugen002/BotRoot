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
  verify_token: string;
  type: 255;
  channel_type: 'WEBHOOK_CHALLENGE';
  challenge: string;
  msg_id:undefined
}

export interface KaiheilaBase {
  s: KaiheilaCMD;
  d: WebhookChallenge;
}

interface KaiheilaEventBase {
  channel_type: 'GROUP';
  type: number;
  target_id: string;
  author_id: string;
  content: string;
  msg_id: string;
  msg_timestamp: number;
  nonce: string;
  verify_token?: string
  extra: any;
}

export interface Author {
  identify_num: string;
  avatar: string;
  bot?: true;
  username: string;
  id: string;
  nickname: string;
  roles: number[];
  online: boolean;
}

export interface Attachment{
  name: string
  type: string
  url: string
}

export interface WebhookChallengeRequest extends KaiheilaBase {
  s: KaiheilaCMD.msg;
  d: WebhookChallenge;
}

export interface SystemMessage extends KaiheilaEventBase {
  type: 255;
  author_id: '1';
  extra: {
    type: string,
    body: any
  },
  nonce:any;
}

export interface TextMessage extends KaiheilaEventBase {
  type: 1;
  extra: {
    type: 1;
    guild_id: string;
    channel_name: string;
    mention: string[];
    mention_all: boolean;
    mention_roles: string[];
    mention_here: boolean;
    code: string;
    author: Author;
    quote?: TextMessage;
  };
}

export interface ImageAttachment extends Attachment{
  type:'image'
}

/**
 * 图片消息
 */
export interface ImageMessage extends KaiheilaEventBase {
  type: 2;
  /**
   * 图片URL
   */
  content: string;
  extra: {
    type: 2;
    attachments: ImageAttachment;
    author: Author;
    code: string;
    guild_id: string;
  };
}

export interface VideoAttachment extends Attachment{
  type:'video';
  file_type: string;
  name: string;
  size: number;
  height: number;
  width: number;
  duration: number;
}

/**
 * 视频消息
 */
export interface VideoMessage extends KaiheilaEventBase {
  type: 3;
  extra: {
    type: 3;
    guild_id: string;
    code: string;
    attachments: VideoAttachment;
    author: Author;
  };
}

export interface FileAttachment extends Attachment{
  type: 'file';
  file_type: string;
  size: number;
}

/**
 * 文件消息
 */
export interface FileMessage extends KaiheilaEventBase {
  type: 4;
  extra: {
    type: 4;
    guild_id: string;
    code: string;
    attachments: FileAttachment;
    author: Author;
  };
}
/**
 * 音频消息
 * not support yet
 */
export interface AudioMessage extends KaiheilaEventBase{
  type: 8;
  extra: undefined
}

export type KaiheilaEvent =
  | SystemMessage
  | TextMessage
  | ImageMessage
  | VideoMessage
  | FileMessage
  | AudioMessage;

export interface KaiheilaEncryptRequest{
  encrypt:string
}
export interface KaiheilaEventRequest extends KaiheilaBase {
  s: KaiheilaCMD.msg;
  d: KaiheilaEvent | WebhookChallenge;
  sn: number;
}
export type KaiheilaWebhookRequest = KaiheilaEncryptRequest | KaiheilaEventRequest;
