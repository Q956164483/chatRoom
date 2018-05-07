<template>
  <div>
    <div class="box box-ver w-p100 h-p100">
      <div @click="$router.go(-1)"  class="header box box-ac">
        <div class="icon icon-back"></div>
        <div class="box-f1 tx-c">搜索</div>
      </div>
      <div class="search box box-ac">
        <div class="icon icon-serach"></div>
        <input v-model="keyword" class="box box-f1" placeholder="搜索" type="text">
      </div>
      <div class="search-list box-ver box-f1 of-y-s">
        <div @click="seeGroupDetail(value)" v-for="(value, key) in searchList" :value="value" :key="key" class="group-item box">
          <div :style="{'background-image':`url(${getHeadImg(value.avatar, 1)})`}" class="icon icon-head"></div>
          <div class="box-f1 box box-ver">
            <div class="box">
              <div class="nickname box-f1 ell">{{value.nickname || ''}}</div>
            </div>
            <div class="box-f1"></div>
            <div class="last-word ell">{{value.describe}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getHeadImg } from '@/assets/js/common'
export default {
  name: 'searchChat',
  data () {
    return {
      searchList: [],
      seacchTimer: null,
      keyword: ''
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  mounted () {
    this.keyword = sessionStorage.getItem('searchChatkeyword') || ''
  },
  watch: {
    keyword (oldVal, curVal) {
      if (this.seacchTimer) clearTimeout(this.seacchTimer)
      this.seacchTimer = setTimeout(() => {
        sessionStorage.setItem('searchChatkeyword', this.keyword)
        this.searchGroup()
      }, 666)
    }
  },
  methods: {
    getHeadImg (avatar) {
      return getHeadImg(avatar)
    },
    seeGroupDetail (value) {
      this.$router.push({
        path: '/chatRoomDetail',
        query: {
          _id: value._id
        }
      })
    },
    searchGroup () {
      let info = {
        keyword: this.keyword
      }
      this.$socketEmiter('searchGroup', info).then(data => {
        this.searchList = data
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
.icon-head{
  margin-left:.15rem;
  width:.8rem;
  height:.8rem;
  border-radius:50%;
  background-color:#EEE;
}

.group-item{
  padding:.15rem;
  border-bottom:1px solid $borderColor;;
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
