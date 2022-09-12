const express = require('express')
const history = require('connect-history-api-fallback')
// const proxy = require('http-proxy-middleware')

var app = express()

app.use(
  history({
    verbose: false,
    index: '/console/index.html'
  })
)

// app.use(
//   '/api',
//   proxy({
//     target: process.env.API_URL || 'http://homev5.test.nodevops.cn',
//     changeOrigin: true,
//     secure: false
//   })
// )

app.use('/console', express.static('./dist'))
app.use('/data', express.static('./dist/data'))
app.listen(process.env.PORT || 80)

