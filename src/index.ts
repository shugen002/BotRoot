import {
  TextMessage,
  ImageMessage,
  VideoMessage,
  FileMessage,
  AudioMessage,
  KMarkDownMessage,
} from './models/message'
import { KHMessage, KHSystemMessage } from './types/kaiheila/kaiheila.type'

export interface KaiheilaBot {
  /**
   * 获取原始事件，challenge已被剔除
   */
  on(event: 'rawEvent', listener: (event: KHMessage) => void): this

  /**
   * 系统事件，目前还没有，占坑，勿用
   */
  on(event: 'systemMessage', listener: (event: KHSystemMessage) => void): this

  /**
   * 注册监听所有处理过的事件
   */
  on(
    event: 'message',
    listener: (
      event:
        | TextMessage
        | ImageMessage
        | VideoMessage
        | FileMessage
        | AudioMessage
        | KMarkDownMessage
    ) => void
  ): this

  /**
   * 注册监听未知的事件
   */
  on(event: 'unknownEvent', listener: (event: KHMessage) => void): this
}
import { BotInstance } from './BotInstance'

export const KaiheilaBot = (BotInstance as unknown) as KaiheilaBot
