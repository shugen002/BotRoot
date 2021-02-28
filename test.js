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
bot.on('textMessage', (e) => {
  console.log(e)
})

global.botInstance = bot
