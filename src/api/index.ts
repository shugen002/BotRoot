import { BotInstance } from '../BotInstance'
import { ChannelRoleAPI } from './channelRole'
import { GatewayAPI } from './gateway'
import { GuildAPI } from './guild'
import { GuildMuteAPI } from './guildMute'
import { UserAPI } from './user'
import { UserChatAPI } from './userChat'

export class API {
  guild: GuildAPI
  guildMute: GuildMuteAPI
  channelRole: ChannelRoleAPI
  gateway: GatewayAPI
  user: UserAPI
  userChat: UserChatAPI
  constructor(self: BotInstance) {
    this.guild = new GuildAPI(self)
    this.guildMute = new GuildMuteAPI(self)
    this.channelRole = new ChannelRoleAPI(self)
    this.gateway = new GatewayAPI(self)
    this.user = new UserAPI(self)
    this.userChat = new UserChatAPI(self)
  }
}
