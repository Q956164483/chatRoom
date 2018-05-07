import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { openToast } from '@/assets/js/tools'
/**
 * axios 版本
 */
export function request (params) {
  // axios post的data必须转换为URLSearchParams后台才能接收到
  // var host = 'http://wx.ufunet.cn/'
  let host = ''
  let data = {}
  if (params.method === 'post') {
    data = params.data
    if (params.type === 'formData') {
      let formData = new FormData()
      for (let i in data) {
        formData.append(i, data[i])
      }
      data = formData
    } else {
      data = qs.stringify(params.data)
    }
  }
  return new Promise((resolve, reject) => {
    store.commit('isLoading', true)
    axios({
      method: params.method ? params.method : 'get',
      url: host + params.url,
      data: data,
      params: params.method === 'post' ? {} : params.data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': params.type === 'formData' ? 'application/form-data;charset=utf-8' : 'application/x-www-form-urlencoded;charset=utf-8'
        // 跨域相关参数
        // 'Access-Control-Allow-Origin':'*',
        // 'Access-Control-Allow-Methods':'POST,GET,OPTIONS',
        // 'Access-Control-Allow-Headers':'Content-Type,Authorization'
      }
    }).then(response => {
      store.commit('isLoading', false)
      if (response.status === 200) {
        console.log(params.url.split('/').pop() + '>>>', response.data)
        resolve(response.data)
        if (response.data.status !== 1) {
          openToast({
            msg: response.data.message,
            duration: 1500
          })
        }
      } else {
        openToast({
          msg: `请求失败 status: ${response.status}`,
          duration: 1500
        })
      }
    }).catch(error => {
      store.commit('isLoading', false)
      if (reject) {
        reject(error)
      } else {
        openToast({
          msg: `服务器凌乱了`,
          duration: 1500
        })
        console.log('common error func')
      }
    })
  })
}

Vue.use({
  install: () => {
    Vue.prototype.$http = request
  }
})
