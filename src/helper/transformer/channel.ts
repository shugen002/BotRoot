import { Channel } from '../../types'
import { KHChannel } from '../../types/kaiheila/common'
import { transformUserInGuildNonStandard } from './user'

export function transformChannel(channel: KHChannel): Channel {
  return {
    id: channel.id,
    guildId: channel.guild_id,
    masterId: channel.master_id,
    parentId: channel.parent_id,
    name: channel.name,
    topic: channel.topic,
    isCategory: channel.is_category,
    level: channel.level,
    slowMode: channel.slow_mode,
    type: channel.type,
    permissionOverwrites: channel.permission_overwrites.map((e) => {
      return {
        roldId: e.role_id,
        allow: e.allow,
        deny: e.deny,
      }
    }),
    permissionUsers: channel.permission_users.map((e) => {
      return {
        user: transformUserInGuildNonStandard(e.user),
        allow: e.allow,
        deny: e.deny,
      }
    }),
    permissionSync: channel.permission_sync,
  }
}
