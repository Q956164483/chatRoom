<template>
  <div>
    <div class="box box-ver h-p100">
      <div class="swiper-container category">
        <div class="swiper-wrapper">
          <div @click="changeSwiper(key)" class="swiper-slide category-item" :class="{'act': actIndex==key}" v-for="(value,key) in type" :value="value" :key="key">{{value.name}}</div>
        </div>
      </div>
      <div ref="movieList" class="list w-p100 box-f1 of-y-s">
        <div @click="goDetail(value)" v-lazy:background-image.container="value.poster" v-for="(value,key) in movieList" :value="value" :key="key" class="movie-item bg-img2">
          <div class="title ell">{{value.title}}</div>
        </div>
        <div @click="loadMore()" class="tips-end">{{hasLoadAll ? '已经没有更多了' : '点击加载更多'}}</div>
      </div>
    </div>
    <transition :name="$store.state.routerAni">
      <router-view class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>

import Swiper from 'swiper/dist/js/swiper'
import { scrollController } from '@/assets/js/common'

export default {
  name: 'movie',
  data () {
    return {
      Swiper: null,
      actIndex: 0,
      page: 1,
      hasLoadAll: false,
      type: [{
        id: 1,
        name: '自拍'
      }, {
        id: 2,
        name: '伦理片'
      }, {
        id: 3,
        name: '一本道'
      }, {
        id: 4,
        name: 'JAVHD'
      }, {
        id: 5,
        name: '中文字幕'
      }, {
        id: 6,
        name: '东京热'
      }, {
        id: 7,
        name: '亚洲'
      }, {
        id: 8,
        name: '欧美'
      }],
      movieList: []
    }
  },
  mounted () {
    this.getMovieList()
    this.$nextTick(() => {
      this.Swiper = new Swiper('.swiper-container', {
        autoplay: false,
        slidesPerView: 5
      })
      // this.initScroll(this.$refs.movieList)
    })
  },
  methods: {
    initScroll ($el) {
      let _this = this
      scrollController({
        ele: $el,
        delay: 100,
        endCb () {
          _this.page++
          _this.getMovieList()
        }
      })
    },
    loadMore () {
      if (this.hasLoadAll) return
      this.page++
      this.getMovieList()
    },
    changeSwiper (index) {
      if (this.actIndex === index) return
      this.actIndex = index
      this.page = 1
      this.hasLoadAll = false
      // this.Swiper.slideTo(index, 333, false)
      this.getMovieList()
    },
    getMovieList () {
      let type = this.type[this.actIndex].id
      let page = this.page
      this.$http({
        method: 'get',
        url: `${this.$config.apiBase}/api/v0/movie/list`,
        data: {
          type,
          page,
          pageSize: 20,
          keyword: ''
        }
      }).then(res => {
        let data = res.data
        if (this.page === 1) this.movieList = []
        if (data.length === 0) {
          this.hasLoadAll = true
        } else {
          this.movieList = this.movieList.concat(res.data)
        }
      })
    },
    goDetail (item) {
      this.$router.push('/movie/detail')
      sessionStorage.setItem('playerLink', item.oldPlayer)
    }
  }
}
</script>

<style lang="scss" scopedSlots>
@import '../assets/css/config.scss';

.category{
  background-color:#FFF;
  color:#FFF;
  .category-item{
    color:#666;
    font-size:.32rem;
    line-height: .8rem;
    text-align: center;
    &.act{
      color:$themeColor;
      border-bottom:2px solid $themeColor;
    }
  }
}

.movie-item {
  position: relative;
  background-color:#EEE;
  width:100%;
  padding-top:50%;
  margin-bottom:.1rem;
  .title{
    position: absolute;
    bottom:0;
    background-color:rgba(0,0,0,.66);
    padding:.15rem 0;
    color:#FFF;
    width:100%;
    text-indent: .2rem;
    font-size:.3rem;
  }
}

.tips-end{
  border-radius:.08rem;
  border: 1px solid $themeColor;
  font-size:.32rem;
  text-align: center;
  padding: .15rem 0;
  margin: .2rem;
  color: $themeColor
}
</style>
