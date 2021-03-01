import { User, UserInGuild, UserInGuildNonStandard } from '../../types/common'
import {
  KHUser,
  KHUserInGuild as KHUserInGuild,
} from '../../types/kaiheila/common'

export function transformUser(e: KHUser): User {
  const result: User = {
    id: e.id,
    username: e.username,
    identifyNum: e.identify_num,
    online: e.online,
    avatar: e.avatar,
    bot: e.bot || false,
  }
  return result
}
export function transformUserInGuild(e: KHUserInGuild): UserInGuild {
  const result = (transformUser(e) as unknown) as UserInGuild
  result.nickname = e.nickname
  result.roles = e.roles
  return result
}

export function transformUserInGuildNonStandard(
  e: KHUserInGuild
): UserInGuildNonStandard {
  const result = transformUserInGuild(e) as UserInGuildNonStandard
  if (typeof e.is_master !== 'undefined') result.isMaster = e.is_master
  if (typeof e.joined_at !== 'undefined') result.joinedAt = e.joined_at
  if (typeof e.active_time !== 'undefined') result.activeTime = e.active_time
  if (typeof e.mobile_verified !== 'undefined')
    result.mobileVerified = e.mobile_verified
  if (typeof e.color !== 'undefined') result.color = e.color
  return result
}
