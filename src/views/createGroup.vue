<template>
  <div>
    <div class="box  box-ac box-ver w-p100 h-p100">
      <div :style="{'background-image':'url('+group.avatar+')'}" class="icon icon-head">
        <div @click="selectFile()" class="mask-head box box-ac box-jc w-p100 h-p100">
          <div class="icon icon-upload"></div>
        </div>
      </div>
      <input v-model="group.nickname" class="nickname" placeholder="请输入群名字"  type="text">
      <textarea v-model="group.describe" placeholder="请输入群描述" rows="5"></textarea>
      <div @click="signUp" class="submit">创建</div>
    </div>
    <image-cropper ref="imageCropper" :cropperConfig="cropperConfig" :callback="photoCallBack"></image-cropper>
  </div>
</template>

<script>
import { openToast } from '@/assets/js/tools'
import { mapState } from 'vuex'
import imageCropper from '../components/imageCropper.vue'
export default {
  name: 'createGroup',
  components: {
    imageCropper
  },
  data () {
    return {
      group: {
        nickname: '',
        describe: '',
        avatar: ''
      },
      cropperConfig: {
        width: 1,
        height: 1,
        quality: 0.5,
        maxWidth: 200
      },
      imgData: ''
    }
  },
  computed: mapState(['userInfo']),
  mounted () {

  },
  methods: {
    selectFile () {
      this.$refs.imageCropper.checkPhoto()
    },
    photoCallBack (dataUrl) {
      this.imgData = dataUrl
      this.group.avatar = dataUrl
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
    },
    signUp () {
      let { nickname, describe } = this.group
      if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,12}$/.test(nickname)) {
        openToast({
          msg: '群名字由3-12个字母，数字，下划线组成',
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
      this.uploadImg(path => {
        let avatar = path
        if (!path) avatar = ''
        let info = {
          nickname,
          describe,
          avatar,
          creator: this.userInfo._id
        }
        this.$socketEmiter('createGroup', info).then(data => {
          openToast({
            msg: '创建成功',
            duration: 1500
          })
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/config.scss';
.icon-head{
  margin-top:1.5rem;
  margin-bottom:.5rem;
  width:2rem;
  height:2rem;
  overflow: hidden;
  border-radius:50%;
  background-color:#DDD;
  .mask-head{
    background-color:rgba(0,0,0,.2);
  }
  .icon-upload{
    width:.8rem;
    height:.8rem;
  }
}
textarea{
  border:1px solid $themeColor;
  width:5rem;
  outline: none;
  font-size:.36rem;
}
input, .submit{
  display:block;
  width:5rem;
  height:.75rem;
  border-radius: .75rem;
  font-size:.36rem;
  text-align: center;
  margin-bottom:.3rem;
  background-color:#FFF;
  border:1px solid $themeColor;
  outline: none;
  color:#666;
  &.email{
    margin-top:3.6rem;
  }
  &.submit{
    color:#FFF;
    background-color:$themeColor;
    line-height:.75rem;
    margin-top:.5rem;
  }
}
</style>
