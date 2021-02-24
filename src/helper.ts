import { UserInternal } from './types/internal'
import { KHUser } from './types/kaiheila/types'

export function transformUser(e: KHUser): UserInternal {
  const result: UserInternal = {
    id: e.id,
    username: e.username,
    identifyNum: e.identify_num,
    online: e.online,
    avatar: e.avatar,
    bot: e.bot || false,
    nickname: e.nickname,
    roles: e.roles,
  }
  if (e.is_master) result.isMaster = e.is_master
  if (e.joined_at) result.joinedAt = e.joined_at
  if (e.active_time) result.activeTime = e.active_time
  if (e.mobile_verified) result.mobileVerified = e.mobile_verified
  if (e.color) result.color = e.color
  if (e.hoist_info) {
    result.hoistInfo = {
      color: e.hoist_info.color,
      name: e.hoist_info.name,
      roleId: e.hoist_info.role_id,
    }
  }
  if (e.game) {
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
