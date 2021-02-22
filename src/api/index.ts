import { KaiheilaBot } from '..'
import { GuildAPI } from './guild'

export class API {
  public guild: GuildAPI
  constructor (self:KaiheilaBot) {
    this.guild = new GuildAPI(self)
  }
}
