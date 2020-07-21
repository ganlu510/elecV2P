const http = require('http')
const express = require('express')
const compression = require('compression')

const { CONFIG_Port } = require('./config')
const { websocketSer } = require('./func/websocket')

const { logger } = require('./utils/logger')
const clog = new logger({ head: 'webServer' })

const { wbconfig, wbfeed, wbcrt, wbjs, wbtask, wblogs, wbstore, wbdata, wblist, wbhook } = require('./webser')

module.exports = () => {
  const app = express()
  app.use(compression())
  app.use(express.json())

  const ONEMONTH = 60 * 1000 * 60 * 24 * 30                // 页面缓存时间

  app.use(express.static(__dirname + '/web/dist', { maxAge: ONEMONTH }))

  wbconfig(app)
  wbfeed(app)
  wbcrt(app)
  wbjs(app)
  wbtask(app)
  wblogs(app)
  wbstore(app)
  wbdata(app)
  wblist(app)
  wbhook(app)

  app.use((req, res, next) => {
    res.end("404")
    next()
  })

  const server = http.createServer(app)

  const webstPort = process.env.PORT || CONFIG_Port.webst || 80

  server.listen(webstPort, ()=>{
    clog.notify("elecV2P manage on port", webstPort)
  })

  websocketSer({ server, path: '/elecV2P' })
}