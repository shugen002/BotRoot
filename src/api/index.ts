import { BotInstance } from '../BotInstance'
import { AssetAPI } from './asset/asset.api'
import { ChannelAPI } from './channel'
import { ChannelRoleAPI } from './channelRole'
import { DirectMessageAPI } from './directMessage'
import { GatewayAPI } from './gateway'
import { GuildAPI } from './guild'
import { GuildMuteAPI } from './guildMute'
import { GuildRoleAPI } from './guildRole/guildRole.api'
import { IntimacyAPI } from './intimacy/intimacy.api'
import { MessageAPI } from './message'
import { UserAPI } from './user'
import { UserChatAPI } from './userChat'

export class API {
  guild: GuildAPI
  guildMute: GuildMuteAPI
  channel: ChannelAPI
  channelRole: ChannelRoleAPI
  gateway: GatewayAPI
  user: UserAPI
  userChat: UserChatAPI
  message: MessageAPI
  asset: AssetAPI
  guildRole: GuildRoleAPI
  intimacy: IntimacyAPI
  directMessage: DirectMessageAPI
  constructor(self: BotInstance) {
    this.guild = new GuildAPI(self)
    this.guildMute = new GuildMuteAPI(self)
    this.channelRole = new ChannelRoleAPI(self)
    this.gateway = new GatewayAPI(self)
    this.user = new UserAPI(self)
    this.userChat = new UserChatAPI(self)
    this.message = new MessageAPI(self)
    this.asset = new AssetAPI(self)
    this.guildRole = new GuildRoleAPI(self)
    this.intimacy = new IntimacyAPI(self)
    this.directMessage = new DirectMessageAPI(self)
    this.channel = new ChannelAPI(self)
  }
}
