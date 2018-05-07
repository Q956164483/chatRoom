<template>
  <div class="container">
    <div class="swiper-container banner">
      <div class="swiper-wrapper">
        <div class="swiper-slide">1</div>
        <div class="swiper-slide">2</div>
        <div class="swiper-slide">3</div>
      </div>
    </div>
    <div class="box box-ver acution-container">
      <div class="box status">
        <div class="desc box-f1">即将开始</div>
        <div class="more">查看更多场次></div>
      </div>
      <div class="desc-chat">
        <div class="left">100名拍卖者正在热聊出价</div>
        <div class="user-list">
          <div class="user-item"></div>
        </div>
      </div>
      <div class="box time-content">
        <div class="time box-f1">12点场</div>
        <div class="timer">距本场开始还有01:30:55</div>
      </div>
      <div class="swiper-container acution-list">
        <div class="swiper-wrapper">
          <div class="swiper-slide">1</div>
          <div class="swiper-slide">2</div>
          <div class="swiper-slide">3</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper/dist/js/swiper'
export default {
  name: 'acution',
  data () {
    return {
      playerLink: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.Swiper = new Swiper('.banner', {
        autoplay: true
      })
    })
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

@import '../assets/css/config.scss';

.banner{
  background-color:#EEE;
  width:100%;
  height:3.8rem !important;
}

.acution-model{
  background-color:#999;
  font-size:.3rem;
  padding:.2rem;
  .status{
    padding-top:.1rem;
    padding-bottom:.1rem;
    .desc{
      color: $themeColor;
    }
  }
}
</style>
