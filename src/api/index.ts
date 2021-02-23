import { KaiheilaBot } from '..'
import { ChannelRoleAPI } from './channelRole'
import { GuildAPI } from './guild'
import { GuildMuteAPI } from './guildMute'

export class API {
  guild: GuildAPI
  guildMute: GuildMuteAPI
  channelRole: ChannelRoleAPI
  constructor(self: KaiheilaBot) {
    this.guild = new GuildAPI(self)
    this.guildMute = new GuildMuteAPI(self)
    this.channelRole = new ChannelRoleAPI(self)
  }
}
