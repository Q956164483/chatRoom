<template>
  <div>
    <image-cropper ref="imageCropper" :cropperConfig="cropperConfig" :callback="photoCallBack"></image-cropper>
    <div class="box box-ver w-p100 h-p100">
      <div class="header box box-jc box-ac">
        <div @click="$router.go(-1)" class="icon icon-back"></div>
        群信息
        <!-- {{groupInfo.nickname}} -->
        <div class="icon icon-menu"></div>
      </div>
      <div class="group-info box box-ver box-ac">
        <div class="group-bg" :style="{'background-image': `url(${getHeadImg(groupInfo.avatar, 1)})`}"></div>
        <div class="nickname line box box-ac">
          <div class="">群名字：</div>
          <input maxlength="12" :class="{'hasbor': userInfo._id == groupInfo.creator}" :readonly="userInfo._id != groupInfo.creator" v-model="groupInfo.nickname" type="text">
        </div>
        <div class="nickname line box">
          <div class="">群介绍：</div>
          <textarea :class="{'hasbor': userInfo._id == groupInfo.creator}" :readonly="userInfo._id != groupInfo.creator" v-model="groupInfo.describe" cols="38" rows="5"></textarea>
        </div>
        <div @click="selectFile" v-if="userInfo._id == groupInfo.creator" class="file-check box box-ac box-jc">
          <div class="icon icon-upload"></div>
        </div>
        <div @click="joinGroup" v-if="(userInfo._id != groupInfo.creator) && userInfo.groups.indexOf(roomId) == -1" class="submit">加入群聊</div>
        <div @click="updateGroupInfo" v-if="userInfo._id == groupInfo.creator" class="submit">修改群信息</div>
      </div>
      <div class="line">群成员</div>
      <div ref="memberList" class="box-f1 wrapper of-y-h">
        <div class="content">
          <div @click="seeUserInfo(value)" v-for="(value, key) in memberList" :value="value" :key="key" class="member-item box box-ac">
            <div :style="{'background-image':`url(${getHeadImg(value.avatar)})`}" class="icon icon-head"></div>
            <div class="nickname box-f1 ell box">
              <div>{{value.nickname}}&nbsp;</div>
              <div class="tag" v-if="value._id == groupInfo.creator">&nbsp;群主&nbsp;</div>
            </div>
            <div class="last-word ell">{{value.lastOnline | formatDate}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BScroll from 'better-scroll'
import imageCropper from '../components/imageCropper.vue'
import { getHeadImg } from '@/assets/js/common'
import { openToast } from '@/assets/js/tools'
export default {
  name: 'chatRoomDetail',
  components: {
    imageCropper
  },
  data () {
    return {
      roomId: null,
      groupInfo: {},
      memberList: [],
      oldAvatar: '',
      cropperConfig: {
        width: 1,
        height: 1,
        quality: 0.5,
        maxWidth: 200
      }
    }
  },
  computed: mapState({
    userInfo: 'userInfo'
  }),
  mounted () {
    this.roomId = this.$route.query._id
    this.initScroll()
    this.getGroupInfo()
    this.getGroupMembers()
  },
  methods: {
    joinGroup () {
      let info = {
        uid: this.userInfo._id,
        _id: this.roomId
      }
      this.$socketEmiter('joinGroup', info).then(data => {
        this.getGroupMembers()
        this.userInfo.groups.push(this.roomId)
        openToast({
          msg: '加入成功',
          duration: 1500
        })
      })
    },
    getHeadImg (avatar) {
      return getHeadImg(avatar)
    },
    initScroll () {
      let _this = this
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.memberList, {
          click: true
          // pullDownRefresh: {
          //   threshold: 50,
          //   stop: 20
          // }
        })
        // this.scroll.on('pullingDown', pos => {
        //   // this.getGroupMembers()
        // })
      })
    },
    selectFile () {
      this.$refs.imageCropper.checkPhoto()
    },
    photoCallBack (data) {
      this.groupInfo.avatar = data
      console.log(data)
    },
    updateGroupInfo () {
      this.uploadImg(path => {
        let { nickname, describe, _id } = this.groupInfo
        let avatar = path
        if (!path) avatar = this.oldAvatar
        if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,12}$/.test(nickname)) {
          openToast({
            msg: '群名字由3-10个字母，数字，下划线组成',
            duration: 1500
          })
          return
        }
        if (describe.length < 8 || describe.length > 100) {
          openToast({
            msg: '群描述为8-100个字哦~',
            duration: 1500
          })
          return
        }
        const info = {
          nickname,
          describe,
          avatar,
          _id,
          uid: this.userInfo._id
        }
        this.$socketEmiter('updateGroupInfo', info).then(data => {
          openToast({
            msg: '修改成功',
            duration: 1500
          })
        })
      })
    },
    uploadImg (cb) {
      if (this.groupInfo.avatar.substring(0, 5) !== 'data:') return cb()
      this.$http({
        method: 'post',
        type: 'formData',
        url: `${this.$config.apiBase}/api/v0/com/upload/base64Img`,
        data: {
          imgData: this.groupInfo.avatar
        }
      }).then(res => {
        if (res.status === 1) cb(res.data.path)
      })
    },
    getGroupInfo () {
      const info = {
        _id: this.roomId
      }
      this.$socketEmiter('getGroupInfo', info).then(data => {
        this.groupInfo = data
        this.oldAvatar = this.groupInfo.avatar
      })
    },
    getGroupMembers () {
      const info = {
        _id: this.roomId,
        limit: 20
      }
      this.$socketEmiter('getGroupMembers', info).then(data => {
        this.memberList = data
        // let length = data.length
        // if (length === 0) {
        //   return
        // }
        // let nowRoomMsgList = data.concat(this.nowRoomMsgList)
        // this.$store.commit('nowRoomMsgList', nowRoomMsgList)
        // this.$nextTick(() => {
        //   this.scroll.refresh()
        //   if (!timestamp) {
        //     this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[this.nowRoomMsgList.length - 1], 0)
        //   } else {
        //     this.scroll.finishPullDown()
        //     this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[length], 0)
        //   }
        // })
      })
    },
    seeUserInfo (item) {
      let fromId = item._id
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
    scrollToBot () {
      this.$nextTick(() => {
        this.scroll.refresh()
        this.scroll.scrollToElement(document.querySelectorAll('.msg-item')[this.nowRoomMsgList.length - 1], 333)
      })
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
.line{
  padding:.1rem .2rem;
}
.file-check{
  position: absolute;
  bottom: .2rem;
  right:.2rem;
  width: 1rem;
  height: 1rem;
  background-color:rgba(255,255,255,.6);
  border-radius:50%;
  .icon-upload{
    width:.5rem;
    height:.5rem;
  }
}
.group-info{
  height:4.5rem;
  position: relative;
  .group-bg{
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    overflow: hidden;
    filter: blur(5px);
    @include bg-size(100% auto);
  }
  .line{
    color:#FFF;
    padding:.2rem;
    textarea,input{
      padding:.1rem;
      width:5.5rem;
      background:none;
      color:#FFF;
      border:none;
      outline: none;
      &.hasbor{
        border:1px solid #FFF;
      }
    }
    textarea{
      margin-top:-.1rem;
    }
  }
  .submit{
    position: relative;
    margin-top:.3rem;
    padding:.1rem .2rem;
    color:#FFF;
    background-color:$themeColor;
  }
}
.member-item{
  border-bottom:1px solid $borderColor;
  background-color:#FFF;
  padding:.1rem .2rem;
  .tag{
    background-color:$themeColor;
    border-radius:.1rem;
    color:#FFF;
  }
  .icon-head {
    width:.8rem;
    height:.8rem;
    margin-right:.2rem;
  }
}
</style>
