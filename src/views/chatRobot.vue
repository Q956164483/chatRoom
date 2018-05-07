<template>
  <div>
    <div class="box box-ver w-p100 h-p100">
      <div class="header box box-jc box-ac">
        <div @click="$router.go(-1)" class="icon icon-back"></div>
        超级助手
      </div>
      <div ref="msgList" class="box-f1 msg-list wrapper">
        <div class="content">
          <div :class="{'others': value.from._id != userInfo._id, 'me': value.from._id == userInfo._id }" v-for="(value,key) in robotMsgList" :value="value" :key="key" class="msg-item box">
            <div :style="{'background-image':`url(${getHeadImg(value.from.avatar)})`}" class="icon icon-head"></div>
            <div class="box box-ver msg-detail">
              <div class="desc box">
                <div class="nickname" v-text="value.from.nickname"></div>
              </div>
              <div v-if="value.msgType === 100000" class="msg-content" v-text="value.content"></div>
              <div v-if="value.msgType === 200000" class="msg-content">
                <a :href="value.content.url" target="blank" v-text="value.content.text"></a>
              </div>
              <div v-if="value.msgType === 302000" class="msg-content news">
                <a v-for="(item, index) in value.content" :value="item" :key="index" :href="item.detailurl" target="blank" v-text="`${index + 1}.[${item.source}] ${item.article}`"></a>
                <br>
              </div>
              <div v-if="value.msgType === 308000" class="msg-content news">
                <a v-for="(item, index) in value.content" :value="item" :key="index" :href="item.detailurl" target="blank" v-text="`${index + 1}.[${item.info}] ${item.name}`"></a>
                <br>
              </div>
           </div>
          </div>
        </div>
      </div>
      <div class="msg-sender box box-ac">
        <div class="icon icon-emoj"></div>
        <textarea @keyup.13="msgEmit()" v-model="textValue" class="input box-f1"></textarea>
        <div class="icon icon-more"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BScroll from 'better-scroll'
import { getHeadImg } from '@/assets/js/common'
export default {
  name: 'chatRoom',
  data () {
    return {
      textValue: '',
      hasLoadAllMsg: false
    }
  },
  computed: mapState({
    userInfo: 'userInfo',
    receiveNews: 'receiveNews',
    robotMsgList: 'robotMsgList'
  }),
  mounted () {
    this.initScroll()
  },
  methods: {
    getHeadImg (avatar) {
      return getHeadImg(avatar)
    },
    initScroll () {
      let _this = this
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.msgList, {
          click: true
        })
        this.scrollToBot()
      })
    },
    msgEmit () {
      let text = this.textValue
      this.textValue = text.replace(/[\r\n]/g, '').replace(/(^\s*)|(\s*$)/g, '')
      if (!this.textValue) {
        return false
      }
      let message = {
        from: this.userInfo,
        type: 'robot',
        content: this.textValue,
        msgType: 100000
      }
      this.textValue = ''
      // this.robotMsgList.push(message)
      this.$store.commit('addRobotMsgList', message)
      this.$socketEmiter('new message', message).then(data => {
        data = JSON.parse(data)
        // console.log(data)
        let code = +data.code
        let robotMsg = {
          from: {
            nickname: 'robot'
          },
          type: 'robot',
          msgType: code
        }
        if (code === 100000) {
          robotMsg.content = data.text
        } else if (code === 200000) {
          robotMsg.content = {
            text: data.text,
            url: data.url
          }
        } else if (code === 302000) {
          robotMsg.content = data.list
        } else if (code === 308000) {
          robotMsg.content = data.list
        } else {
          robotMsg.msgType = 100000
          robotMsg.content = `暂未支持显示此格式消息，code：${code}`
        }
        // console.log(robotMsg)
        this.$store.commit('addRobotMsgList', robotMsg)
        this.scrollToBot()
      })
    },
    scrollToBot () {
      this.$nextTick(() => {
        this.scroll.refresh()
        this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[this.robotMsgList.length - 1], 333)
      })
    }
  },
  watch: {
    // robotMsgList (curVal, oldVal) {
    //   this.scrollToBot()
    // }
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
    word-wrap:break-word;
    &.news{
      a{
        display:block;
        padding-bottom:.12rem;
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
  border-top:1px solid #999;
}
.icon-emoj,.icon-more{
  width:.7rem;
  height:.7rem;
  border-radius:50%;
  margin:.15rem;
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
</style>
