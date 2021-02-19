import { EventEmitter } from 'events'
import { KaiheilaBot } from '.'
import { KHAuthor, KHTextMessage, KHEventBase, KHImageMessage, KHAttachment, KHVideoAttachment, KHVideoMessage, KHFileAttachment, KHFileMessage, KHAudioAttachment, KHKMarkDownMessage, KHAudioMessage } from './types/kaiheila/kaiheila.type'
import { KHPacket } from './types/kaiheila/packet'
function defaultUser () {
  return {
    username: '',
    identifyNum: '0',
    avatar: 'https://img.kaiheila.cn/assets/avatar_1.jpg/icon',
    id: '',
    nickname: '',
    roles: [],
    bot: false,
    online: true
  }
}

export enum MessageType {
  text = 1,
  image = 2,
  video = 3,
  file = 4,
  voice = 8,
  kmarkdown = 9,
}
export class User {
  /**
   * 用户名 # 后的 4 位识别 id
   */
  identifyNum: string;
  /**
   * 头像图片地址
   */
  avatar: string;
  /**
   * 是否为机器人
   */
  bot: boolean;
  /**
   * 用户名
   */
  username: string;
  /**
   * 用户id
   */
  id: string;
  /**
   * 用户在服务器的昵称
   */
  nickname: string;
  /**
   * 用户在当前服务器中的角色 id 组成的列表
   */
  roles: number[];
  /**
   * 是否在线
   */
  online: boolean;
  constructor (rawAuthor:KHAuthor|User = defaultUser()) {
    const author = defaultUser()
    Object.assign(author, rawAuthor)
    // @ts-ignore
    this.identifyNum = typeof author.identify_num === 'string' ? author.identify_num : author.identifyNum
    this.avatar = author.avatar
    this.bot = !!author.bot
    this.username = author.username
    this.id = author.id
    this.nickname = author.nickname
    this.roles = Array.isArray(author.roles) ? author.roles : []
    this.online = !!author.online
  }
}

export class MessageBase {
  /**
   * 消息类型
   */
  type:MessageType;
  msgId:string;
  msgTimestamp:number;
  channelId: string;
  guildId:string='';
  channelType: string;
  authorId: string;
  constructor (message:KHEventBase, reply = false) {
    this.type = message.type
    this.channelType = message.channel_type
    this.channelId = message.target_id
    if (reply) {
      this.authorId = message.author.id
      this.guildId = message.guild_id
      this.msgId = message.id
      this.msgTimestamp = message.create_at
    } else {
      this.authorId = message.author_id
      this.msgId = message.msg_id
      this.guildId = message.extra.guild_id
      this.msgTimestamp = message.msg_timestamp
    }
  }
}

export class Attachment {
  name: string
  type: string
  url: string
  constructor (attachment:KHAttachment) {
    this.name = attachment.name
    this.type = attachment.type
    this.url = attachment.url
  }
}

export class TextMessage extends MessageBase {
  type= MessageType.text
  author: User;
  quote?: TextMessage;
  channelName?: string;
  code: string='';
  content: string;
  mention:{
    user: string[],
    roles: string[],
    all: boolean,
    here: boolean
  };

  constructor (message:KHTextMessage, reply = false) {
    super(message, reply)
    this.content = message.content
    if (reply) {
      this.channelName = ''
      this.author = new User(message.author)
      this.code = message.code
      this.mention = {
        user: message.mention,
        roles: message.mention_roles,
        all: message.mention_all,
        here: message.mention_here
      }
    } else {
      this.channelName = message.extra.channel_name
      this.code = message.extra.code
      this.author = new User(message.extra.author)
      this.mention = {
        user: message.extra.mention,
        roles: message.extra.mention_roles,
        all: message.extra.mention_all,
        here: message.extra.mention_here
      }
    }

    if (!reply && message.extra.quote) {
      this.quote = new TextMessage(message.extra.quote, true)
      // patch for non exist properties in reply
      this.quote.channelName = this.channelName
      this.quote.channelType = this.channelType
      this.quote.channelId = this.channelId
    }
  }
}

export class ImageAttachment extends Attachment {
  type= 'image'
}

export class ImageMessage extends MessageBase {
  type=MessageType.image
  code: string='';
  content: string;
  author: User;
  attachment: ImageAttachment;
  constructor (message:KHImageMessage) {
    super(message)
    this.content = message.content
    this.code = message.extra.code
    this.author = new User(message.extra.author)
    this.attachment = new ImageAttachment(message.extra.attachments)
  }
}

export class VideoAttachment extends Attachment {
  type= 'video'
  size: number;
  fileType: string;
  height: number;
  width: number;
  duration: number;
  constructor (attachment:KHVideoAttachment) {
    super(attachment)
    this.size = attachment.size
    this.fileType = attachment.file_type
    this.height = attachment.height
    this.width = attachment.width
    this.duration = attachment.duration
  }
}

export class VideoMessage extends MessageBase {
  type=MessageType.video
  attachment: VideoAttachment;
  author: User;
  constructor (message:KHVideoMessage) {
    super(message)
    this.author = new User(message.extra.author)
    this.attachment = new VideoAttachment(message.extra.attachments)
  }
}

export class FileAttachment extends Attachment {
  type= 'file'
  fileType: string;
  size: number;
  constructor (attchement:KHFileAttachment) {
    super(attchement)
    this.fileType = attchement.file_type
    this.size = attchement.size
  }
}

export class FileMessage extends MessageBase {
  type=MessageType.file
  attachment: FileAttachment;
  author: User;
  constructor (message:KHFileMessage) {
    super(message)
    this.author = new User(message.extra.author)
    this.attachment = new FileAttachment(message.extra.attachments)
  }
}

/**
 * 音频附件
 *
 * 注意，这是唯一个不从Attachment类扩展出来的附件
 */
export class AudioAttachment {
  type ='audio'
  mimeType: string;
  voice: string;
  duration: number;
  name: string;
  constructor (attachment:KHAudioAttachment) {
    this.voice = attachment.voice
    this.mimeType = attachment.mime_type
    this.duration = attachment.duration
    this.name = 'audio'
  }

  get url () {
    return this.voice
  }
}

export class AudioMessage extends MessageBase {
  type=MessageType.voice
  attachment: AudioAttachment;
  author: User;
  constructor (message:KHAudioMessage) {
    super(message)
    this.author = new User(message.extra.author)
    this.attachment = new AudioAttachment(message.extra.attachments)
  }
}
export class KMarkDownMessage extends MessageBase {
  type=MessageType.kmarkdown
  author: User;
  mention: { user: string[]; roles: string[]; all: boolean; here: boolean; channels: string[]; };
  channelName: string;
  content: string;
  code: string;

  constructor (message:KHKMarkDownMessage) {
    super(message)
    this.content = message.content
    this.channelName = message.extra.channel_name
    this.code = message.extra.code
    this.author = new User(message.extra.author)
    this.mention = {
      user: message.extra.mention,
      roles: message.extra.mention_roles,
      all: message.extra.mention_all,
      here: message.extra.mention_here,
      channels: message.extra.nav_channels
    }
  }
}

export interface MessageSource extends EventEmitter{
  type:string
  on(event:'message', listener:(eventRequest:KHPacket)=>void):this;
  connect():Promise<boolean>;
}
