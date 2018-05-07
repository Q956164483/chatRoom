<template>
  <div @click="hideMenu()" class="container mask-full">
    <div class="menu animated fadeIn">
      <div @click="handleClick(key)" v-for="(value, key) in menuList" :value="value" :key="key" class="menu-item box box-ac">
        <div :class="value.icon" class="icon"></div>
        <div>{{value.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'menuMore',
  data () {
    return {
      menuList: [
        {
          icon: 'icon-movie',
          name: '看电影'
        },
        {
          icon: 'icon-robot',
          name: '图灵机器人'
        },
        {
          icon: 'icon-add-group',
          name: '创建群聊'
        },
        {
          icon: 'icon-add-group',
          name: '添加群组'
        },
        {
          icon: 'icon-movie',
          name: '搜电影'
        }
      ]
    }
  },
  methods: {
    handleClick (key) {
      if (key === 0) {
        this.$router.push('/movie')
      } else if (key === 1) {
        this.$router.push('/chatRobot')
      } else if (key === 2) {
        this.$router.push('/createGroup')
      } else if (key === 3) {
        this.$router.push('/searchChat')
      } else if (key === 5) {
        this.$router.push('/movie/search')
      }
    },
    hideMenu () {
      this.$emit('hideMenu')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/config.scss';
@import '../assets/css/mixins.scss';
$menuColor:#FFF;
.mask-full{
  background-color:rgba(0,0,0,0.08);
  .menu{
    position: absolute;
    background-color:$menuColor;
    font-size:.32rem;
    border-radius:.2rem;
    right:.1rem;
    top:1rem;
    &:before{
      position: absolute;
      top:-.145rem;
      right:.2rem;
      width: 0;
      height: 0;
      display:block;
      content:'';
      border-left: .15rem solid transparent;
      border-right: .15rem solid transparent;
      border-bottom: .15rem solid $menuColor;
    }
  }
}
.icon-movie{
  background-image:url('../assets/images/icon-movie.svg')
}
.icon-chat{
  background-image:url('../assets/images/icon-chat.svg')
}
.icon-acution{
  background-image:url('../assets/images/icon-acution.svg')
}
.icon-add-group{
  background-image:url('../assets/images/icon-add-group.svg')
}
.icon-robot{
  background-image:url('../assets/images/icon-robot.svg')
}
.menu-item{
  padding:.3rem;
  border-bottom:1px solid #DDD;
  .icon{
    margin-right:.1rem;
    width:.36rem;
    height:.36rem;
  }
}
</style>
