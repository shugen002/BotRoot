import { cloneDeep } from 'lodash'
import { ButtonClickEvent } from '../../types/event/ButtonClickEvent'
import { EventBase } from '../../types/event/EventBase'
import { KHButtonClickEvent } from '../../types/kaiheila/event'
import { KHSystemMessage } from '../../types/kaiheila/message'
import { transformUser } from './User'

export function transformEvent(message: KHSystemMessage): EventBase {
  switch (message.extra.type) {
    case 'message_btn_click':
      return transformButtonClickEvent(
        (message as unknown) as KHSystemMessage<KHButtonClickEvent>
      )
      break
    default:
      return {
        msgId: message.msg_id,
        msgTimestamp: message.msg_timestamp,
        type: message.extra.type,
        body: cloneDeep(message.extra.body),
      }
      break
  }
}

export function transformButtonClickEvent(
  message: KHSystemMessage<KHButtonClickEvent>
): ButtonClickEvent {
  return {
    msgId: message.msg_id,
    msgTimestamp: message.msg_timestamp,
    type: 'buttonClick',
    channelType: message.extra.body.channel_type,
    guildId: message.extra.body.guild_id,
    channelId: message.extra.body.target_id,
    targetMsgId: message.extra.body.msg_id,
    value: message.extra.body.value,
    user: transformUser(message.extra.body.user_info),
    userId: message.extra.body.user_id,
  }
}
