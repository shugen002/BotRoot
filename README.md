# BotRoot
开黑啦机器人JavaScript SDK

## 安装 install

```
npm i kaiheila-bot-root
```

## 用法 usage

```js
var Bot = require('kaiheila-bot-root').KaiheilaBot
var bot = new Bot({
  mode: "webhook",
  port: 8600,
  key: "YOUR ENCRYPT KEY",
  token: "YOUR TOKEN",
  verifyToken: "YOUR VERIFY TOKEN"
})

bot.on('rawEvent', (e) => {
  console.log(e)
  if (typeof e.msg_id === 'string') {
    writeFile(`cache/${e.msg_id}.json`, JSON.stringify(e, undefined, 2), (e) => {
      if (e) {
        console.error(e)
      }
    })
  }
})

bot.on('message', (e) => {
  console.log(e)
})

bot.listen()
```