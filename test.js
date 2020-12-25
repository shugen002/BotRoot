const Bot = require('./dist').KaiheilaBot
const { writeFile } = require('fs')
const bot = new Bot({
  port: 8601,
  key: process.env.key,
  token: process.env.token
})

bot.listen()
bot.on('rawEvent', (e) => {
  if (typeof e.msg_id === 'string') {
    writeFile(`cache/${e.msg_id}.json`, JSON.stringify(e, undefined, 2), (e) => {
      if (e) {
        console.error(e)
      }
    })
  }
})
global.botInstance = bot
