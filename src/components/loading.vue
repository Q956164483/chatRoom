<template>
  <div class="container mask-full">
    <div class="content box box-ac box-jc">
      <img class="loading-img" :src="loadingImg" alt="">
    </div>
  </div>
</template>

<script>

export default {
  name: 'loading',
  data () {
    return {
      loadingImg: require('../assets/images/loading-spin.svg')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  .content{
    height:100%;
    width:100%;
  }
}
.loading-img{
  display: block;
  width:.8rem;
  height:.8rem;
}
</style>
