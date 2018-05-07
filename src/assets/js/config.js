const NODE_ENV = process.env.NODE_ENV
let server = {
  host: 'http://47.104.24.198',
  port: 3006
}
if (NODE_ENV === 'development') {
  server = {
    // host: 'http://192.168.1.104',
    host: 'http://192.168.119.37',
    port: 3006
  }
}
const apiBase = `${server.host}:${server.port}`
const socketBase = `${server.host}:${server.port}`
const imgBase = `${server.host}:${server.port}`
// 微信部分的配置
// let wx = {
//   appId: 'wxb49f0a0ee3b7b621',
//   debug: false, // 是否开启微信debug模式
//   title: '分享标题',
//   desc: '分享描述',
//   link: 'http://xxx.xxx.xxx/xxx',
//   imgUrl: 'http://xxx.xxx.xxx/xxx/share.jpg'
// }
export default {
  // wx,
  apiBase,
  socketBase,
  imgBase,
  server
}
