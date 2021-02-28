# BotRoot

开黑啦机器人 JavaScript SDK

## 安装 install

```
npm i kaiheila-bot-root
```

## 用法 usage

### Webhook 独立模式

在开黑啦机器人概况中选择连接模式为 webhook 并设置为

```
http://你的公网IP或域名:8600/?compress=0
```

代码：

```js
var Bot = require('kaiheila-bot-root').KaiheilaBot
var bot = new Bot({
  mode: 'webhook',
  port: 8600,
  key: 'YOUR ENCRYPT KEY', // 和设置的一致，如果这个值为空视为不加密
  token: 'YOUR TOKEN',
  verifyToken: 'YOUR VERIFY TOKEN',
})

/**
 * 输出保存原始数据
 */
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
/**
 * 监听文本信息
 */
bot.on('textMessage', (e) => {
  console.log(e)
})

bot.listen()
```

### Webhook 合并模式

做了，懒得写了

### websocket 模式

```js
var Bot = require('kaiheila-bot-root').KaiheilaBot
var bot = new Bot({
  mode: 'websocket',
  token: 'YOUR TOKEN',
})

/**
 * 输出保存原始数据
 */
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
/**
 * 监听文本信息
 */
bot.on('textMessage', (e) => {
  console.log(e)
})

bot.listen()
```
