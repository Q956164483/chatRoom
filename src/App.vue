<template>
  <div id="app">
    <loading v-if="isLoading"></loading>
    <push @hidePush="pushContent = false" v-if="pushContent" :content="pushContent"></push>
    <transition :name="routerAni">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
// import { popup, openToast, openLoading, closeLoading } from './js/tools'
import loading from '@/components/loading'
import push from '@/components/push'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    loading,
    push
  },
  computed: mapState(['isLoading', 'routerAni']),
  data () {
    return {
      pushContent: false
    }
  },
  mounted () {
    this.initSocketListener()
  },
  methods: {
    initSocketListener () {
      const socket = this.$socket
      socket.on('new message', data => {
        this.messageController(data)
      })
      socket.on('coin update', data => {
        console.log(data)
        this.pushContent = data.data
        setTimeout(() => {
          this.pushContent = false
        }, 3550)
      })
      socket.on('offline', data => {
        console.log(`------------${data.nickname}下线了------------`)
      })
      socket.on('online', data => {
        console.log(`------------${data.nickname}上线------------`)
      })
    },
    messageController (data) {
      // console.log('new message >>> ', data)
      // if (data.to === this.nowRoom._id) {
      this.$store.state.nowRoomMsgList.push(data)
      this.$store.commit('receiveNews', data)
      // }
      // this.$store.state.groupList.map(item => {
      //   if (item._id === data.to) {
      //     item.lastWord = data.content
      //     item.lastWordSender = data.from.nickname
      //     item.lastWordTime = data.from.createAt
      //   }
      // })
    }
  },
  watch: {
    '$route' (to, from) {
      const toPathLen = to.path.length
      const fromPathLen = from.path.length
      let routerAni = toPathLen < fromPathLen ? 'slide-right' : 'slide-left'
      this.$store.commit('routerAni', routerAni)
    }
  }
}
</script>

<style lang="scss">
@import './assets/css/config';
#app{
  position: relative;
  width:100%;
  height:100%;
}
.router-view{
  position: fixed;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background-color:$bgColor;
  transition: opacity .33s, transform .33s cubic-bezier(0.25,0.1,0.25,1);
}
.slide-left-enter{
  opacity:.5;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity:0;
  transform: translate3d(-33%, 0, 0);
}
.slide-right-enter {
  opacity:.5;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity:0;
  transform: translate3d(33%, 0, 0);
}
</style>
