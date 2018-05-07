<template>
  <div class="playerContainer">
    <iframe class="box" :src="playerLink"></iframe>
  </div>
</template>

<script>

export default {
  name: 'movieDetail',
  data () {
    return {
      playerLink: ''
    }
  },
  mounted () {
    this.playerLink = sessionStorage.getItem('playerLink')
  }
}
</script>

<style lang="scss" scoped>
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
</style>
