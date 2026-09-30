const socketIO = require('socket.io')

// 创建了两个socketio服务器对象
// 并指定了路径,socket.io的默认路径是/socket.io
// 指定了路径之后,以这个路径开头的请求就会被这个socket.io服务器对象接管
module.exports.restaurant = socketIO({
  path: '/restaurant'
})

module.exports.desk = socketIO({
  path: '/desk'
})
