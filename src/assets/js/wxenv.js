import { request } from './request'
import config from './config'

export function wxConfig (cb) {
  let timestamp = new Date().getTime()
  let nonceStr = timestamp + 'x'
  let appId = config.wx.appId
  let signUrl = `${config.baseUrl}/com/get_ticket_getticket`
  let jsApiList = [
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'playVoice',
    'onVoicePlayEnd',
    'pauseVoice',
    'stopVoice',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'addCard',
    'chooseCard',
    'openCard',
    'chooseInvoice'
  ]
  request({
    method: 'get',
    url: signUrl,
    data: {
      nonceStr: nonceStr,
      timestamp: timestamp,
      // url: encodeURIComponent(location.href.split('#')[0]),
      url: location.href.split('#')[0],
      appid: appId
    }
  }).then(res => {
    var data = res.data

    var wxconfig = {
      beta: true,
      debug: config.wx.debug,
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: jsApiList
    }
    // console.log(JSON.stringify(config))
    wx.config(wxconfig)
    wx.ready(() => {
      console.log('ready is ok')
      if (cb) cb()
    })
  })
}
export function updateShare (shareData) {
  let { title, desc, link, imgUrl } = config.wx
  let shareDefault = {
    title,
    desc,
    link,
    imgUrl,
    success: function () {
      console.log('分享成功')
    },
    cancel: function () {
      console.log('分享取消')
    }
  }
  let data = shareData || shareDefault
  wx.onMenuShareTimeline({
    title: data.title,
    link: data.link,
    imgUrl: data.imgUrl,
    success: data.success,
    cancel: data.cancel
  })
  wx.onMenuShareAppMessage({
    title: data.title,
    desc: data.desc,
    link: data.link,
    imgUrl: data.imgUrl,
    type: data.type,
    dataUrl: data.dataUrl,
    success: data.success,
    cancel: data.cancel
  })
  wx.onMenuShareQQ({
    title: data.title,
    desc: data.desc,
    link: data.link,
    imgUrl: data.imgUrl,
    success: data.success,
    cancel: data.cancel
  })
  wx.onMenuShareWeibo({
    title: data.title,
    desc: data.desc,
    link: data.link,
    imgUrl: data.imgUrl,
    success: data.success,
    cancel: data.cancel
  })
}
