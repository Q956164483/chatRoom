<template>
  <div>
    <div class="box box-ver w-p100 h-p100">
      <div class="header box box-jc box-ac">
        <div @click="$router.go(-1)" class="icon icon-back"></div>
        {{nowRoom.nickname}}
        <div v-if="nowRoom.type=='group'" @click="seeGroupDetail()" class="icon icon-menu"></div>
      </div>
      <div ref="msgList" class="box-f1 msg-list wrapper">
        <div class="content">
          <div :class="{'others': value.from._id != userInfo._id, 'me': value.from._id == userInfo._id }" v-for="(value,key) in nowRoomMsgList" :value="value" :key="key" class="msg-item box">
            <div @click="seeUserInfo(value)" :style="{'background-image':`url(${getHeadImg(value.from.avatar)})`}" class="icon icon-head"></div>
            <div class="box box-ver msg-detail">
              <div class="desc box">
                <div class="nickname" v-text="value.from.nickname"></div>
              </div>
              <div v-if="value.msgType === 'text'" class="msg-content" v-html="handleMsgContent(value.content)"></div>
              <div v-if="value.msgType === 'img'" class="msg-content">
                <img class="msg-img" :src="getHeadImg(value.content)" alt="">
              </div>
              <div v-if="value.msgType === 'file'" class="msg-content">
                <a class="box file" :href="getHeadImg(value.content)" target="blank">
                  <div class="icon icon-file"></div>
                  <div class="box-f1 file-name">{{value.content.split('/').pop()}}</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="msg-sender box box-ver w-p100">
        <div class="box box-ac w-p100">
          <div @click="changeToolStatus(1)" class="icon icon-emoj"></div>
          <textarea @focus="listenKeyBoard()" ref="textInput" @keyup.13="msgEmit('text', textValue)" v-model="textValue" class="input box-f1"></textarea>
          <div @click="changeToolStatus(2)" class="icon icon-more"></div>
        </div>
        <div v-if="showTools == 1" class="emojy">
          <img @click="addEmojy(item, index)" :src="item" alt="index" :value="item" :key="index" v-for="(item, index) in emojy" >
        </div>
        <div v-if="showTools == 2" class="menu-more box">
          <label for="imgSelecter" class="button">图片</label>
          <label for="fileSelecter" class="button">文件</label>
          <input @change="sendFile" class="input-file" id="imgSelecter" type="file" accept="image/*">
          <input @change="sendFile" class="input-file" id="fileSelecter" type="file" accept="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BScroll from 'better-scroll'
import { getHeadImg, getExtension } from '@/assets/js/common'
import emojy from '@/assets/js/emojy'
import lrz from 'lrz'
import { openToast } from '@/assets/js/tools'
export default {
  name: 'chatRoom',
  data () {
    return {
      textValue: '',
      hasLoadAllMsg: false,
      roomType: null,
      nowRoom: {},
      emojy: [],
      showTools: null
    }
  },
  computed: mapState({
    userInfo: 'userInfo',
    nowRoomMsgList: 'nowRoomMsgList',
    receiveNews: 'receiveNews'
  }),
  mounted () {
    this.emojy = emojy
    this.roomType = this.$route.query.type
    if (this.roomType === 'group') {
      this.nowRoom = this.$store.state.nowGroup
    } else if (this.roomType === 'private') {
      this.nowRoom = this.$store.state.nowPrivate
    } else {
      this.$router.replace('/')
    }
    this.initScroll()
    this.getRoomMsg()
  },
  methods: {
    getHeadImg (avatar) {
      return getHeadImg(avatar)
    },
    initScroll () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.msgList, {
          click: true,
          pullDownRefresh: {
            threshold: 50,
            stop: 20
          }
        })
        this.scroll.on('pullingDown', pos => {
          this.getRoomMsg(this.nowRoomMsgList[0].createAt)
        })
      })
    },
    getRoomMsg (timestamp) {
      if (!timestamp) {
        this.$store.commit('nowRoomMsgList', [])
      }
      if (this.hasLoadAllMsg) {
        this.scroll.finishPullDown()
        return false
      }
      const info = {
        from: this.userInfo._id,
        to: this.nowRoom._id,
        limit: 20,
        timestamp: timestamp || ''
      }
      let socketMsg = this.nowRoom.type === 'group' ? 'getGroupMsg' : 'getPrivateMsg'
      this.$socketEmiter(socketMsg, info).then(data => {
        let length = data.length
        if (length === 0) {
          this.hasLoadAllMsg = true
          return
        }
        let nowRoomMsgList = data.concat(this.nowRoomMsgList)
        this.$store.commit('nowRoomMsgList', nowRoomMsgList)
        console.log({ timestamp })
        if (!timestamp) {
          this.scrollToBot()
        } else {
          this.$nextTick(() => {
            this.scroll.finishPullDown()
            this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[length], 0)
          })
        }
      })
    },
    addEmojy (item, index) {
      this.textValue = `${this.textValue}[${index}]`
    },
    handleMsgContent (content) {
      return content.replace(/\[(.+?)\]/g, (a, b) => {
        if (emojy[b]) {
          return `<img src="${emojy[b]}" style="width:.4rem;margin:.0 .02rem;vertical-align:middle;"/>`
        } else {
          return a
        }
      })
    },
    changeToolStatus (type) {
      if (this.showTools === type) {
        this.showTools = null
      } else {
        this.showTools = type
      }
      this.scrollToBot()
    },
    sendFile ($event) {
      let file = $event.target.files[0]
      // console.log(file)
      let imgExt = ['.png', '.jpg', '.jpeg']
      let ext = getExtension(file.name)
      $event.target.value = ''
      if (imgExt.indexOf(ext) > -1) {
        lrz(file, { width: 800 }).then(rst => {
          this.uploadImg(rst.base64, path => {
            this.msgEmit('img', path)
          })
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log(file.size)
        if (Math.floor(file.size / 1024) > 1024 * 2) {
          openToast({
            msg: '文件不能超过2M',
            duration: 2500
          })
          return false
        }
        this.uploadFile(file, path => {
          if (ext === '.gif') {
            this.msgEmit('img', path)
          } else {
            this.msgEmit('file', path)
          }
        })
      }
    },
    uploadFile (file, cb) {
      this.$http({
        method: 'post',
        type: 'formData',
        url: `${this.$config.apiBase}/api/v0/com/upload/loc`,
        data: {
          file
        }
      }).then(res => {
        if (res.status === 1) cb(res.data.path)
      })
    },
    uploadImg (imgData, cb) {
      if (!imgData) return cb()
      this.$http({
        method: 'post',
        type: 'formData',
        url: `${this.$config.apiBase}/api/v0/com/upload/base64Img`,
        data: {
          imgData
        }
      }).then(res => {
        if (res.status === 1) cb(res.data.path)
      })
    },
    msgEmit (msgType, content) {
      let message = {
        from: this.userInfo,
        type: this.roomType,
        to: this.nowRoom._id,
        msgType: msgType || 'text',
        createAt: new Date().getTime()
      }
      // console.log(msgType, content)
      if (msgType === 'text') {
        let text = content
        this.textValue = text.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '')
        if (!this.textValue) {
          return false
        }
        message.content = this.textValue
        this.textValue = ''
      } else if (msgType === 'img' || msgType === 'file') {
        message.content = content
      } else {
        return false
      }
      console.log(message)
      this.$socketEmiter('new message', message).then(data => {
        this.nowRoomMsgList.push(message)
        this.scrollToBot()
      })
    },
    seeUserInfo (item) {
      let fromId = item.from._id
      if (fromId === this.userInfo._id) {
        this.$router.push('/userInfo')
      } else {
        this.$router.push({
          path: '/userInfoOthers',
          query: {
            _id: fromId
          }
        })
      }
    },
    seeGroupDetail () {
      this.$router.push({
        path: '/chatRoomDetail',
        query: {
          _id: this.nowRoom._id
        }
      })
    },
    scrollToBot () {
      this.$nextTick(() => {
        this.scroll.refresh()
        this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[this.nowRoomMsgList.length - 1], 333)
        const imgArr = document.getElementsByClassName('msg-img')
        const len = imgArr.length
        let _this = this
        for (let i = 0; i < len; i++) {
          imgArr[i].onload = function () {
            if (!this.getAttribute('data-load')) {
              this.setAttribute('data-load', '1')
              _this.imgScrollTimer = setTimeout(() => {
                _this.scroll.refresh()
                _this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[_this.nowRoomMsgList.length - 1], 333)
                clearTimeout(_this.imgScrollTimer)
                // this.imgScrollTimer = null
              }, 333)
            }
          }
        }
      })
    },
    listenKeyBoard () {
      let timer = setInterval(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 95)
      setTimeout(() => clearInterval(timer), 500)
    }
  },
  watch: {
    receiveNews (curVal, oldVal) {
      console.log('receiveNews changed')
      this.scrollToBot()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/config.scss';
@import '../assets/css/mixins.scss';
.header{
  width:100%;
  height:.88rem;
  color:#FFF;
  font-size:.32rem;
  background-color:$themeColor;
}
.icon-menu{
  position: absolute;
  width: 0.5rem;
  height:.5rem;
  right:.2rem;
  top:.17rem;
  background-image:url('../assets/images/icon-menu.svg')
}
.msg-list{
  background-color:#EFEFEF;
  padding-bottom:.2rem;
  width:100%;
  overflow-y: hidden;
  .content{
    padding-bottom: .25rem;
  }
}
.msg-item{
  padding-top:.25rem;
  .icon-head{
    margin:0 .1rem;
    width:.8rem;
    height:.8rem;
    // border-radius:50%;
    background-color: #ddd;
  }
  .msg-detail{
    margin:0 .1rem;
  }
  .nickname{
    color:#999;
    font-size:.18rem;
  }
  .msg-content{
    position:relative;
    margin-top:.1rem;
    font-size:.3rem;
    padding:.2rem;
    max-width:4.5rem;
    background-color: #FFF;
    border-radius:.1rem;
    line-height:.4rem;
    word-wrap:break-word;
    img{
      display:block;
      max-width:100%;
    }
    .file{
      .file-name{
        width:3rem;
      }
    }
  }
  .msg-content:before{
    position: absolute;
    top:.15rem;
    width: 0;
    height: 0;
    display:block;
    content:'';
    border-top: .1rem solid transparent;
    border-bottom: .1rem solid transparent;
  }
  &.others{
    .msg-content:before{
      left:-.145rem;
      border-right: .15rem solid #FFF;
    }
  }
  &.me{
    flex-direction: row-reverse;
    .desc{
       flex-direction: row-reverse;
    }
    .msg-content:before{
      right:-.145rem;
      border-left: .15rem solid #FFF;
    }
  }
}
.msg-sender{
  width:100%;
  background-color:#FFF;
  border-top:1px solid $borderColor;
}
.icon-emoj,.icon-more{
  width:.7rem;
  height:.7rem;
  border-radius:50%;
  margin:.15rem;
}
.icon-file{
  width:.8rem;
  height:.8rem;
  background-image: url('../assets/images/icon-file.svg');
}
.icon-emoj{
  background-image: url('../assets/images/icon-emoj.svg');
}
.icon-more{
  background-image: url('../assets/images/icon-add.svg');
}
.input{
  outline:none;
  border:1px solid #999;
  padding:.15rem;
  font-size:.3rem;
  height:.4rem;
  line-height:.4rem;
  border-radius:.1rem;
}
.emojy{
  border-top:1px solid $borderColor;
  img{
    width:.508rem;
    margin:.1rem;
  }
}
.menu-more,.emojy{
  padding-top:.3rem;
  padding-bottom:.3rem;
}
.menu-more{
  .button{
    padding:.15rem .3rem;
    margin:0 .2rem;
    background-color:$themeColor;
    color:#FFF;
  }
  .input-file{
    width:0;
    height:0;
    display:none;
  }
}
</style>
