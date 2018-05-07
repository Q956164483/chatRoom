<template>
  <div class="box box-ver">
    <div class="header box box-ac">
      <div @click="seeUserInfo()" :style="{'background-image':`url(${getHeadImg(userInfo.avatar)})`}" class="icon icon-head"></div>
      <div class="box-f1 tx-c">消息</div>
      <div @click="showMenu = true" class="icon icon-more"></div>
    </div>
    <menu-more @hideMenu="showMenu = false" v-if="showMenu"></menu-more>
    <div @click="$router.push('/searchChat')" class="search box box-ac">
      <div class="icon icon-serach"></div>
      <span>搜索</span>
    </div>
    <div class="group-list box-f1 of-y-s">
       <div @click="enterRoom(value)" v-for="(value, key) in groupList" :value="value" :key="key" class="group-item box">
         <div :style="{'background-image':`url(${getHeadImg(value.avatar, 1)})`}" class="icon icon-head"></div>
         <div class="box-f1 box box-ver">
           <div class="box">
             <div class="nickname box-f1 ell">{{value.nickname || ''}}</div>
             <div class="time">{{value.lastWordTime | formatDate}}</div>
           </div>
           <div class="box-f1"></div>
           <div class="last-word ell">{{value.lastWordSender ? (value.lastWordSender  + ': ' + value.lastWord) : ''}}</div>
         </div>
       </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import menuMore from '@/components/menuMore.vue'
import { getHeadImg } from '@/assets/js/common'
export default {
  name: 'index',
  components: {
    menuMore
  },
  data () {
    return {
      showMenu: false
    }
  },
  computed: {
    ...mapState(['hasLogin', 'userInfo', 'groupList'])
  },
  mounted () {
    if (!this.userInfo) {
      this.$router.push('/login')
    } else {
      this.autoLogin()
      this.getGroupList()
    }
  },
  methods: {
    getHeadImg (avatar, type) {
      return getHeadImg(avatar, type)
    },
    autoLogin () {
      if (+this.hasLogin === 1) return
      this.$socketEmiter('autoLogin', this.userInfo).then(data => {
        this.$store.commit('userInfo', data)
        this.$store.commit('hasLogin', 1)
      })
    },
    getGroupList () {
      this.$socketEmiter('getGroupList', this.userInfo).then(data => {
        let groupList = data
        groupList.sort((a, b) => {
          return (b.lastWordTime || 0) - (a.lastWordTime || 0)
        })
        this.$store.commit('groupList', groupList)
      })
    },
    enterRoom (room) {
      this.$store.commit('nowGroup', room)
      this.$router.push({
        path: '/chatRoom',
        query: {
          type: 'group'
        }
      })
    },
    seeUserInfo () {
      this.$router.push({
        path: '/userInfo'
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
  font-size:.32rem;
  .icon{
    width:.66rem;
    height:.66rem;
  }
  .icon-more{
    width:.6rem;
    height:.6rem;
    margin-right:.15rem;
    background-image:url('../assets/images/icon-more.svg')
  }
}

.search{
  color:#999;
  background-color:#EAEAEA;
  border-radius:.1rem;
  margin:.15rem auto;
  width:7.3rem;
  height:.6rem;
  .icon-serach{
    width:.5rem;
    height:.5rem;
    margin: 0 .1rem;
  }
}
.icon-head{
  margin-left:.15rem;
  width:.8rem;
  height:.8rem;
  border-radius:50%;
  background-color:#EEE;
}

.group-item{
  padding:.15rem;
  border-bottom:1px solid $borderColor;
  background-color:#FFF;
  .icon-head{
    border-radius:.1rem;
    margin-right:.1rem;
    margin-left:0;
  }
  .last-word{
    width:6rem;
    color:#666;
    font-size:.28rem;
  }
}
</style>
