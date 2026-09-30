const { prepareDemoRuntime } = require('./runtime')

prepareDemoRuntime()

const app = require('./app')
const server = require('./http-server')
const io = require('./io-server')
const port = process.env.PORT || 5002

server.on('request', app)

// 将socket.io服务器"附着到"http服务器上
// 当socket.io服务器被附着上的时候,它会接管http服务器上的一些请求
// 一般来说它就处理/socket.io开头的请求以及websocket请求
io.desk.attach(server)
io.restaurant.attach(server)

server.listen(port, '0.0.0.0', () => {
  console.log('server listening on port', port)
})
