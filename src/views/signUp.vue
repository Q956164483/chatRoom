<template>
  <div>
    <div class="box  box-ac box-ver">
      <input v-model="user.email" class="email" placeholder="请输入邮箱"  type="text">
      <input v-model="user.nickname" class="nickname" placeholder="请输入昵称"  type="text">
      <input v-model="user.password" class="password" placeholder="请输入密码" type="password">
      <div @click="signUp" class="submit">注册</div>
    </div>
  </div>
</template>

<script>
import { openToast } from '@/assets/js/tools'
export default {
  name: 'login',
  data () {
    return {
      user: {
        nickname: '',
        email: '',
        password: ''
      }
    }
  },
  mounted () {

  },
  methods: {
    signUp () {
      let _this = this
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.user.email)) {
        openToast({
          msg: '邮箱格式错误',
          duration: 1500
        })
        return
      }
      if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,12}$/.test(this.user.password)) {
        openToast({
          msg: '昵称由3-12个字母，数字，下划线组成',
          duration: 1500
        })
        return
      }
      if (!/^(\w){6,20}$/.test(this.user.password)) {
        openToast({
          msg: '密码由6-20个字母，数字，下划线组成',
          duration: 1500
        })
        return
      }
      this.$socketEmiter('signUp', this.user).then(data => {
        this.$store.commit('userInfo', _this.user)
        this.$router.replace({
          path: '/login',
          query: { autoLogin: 1 }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/config.scss';
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
