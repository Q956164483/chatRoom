<template>
  <div class="playerContainer">
    <div class="box box-ver h-p100">
      <div @click="$router.go(-1)"  class="header box box-ac">
        <div class="icon icon-back"></div>
        <div class="box-f1 tx-c">搜索</div>
      </div>
      <div class="search box box-ac">
        <div class="icon icon-serach"></div>
        <input v-model="keyword" class="box box-f1" placeholder="搜索" type="text">
      </div>
      <div ref="movieList" class="list w-p100 box-f1 of-y-s">
        <div @click="goDetail(value)" v-lazy:background-image.container="value.poster" v-for="(value,key) in movieList" :value="value" :key="key" class="movie-item bg-img2">
          <div class="title ell">{{value.title}}</div>
        </div>
        <div @click="loadMore()" class="tips-end">{{hasLoadAll ? '已经没有更多了' : '点击加载更多'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { scrollController } from '@/assets/js/common'
export default {
  name: 'movieSearch',
  data () {
    return {
      actIndex: 0,
      page: 1,
      hasLoadAll: false,
      keyword: '',
      movieList: [],
      seacchTimer: null
    }
  },
  mounted () {
    this.initScroll(this.$refs.movieList)
  },
  watch: {
    keyword (oldVal, curVal) {
      if (this.seacchTimer) clearTimeout(this.seacchTimer)
      this.seacchTimer = setTimeout(() => {
        this.page = 1
        this.getMovieList()
      }, 666)
    }
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
    getMovieList () {
      let type = ''
      let page = this.page
      this.$http({
        method: 'get',
        url: `${this.$config.apiBase}/api/v0/movie/list`,
        data: {
          type,
          page,
          keyword: this.keyword,
          pageSize: 20
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

.playerContainer{
  position: absolute !important;
  z-index:2;
  background-color:ivory;
  iframe{
    height:4.2rem;
    width:100%;
    background-color:#000;
    border:none !important;
  }
}

.header{
  width:100%;
  height:.88rem;
  color:#FFF;
  font-size:.32rem;
  background-color:$themeColor;
  font-size:.32rem;
}

.search{
  color:#999;
  background-color:#DDD;
  border-radius:.1rem;
  margin:.15rem auto;
  width:7.3rem;
  height:.6rem;
  .icon-serach{
    width:.5rem;
    height:.5rem;
    margin: 0 .1rem;
  }
  input{
    border:none;
    outline: none;
    background:rgba(0,0,0,0);
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
