import { defaultUser } from '../../helper/defaultUser'
import { KHAuthor } from '../../types/kaiheila/kaiheila.type'

export class User {
  /**
   * 用户名 # 后的 4 位识别 id
   */
  identifyNum: string
  /**
   * 头像图片地址
   */
  avatar: string
  /**
   * 是否为机器人
   */
  bot: boolean
  /**
   * 用户名
   */
  username: string
  /**
   * 用户id
   */
  id: string
  /**
   * 用户在服务器的昵称
   */
  nickname: string
  /**
   * 用户在当前服务器中的角色 id 组成的列表
   */
  roles: number[]
  /**
   * 是否在线
   */
  online: boolean

  constructor(rawAuthor: KHAuthor = defaultUser()) {
    const author = defaultUser()
    Object.assign(author, rawAuthor)
    this.identifyNum = author.identify_num
    this.avatar = author.avatar
    this.bot = author.bot
    this.username = author.username
    this.id = author.id
    this.nickname = author.nickname
    this.roles = Array.isArray(author.roles) ? author.roles : []
    this.online = author.online
  }
}
