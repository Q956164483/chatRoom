<template>
  <div>
    <div class="box box-ver w-p100 h-p100">
      <div @click="$router.go(-1)" class="icon icon-back"></div>
      <div :style="{'background-image':`url(${getHeadImg(userInfo.avatar)})`}" class="user-bg icon">
      </div>
      <div class="user-info box box-ver box-ac">
        <div :style="{'background-image':`url(${getHeadImg(userInfo.avatar)})`}" class="icon icon-head">
        </div>
        <div v-text="userInfo.nickname" class="line nickname tx-c"></div>
        <div v-text="'位置：' + userInfo.place" class="line nickname tx-c"></div>
        <div v-text="'性别：' + userInfo.sex" readonly class="line tx-c"></div>
        <div @click="enterRoom()" class="submit">私聊</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHeadImg } from '@/assets/js/common'
import { mapState } from 'vuex'
export default {
  name: 'userInfoOthers',
  data () {
    return {
      userInfo: {}
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getHeadImg (avatar) {
      return getHeadImg(avatar)
    },
    enterRoom () {
      let nowPrivate = {
        _id: this.userInfo._id,
        nickname: this.userInfo.nickname,
        type: 'private'
      }
      this.$store.commit('nowPrivate', nowPrivate)
      this.$router.push({
        path: '/chatRoom',
        query: {
          type: 'private'
        }
      })
    },
    getUserInfo () {
      let _id = this.$route.query._id
      this.$http({
        method: 'get',
        url: `${this.$config.apiBase}/api/v0/user/getUserInfo`,
        data: {
          _id: _id
        }
      }).then(res => {
        if (res.status === 1) {
          console.log(res)
          this.userInfo = res.data
        }
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
.line{
  margin-top:.25rem;
  font-size:.36rem;
  color:#EEE;
  height:.66rem;
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
