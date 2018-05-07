import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import searchChat from '@/views/searchChat'
import movie from '@/views/movie'
import movieDetail from '@/views/movieDetail'
import movieSearch from '@/views/movieSearch'
import chatRoom from '@/views/chatRoom'
import chatRobot from '@/views/chatRobot'
import chatRoomDetail from '@/views/chatRoomDetail'
import createGroup from '@/views/createGroup'
import acution from '@/views/acution'
import signUp from '@/views/signUp'
import login from '@/views/login'
import userInfo from '@/views/userInfo'
import userInfoOthers from '@/views/userInfoOthers'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: '消息',
      component: index
    },
    {
      path: '/signUp',
      name: '注册',
      component: signUp
    },
    {
      path: '/login',
      name: '登陆',
      component: login
    },
    {
      path: '/userInfo',
      name: '个人信息',
      component: userInfo
    },
    {
      path: '/userInfoOthers',
      name: '详细信息',
      component: userInfoOthers
    },
    {
      path: '/movie',
      name: '电影列表',
      component: movie,
      children: [{
        path: '/movie/detail',
        name: '电影详情',
        component: movieDetail
      },
      {
        path: '/movie/search',
        name: '电影搜索',
        component: movieSearch
      }]
    },
    {
      path: '/searchChat',
      name: '搜索',
      component: searchChat
    },
    {
      path: '/chatRoom',
      name: '聊天室',
      component: chatRoom
    },
    {
      path: '/chatRobot',
      name: '超级助手',
      component: chatRobot
    },
    {
      path: '/chatRoomDetail',
      name: '详情',
      component: chatRoomDetail
    },
    {
      path: '/createGroup',
      name: '创建群组',
      component: createGroup
    },
    {
      path: '/acution',
      name: '拍卖',
      component: acution
    }
  ]
})
