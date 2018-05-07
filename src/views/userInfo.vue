<template>
  <div>
    <div class="box box-ver w-p100 h-p100">
      <div @click="$router.go(-1)" class="icon icon-back"></div>
      <div :style="{'background-image':'url('+showUser.avatar+')'}" class="user-bg icon">
      </div>
      <div class="user-info box box-ver box-ac">
        <div :style="{'background-image':'url('+showUser.avatar+')'}" class="icon icon-head">
          <div @click="selectFile()" class="mask-head box box-ac box-jc">
            <div class="icon icon-upload"></div>
          </div>
        </div>
        <input v-model="showUser.nickname" class="line nickname tx-c" type="text">
        <input v-model="showUser.place" maxlength="5" class="line tx-c" type="text">
        <div v-text="showUser.email" class="line email tx-c"></div>
        <input v-model="showUser.sex" maxlength="1" class="line tx-c" type="text">
        <div @click="updateUserInfo()" class="submit">修改</div>
      </div>
      <image-cropper ref="imageCropper" :cropperConfig="cropperConfig" :callback="photoCallBack"></image-cropper>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import imageCropper from '../components/imageCropper.vue'
import { getHeadImg } from '@/assets/js/common'
import { openToast } from '@/assets/js/tools'
export default {
  name: 'userInfo',
  components: {
    imageCropper
  },
  data () {
    return {
      showUser: {},
      imgData: '',
      cropperConfig: {
        width: 1,
        height: 1,
        quality: 0.5,
        maxWidth: 200
      }
    }
  },
  computed: mapState(['userInfo']),
  mounted () {
    this.showUser = JSON.parse(JSON.stringify(this.userInfo))
    this.showUser.avatar = getHeadImg(this.userInfo.avatar)
  },
  methods: {
    getHeadImg (avatar) {
      return getHeadImg(avatar)
    },
    selectFile () {
      this.$refs.imageCropper.checkPhoto()
    },
    photoCallBack (dataUrl) {
      this.showUser.avatar = dataUrl
      this.imgData = dataUrl
    },
    updateUserInfo () {
      this.uploadImg(path => {
        let avatar = path
        if (!path) avatar = this.userInfo.avatar
        let { _id, nickname, place, sex } = this.showUser
        if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,12}$/.test(nickname)) {
          openToast({
            msg: '昵称由3-12个字母，数字，下划线组成',
            duration: 1500
          })
          return
        }
        if (!place) place = '地球'
        if (!sex) sex = '秘密'
        this.$http({
          method: 'post',
          type: 'formData',
          url: `${this.$config.apiBase}/api/v0/user/update`,
          data: { nickname, _id, place, sex, avatar }
        }).then(res => {
          if (res.status === 1) {
            this.userInfo.avatar = path
            this.$router.go(-1)
          }
        })
      })
    },
    uploadImg (cb) {
      if (!this.imgData) return cb()
      this.$http({
        method: 'post',
        type: 'formData',
        url: `${this.$config.apiBase}/api/v0/com/upload/base64Img`,
        data: {
          imgData: this.imgData
        }
      }).then(res => {
        if (res.status === 1) cb(res.data.path)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/config.scss';
@import '../assets/css/mixins.scss';
.user-bg{
  position: absolute;
  width:100%;
  height:100%;
  background-size:auto 100%;
  filter: blur(20px);
  overflow: hidden;
}
.icon-upload{
  width:1rem;
  height:1rem;
  opacity:.5;
}

.user-info{
  margin-top:4.5rem;
}
.icon-head{
  border:1px solid #000;
  border-radius:50%;
  width:2rem;
  height:2rem;
  margin-top:-1rem;
}
.mask-head{
  width:100%;
  height:100%;
  border-radius:50%;
  background-color:rgba(0,0,0,.33);
}
.fileSelecter{
  display:none
}
.line{
  display:block;
  margin-top:.25rem;
  font-size:.36rem;
  color:#EEE;
  height:.66rem;
  background: none;
  border:none;
  outline: none;
  border-bottom:1px solid;
}
.submit{
  margin-top:.5rem;
  text-align: center;
  line-height:.6rem;
  width:3.2rem;
  height:.6rem;
  background-color:$themeColor;
  color:#FFF;
}
</style>
