/**
 * 常用小工具
 * underscore http://www.css88.com/doc/underscore1.8.2/#template
 */
import _ from 'underscore'
import '@/assets/css/tools.scss'
const tplObj = {
  alert: '<div data-mask="1" class="pop-container box box-ac box-pc animated fadeIn" data-close-ani="bounceOut">' +
            '<div class="alert box box-ver animated bounceIn pop-content">' +
              '<% if (title) { %>' +
              '<div  class="alert-title box box-pc"><%- title?title:"提示" %></div>' +
              '<% } %>' +
              '<div class="alert-content box box-pc"><%= content?content:"确定？" %></div>' +
              '<% if (buttons.length>0) { %>' +
              '<div class="alert-buttons box">' +
                '<% _.each(buttons, function(item, i){  %>' +
                '<div data-index="<%= i %>" class="box box-ac box-pc box-f1 box-fh alert-button"><%= item %></div>' +
                '<% }) %>' +
                '</div>' +
              '<% } %>' +
            '</div>' +
          '</div>',
  toast: '<div class="tools-toast"><%- msg?msg:"加载中..." %></div>',
  loading: '<div class="tools-loading">' +
              '<div class=".loading-content">' +
                '<div class="icon-loading"></div>' +
                '<div class="text"></div>' +
              '</div>' +
            '</div>'
}
/**
 * html字符串转换为dom对象
 */
export function str2dom (str) {
  let div = document.createElement('div')
  div.innerHTML = str
  return div.childNodes[0]
}

/**
 * 关闭弹框
 */
export function closePop (ele, cb) {
  let $popContainer = ele
  while (!$popContainer.getAttribute('data-mask')) {
    $popContainer = $popContainer.parentNode
  }
  let closeAni = $popContainer.getAttribute('data-close-ani') ? $popContainer.getAttribute('data-close-ani') : 'fadeOut'
  let $popContent = document.querySelectorAll('.pop-content')
  $popContainer.className = $popContainer.className + ' fadeOut'
  $popContent[0].className = $popContent[0].className + ' ' + closeAni
  $popContainer.addEventListener('webkitAnimationEnd', function () {
    $popContainer.parentNode.removeChild($popContainer)
  })
}

/**
 * 弹出框
 */
export function popup (obj) {
  let tpl = tplObj[obj.tpl]
  let tplStr = _.template(tpl)(obj)
  document.body.appendChild(str2dom(tplStr))
  let $popContainer = document.querySelectorAll('.pop-container')
  let $popBtn = document.querySelectorAll('.alert-button')
  $popContainer[0].addEventListener('touchmove', function (e) {
    e.stopPropagation()
    e.preventDefault()
  }, false)
  $popBtn.forEach((item, index) => {
    (function () {
      item.addEventListener('click', function (e) {
        let ele = e.target
        closePop(ele)
        obj.buttonCallBack(index)
      }, false)
    })(item, index)
  })
}

/**
 * toast框
 */
export function openToast (obj) {
  let tpl = tplObj['toast']
  let tplStr = _.template(tpl)(obj)
  let toastDom = str2dom(tplStr)
  // let hasOpenedToast = document.querySelectorAll('.toast')
  // if (hasOpenedToast.length > 0) {
  //   hasOpenedToast.forEach((item, index) => {
  //     item.parentNode.removeChild(item)
  //   })
  // }
  document.body.appendChild(toastDom)
  if (obj.duration) {
    setTimeout(() => {
      toastDom.parentNode.removeChild(toastDom)
    }, obj.duration)
    // setTimeout(() => {
    //   document.querySelectorAll('.toast').forEach((item, index) => {
    //     item.parentNode.removeChild(item)
    //   })
    // }, obj.duration)
  }
}

export function openLoading () {
  let loadingStr = `<div id="loadMask" class="loadMask box box-ac box-pc">
    <div class="spinner">
      <div class="spinner-container container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="spinner-container container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="spinner-container container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
    </div>
  </div>`
  if (!document.getElementById('loadMask')) {
    document.body.appendChild(str2dom(loadingStr))
  }
}

export function closeLoading () {
  let loadMask = document.getElementById('loadMask')
  if (loadMask) document.body.removeChild(loadMask)
}
