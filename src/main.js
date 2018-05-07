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
