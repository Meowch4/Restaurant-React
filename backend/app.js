const express = require('express')

// 让服务器支持跨域的中间件
const cors = require('cors')
// 解析cookie的中间件
const cookieParser = require('cookie-parser')
// 为服务器带来session功能的中间件
const session = require('express-session')
const path = require('path')
const { runtimeUploadPath, seedUploadPath } = require('./runtime')

const userAccountMiddleware = require('./user-account')
const restaurantMiddleware = require('./restaurant')

const app = express()

// 输出日志的中间件
app.use((req, res, next) => {
  console.log(req.socket.remoteAddress, req.method, req.url)
  next()
})

// 让服务器允许跨域
app.use(cors({
  origin: true,
  maxAge: 86400,
  credentials: true,
}))

// 使用session中间件以让服务器支持session
// 用来实现验证码功能
app.use(session({
  secret: process.env.SESSION_SECRET || 'restaurant-demo-only-secret',
  resave: false,
  saveUninitialized: true,
}))

app.use(cookieParser('secret'))

// 静态文件中间件,用来向浏览器发送构建好的前端代码
app.use(express.static(path.join(__dirname, 'dist')))//处理静态文件请求的中间件
// app.use(express.static(__dirname + '/build/'))//处理静态文件请求的中间件
app.use(express.static(__dirname + '/static/'))//处理静态文件请求的中间件

// 用于响应浏览器发来的菜品图片的请求的中间件
// 因为菜品图片都是用户在添加菜品的时候上传上来的,而且都放在/upload/文件夹
// 最终肯定要被浏览器请求,这个中间件就是用来响应浏览器的头像请求的
app.use('/upload', express.static(runtimeUploadPath))
app.use('/upload', express.static(seedUploadPath))//处理演示数据自带的菜品图片


app.use(express.urlencoded({extended: true}))//用来解析扩展url编码的请求体
app.use(express.json())//用来解析json请求体

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 两个处理业务逻辑的中间件
// 一个是用户账户相关:登陆,注册
app.use('/api', userAccountMiddleware)
// 一个是点餐业务逻辑相关:获取菜单,增删菜品,下单,等等
app.use('/api', restaurantMiddleware)

// 为了前端路由能使用不带#号的模式，如果不使用无#号模式，则不需要这个中间件
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

module.exports = app
