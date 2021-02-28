import { User } from '../../types/common'
import { KHUser } from '../../types/kaiheila/types'

export function transformUser(e: KHUser): User {
  const result: User = {
    id: e.id,
    username: e.username,
    identifyNum: e.identify_num,
    online: e.online,
    avatar: e.avatar,
    bot: e.bot || false,
    nickname: e.nickname,
  }
  if (typeof e.online !== 'undefined') result.online = e.online
  if (typeof e.roles !== 'undefined') result.roles = e.roles
  if (typeof e.is_master !== 'undefined') result.isMaster = e.is_master
  if (typeof e.joined_at !== 'undefined') result.joinedAt = e.joined_at
  if (typeof e.active_time !== 'undefined') result.activeTime = e.active_time
  if (typeof e.mobile_verified !== 'undefined')
    result.mobileVerified = e.mobile_verified
  if (typeof e.color !== 'undefined') result.color = e.color
  if (typeof e.hoist_info !== 'undefined') {
    result.hoistInfo = {
      color: e.hoist_info.color,
      name: e.hoist_info.name,
      roleId: e.hoist_info.role_id,
    }
  }
  if (typeof e.game !== 'undefined') {
    result.game = {
      icon: e.game.icon,
      id: e.game.id,
      name: e.game.name,
      startTime: e.game.start_time,
      type: e.game.type,
    }
  }
  return result
}
