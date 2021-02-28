import { cloneDeep } from 'lodash'
import { KHMessage } from '../../../types/kaiheila/kaiheila.type'
import { transformTextMessage } from './TextMessage'

export interface TransformResult {
  type: string
  data: any
}

export function transformMessage(message: KHMessage): TransformResult {
  switch (message.type) {
    case 255:
      return { type: 'systemMessage', data: cloneDeep(message) }
      break
    case 1:
      return { type: 'textMessage', data: transformTextMessage(message) }
      break
    case 2:
      return { type: 'imageMessage', data: cloneDeep(message) }
      break
    case 3:
      return { type: 'videoMessage', data: cloneDeep(message) }
      break
    case 4:
      return { type: 'fileMessage', data: cloneDeep(message) }
      break
    case 8:
      return { type: 'audioMessage', data: cloneDeep(message) }
      break
    case 9:
      return { type: 'kmarkdownMessage', data: cloneDeep(message) }
      break
    case 10:
      return { type: 'cardMessage', data: cloneDeep(message) }
      break
    default:
      return { type: 'unknownEvent', data: cloneDeep(message) }
      break
  }
}
