/* eslint-disable @typescript-eslint/no-var-requires */
const Bot = require('./dist').KaiheilaBot
const { writeFile } = require('fs')
const bot = new Bot({
  port: 8600,
  mode: 'websocket',
  key: process.env.key,
  token: process.env.token,
  verifyToken: process.env.verifyToken,
})

bot.connect()
bot.messageSource.on('message', (e) => {
  console.log(e)
  if (typeof e.msg_id === 'string') {
    writeFile(
      `cache/${e.msg_id}.json`,
      JSON.stringify(e, undefined, 2),
      (e) => {
        if (e) {
          console.error(e)
        }
      }
    )
  }
})
bot.on('textMessage', (e) => {
  console.log(e)
})

bot.on('buttonClick', (e) => {
  console.log(e)
})

global.botInstance = bot
