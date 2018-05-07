import resources from '@/assets/js/resources'
import config from './config'
/**
 * 获取链接后面的参数
 * @param String name 需要获取的参数名字
 */
export function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  return r != null ? unescape(r[2]) : null
}
/**
 * 获取文件后缀
 * @param {*} name
 */
export function getExtension (name) {
  let ext = null
  let filename = name.toLowerCase()
  let i = filename.lastIndexOf('.')
  if (i > -1) {
    ext = filename.substring(i)
  }
  return ext
}
/**
 * 文件转换为base64
 */
export function readAsDataURL (file, cb) {
  let _this = this
  let reader = new window.FileReader()
  reader.onload = () => {
    if (cb) cb(reader.result)
  }
  reader.readAsDataURL(file)
}
/**
 *
 *
 * @export
 * @param {element} ele 滚动容器
 * @param {int} distance 距离底部distance触发endCb
 * @param {func} ubCb 滚动条向下监听
 * @param {func} downCb 滚动条向上监听
 * @param {func} endCb 滚动条到底部回调
 * @param {func} topCb 滚动条到顶部回调
 * @param {int} delay 节流控制
 */
export function scrollController (obj) {
  var ele = obj.ele
  var distance = obj.distance ? obj.distance : 2
  var lastScrollTop = 0
  var timer
  ele.addEventListener('scroll', e => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      var scrollTop = ele.scrollTop
      if (scrollTop - lastScrollTop > 0) {
        if (obj.downCb) obj.downCb()
        if (scrollTop + ele.offsetHeight + distance >= ele.scrollHeight) {
          if (obj.endCb) obj.endCb()
        }
      } else {
        if (obj.upCb) obj.upCb()
        if (scrollTop <= distance) {
          if (obj.topCb) obj.topCb()
        }
      }
      lastScrollTop = ele.scrollTop
      if (obj.scrollCb) obj.scrollCb(lastScrollTop)
    }, obj.delay ? obj.delay : 10)
  }, false)
}
/**
 * 获取用户头像
 * @param {*} avatar
 * @param {*} type
 */
export function getHeadImg (avatar, type) {
  if (!avatar) {
    if (type === 1) {
      return resources.defaultGroupHead
    } else {
      return resources.defaultUserHead
    }
  } else {
    if (avatar.substring(0, 5) === 'data:') {
      return avatar
    } else {
      return `${config.imgBase}${avatar}`
    }
  }
}
// export function formatCompleteDate (time, str) {
//   if(time != null){
//     let date = new Date(time)
//     return date.getFullYear() + str + (date.getMonth() + 1) + str + date.getDate() + ' ' +
//            String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
//  }
// }
