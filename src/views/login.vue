<template>
  <div>
    <div class="box  box-ac box-ver">
      <input v-model="userInfo.email" class="email" placeholder="请输入邮箱"  type="text">
      <input v-model="userInfo.password" class="password" placeholder="请输入密码" type="password">
      <div @click="login" class="submit">登陆</div>
      <div @click="$router.replace('/signUp')" class="signUp submit">注册</div>
    </div>
  </div>
</template>

<script>
import { openToast } from '@/assets/js/tools'
export default {
  name: 'login',
  data () {
    return {
      userInfo: {
        email: '',
        password: '',
        avatar: require('../assets/images/icon-head-default.jpg')
      }
    }
  },
  mounted () {
    let query = this.$route.query
    if (query.autoLogin === 1) {
      this.$store.commit('isLoading', true)
      setTimeout(() => {
        this.userInfo.email = this.$store.state.userInfo.email
        this.userInfo.password = this.$store.state.userInfo.password
        this.login()
        this.$store.commit('isLoading', false)
      }, 333)
    }
  },
  methods: {
    login () {
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.userInfo.email)) {
        openToast({
          msg: '邮箱格式错误',
          duration: 1500
        })
        return
      }
      if (!this.userInfo.password) {
        openToast({
          msg: '请输入密码',
          duration: 1500
        })
        return
      }
      this.$socketEmiter('login', this.userInfo).then(data => {
        data.user.avatar = data.user.avatar ? data.user.avatar : this.userInfo.avatar
        this.$store.commit('userInfo', data.user)
        this.$store.commit('hasLogin', 1)
        this.$router.replace('/')
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
    &.signUp{
      color:$themeColor;
      background-color:#FFF;
    }
  }
}
</style>
