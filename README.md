# vue+koa2即时聊天，实时推送比特币价格，爬取电影网站
## 技术栈
vue+vuex+vue-router+socket.io+koa2+mongodb+pm2自动化部署+图灵机器人+[npm script打包，cdn同步，服务器上传一个命令全搞定]
## 功能清单
登陆注册

获取聊天记录（包含前端分页优化）

发送文字，表情，文件消息

创建群组，添加群组，群组搜索

修改个人信息，群组信息

图片裁剪压缩上传

私聊

[图灵机器人接入](http://www.tuling123.com/)

定时任务爬取电影和btc等数字货币的价格并使用socket.io实时推送给所有客户端

前端一键打包同步到七牛cdn并上传到服务器的实现

pm2自动部署

## [效果演示](http://aibi.ren/movie-chat/#/)chrome下F12或者手机打开预览

### 后端接口暂时开放，但是后端的代码暂时不开放出来，因为涉及到太多个人的配置数据，如果实在需要可以加微信 MSC199312 （需要付费0.0！），毕竟这个小项目断断续续也做了几个星期，也还花了些心思，而且涉及的知识点也都还是很广很实用的，还望理解，其实主要原因还是穷[泪奔]

## 运行截图
<center>
<img alt="主页" src="https://q956164483.github.io/chatRoom/resources/1.PNG"/>
<img alt="聊天" src="https://q956164483.github.io/chatRoom/resources/2.PNG"/>
<img alt="群信息" src="https://q956164483.github.io/chatRoom/resources/3.PNG"/>
<img alt="个人信息" src="https://q956164483.github.io/chatRoom/resources/4.PNG"/>
<img alt="发送表情" src="https://q956164483.github.io/chatRoom/resources/5.PNG"/>
<img alt="发送图片和文件" src="https://q956164483.github.io/chatRoom/resources/6.PNG"/>
<img alt="图片裁剪" src="https://q956164483.github.io/chatRoom/resources/7.PNG"/>
<img alt="菜单" src="https://q956164483.github.io/chatRoom/resources/8.PNG"/>
<img alt="群聊搜索" src="https://q956164483.github.io/chatRoom/resources/9.PNG"/>
<img alt="群信息" src="https://q956164483.github.io/chatRoom/resources/10.PNG"/>
<img alt="建群" src="https://q956164483.github.io/chatRoom/resources/11.PNG"/>
<img alt="消息推送" src="https://q956164483.github.io/chatRoom/resources/12.PNG"/>
</center>

## 部分代码
客户端 main.js
```javascript
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import store from '@/store'
import io from 'socket.io-client'
import '@/assets/js/remChange'
import '@/assets/js/request'
// import { wxConfig, updateShare } from '@/assets/js/wxenv'
import '@/assets/css/common.scss'
import 'swiper/dist/css/swiper.min.css'
import config from '@/assets/js/config'
import filters from '@/assets/js/filters'
import { openToast } from '@/assets/js/tools'

Vue.config.productionTip = false

// 初始化全局过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

// 懒加载
Vue.use(VueLazyload, {
  attempt: 1,
  // preLoad: 1.3,
  error: require('./assets/images/404.png'),
  loading: require('./assets/images/loading-img2.gif'),
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: [ 'scroll' ]
})

Vue.prototype.$config = config

router.beforeEach((to, from, next) => {
  // 如果未匹配到路由
  if (to.matched.length === 0) {
    // 如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
    from.name ? next({ name: from.name }) : next('/')
  } else {
    // 路由切换时改变页面标题
    document.querySelector('title').innerHTML = to.name
    // 统计代码
    if (to.path) _czc.push(['_trackPageview', '/#' + to.fullPath], '')
    next()
  }
})

// 路由变化重新配置微信分享
router.afterEach(to => {
  // wxConfig(() => updateShare())
})

// socket.io 初始化
const socket = io.connect(config.socketBase)
Vue.prototype.$socket = socket
Vue.prototype.$socketEmiter = (name, data) => {
  store.commit('isLoading', true)
  return new Promise((resolve) => {
    socket.emit(name, data, res => {
      console.log(`${name}>>>`, res)
      store.commit('isLoading', false)
      if (res.status === 1) {
        resolve(res.data)
      } else {
        openToast({
          msg: res.message,
          duration: 1500
        })
      }
    })
  })
}

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

```
server端 app.js
```javascript
const Koa = require('koa')
const { resolve } = require('path')
const glob = require('glob')
const { connectDatabase, initAllSchema, initDefaultUser } = require('./database/init')
const config = require('./config')

const useMiddlewares = app => {
  glob.sync(resolve(__dirname, './middlewares', '**/*.js')).forEach(item => {
    require(item)(app)
  })
}

(async () => {

  console.log('数据库初始化...')
  await connectDatabase()
  initAllSchema()
  await initDefaultUser()

  const app = new Koa()

  console.log('挂载socket.io...')
  const server = require('http').Server(app.callback())
  const io = require('socket.io').listen(server)
  require('./socket')(io)

  // 暴露出io可在其他地方做推送功能
  module.exports.io = io

  console.log('挂载中间件...')
  useMiddlewares(app)

  console.log('初始化定时任务...')
  // 多了进行一下封装？
  require('./tools/crawlMovie')
  require('./tools/crawlCoin')

  server.listen(config.server.PORT, () => {
    console.log('正在监听' + config.server.PORT + '端口...')
  })

})()
```
