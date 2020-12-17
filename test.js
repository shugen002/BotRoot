const SDK = require('./dist').default
const bot = new SDK({
  key: process.env.key
})
