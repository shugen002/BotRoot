import { KaiheilaBot } from '..'
import { ChannelRoleAPI } from './channelRole'
import { GatewayAPI } from './gateway'
import { GuildAPI } from './guild'
import { GuildMuteAPI } from './guildMute'

export class API {
  guild: GuildAPI
  guildMute: GuildMuteAPI
  channelRole: ChannelRoleAPI
  gateway: GatewayAPI
  constructor(self: KaiheilaBot) {
    this.guild = new GuildAPI(self)
    this.guildMute = new GuildMuteAPI(self)
    this.channelRole = new ChannelRoleAPI(self)
    this.gateway = new GatewayAPI(self)
  }
}
