<template>
  <div @click="hidePush" class="container">
    <div class="message">{{content}}</div>
  </div>
</template>

<script>

export default {
  name: 'push',
  props: {
    content: {
      type: String,
      default () {
        return ''
      }
    }
  },
  methods: {
    hidePush () {
      this.$emit('hidePush')
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: fixed;
  z-index:8;
  top:1%;
  left:2%;
  width:96%;
  border-radius:.2rem;
  background-color:#FFF;
  color:#000;
  animation: move 3.6s linear;
  .message{
    text-align: center;
    line-height:1rem;
    width:100%;
    font-size:.33rem;
  }
}
@keyframes move {
  0%{
    opacity: 0;
    transform: translateY(-1.5rem)
  }
  10%{
    opacity: 1;
    transform: translateY(0)
  }
  90%{
    opacity: 1;
    transform: translateY(0)
  }
  100%{
    opacity: 0;
    transform: translateY(-1.5rem)
  }
}
</style>
