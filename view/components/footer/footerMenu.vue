<template>
  <div class="footer-nav">
    <div class="footer-bg"></div>
    <div class="ftnav-wrap">
      <div class="nav-item" v-for="(item, index) in menu" :class="activeIndex === index && 'active'">
        <div class="item-wrap">
          <div :class="`item-frame ${item.active_icon}`" @click="linkNav(item.path)">
            <i :class="item.icon"></i>
          </div>
          <b>{{item.name}}</b>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'footer-com',
    data () {
      return {
        menu: [
          {
            name: '积分商城',
            path: '/mall',
            icon: 'nav-shop',
            active_icon: 'nav-shop-sd'
          },
          {
            name: '会员社区',
            path: '/zone',
            icon: 'nav-comments',
            active_icon: 'nav-comments-sd'
          },
          {
            name: '',
            path: '/home',
            icon: 'nav-home',
            active_icon: 'nav-home-sd'
          },
          {
            name: '会员日',
            path: '/md',
            icon: 'nav-cake',
            active_icon: 'nav-cake-sd'
          },
          {
            name: '我的订单',
            path: '/uc/myorder',
            icon: 'nav-text',
            active_icon: 'nav-text-sd'
          }
        ]
      };
    },
    props: {
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      linkNav (path) {
        path === 'zone' && (this.$store.state.zoneIndex = 0);
        this.$router.push({path});
      }
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .footer-nav
    position absolute
    left 0
    bottom 0
    width 100%
    display flex
    font-size px2rem(22)
    height px2rem(190)
    color #000
    justify-content center
    align-items flex-end
    z-index 9999
    .footer-bg
      position absolute
      bottom 0
      z-index 9
      width 100%
      left 0
      height px2rem(90)
      background-color #060d53
      border-top px2rem(6) solid #0f326d
    .ftnav-wrap
      position relative
      z-index 99
      display flex
      width px2rem(700)
      .nav-item
        display flex
        flex 1
        justify-content center
        align-items center
        text-align center
        position relative
        .item-frame
          width px2rem(120)
          height px2rem(150)
          margin 0 auto
          margin-bottom px2rem(10)
          & i
            width 100%
            height 100%
            display block
          .nav-shop
            background url("../../assets/image/nav-shop.png") center no-repeat
            background-size 100%
          .nav-comments
            background url("../../assets/image/nav-comments.png") center no-repeat
            background-size 100%
          .nav-cake
            background url("../../assets/image/nav-cake.png") center no-repeat
            background-size 100%
          .nav-text
            background url("../../assets/image/nav-text.png") center no-repeat
            background-size 100%
        .nav-home-sd
          width px2rem(200)
          height px2rem(180)
          .nav-home
            background url("../../assets/image/nav-home.png") center no-repeat
            background-size 100%
        & b
          width 100%
          display block
          position absolute
          font-size px2rem(22)
          padding-bottom px2rem(20)
          font-weight bold
          -webkit-text-stroke px2rem(1) #003366
          color #fff
          left 0
          bottom px2rem(0)
      .active
        .item-frame
          width px2rem(120)
          height px2rem(150)
          &.nav-shop-sd
            background url("../../assets/image/nav-shop-sd.png") no-repeat
            background-size 100%
          &.nav-cake-sd
            background url("../../assets/image/nav-cake-sd.png") no-repeat
            background-size 100%
          &.nav-comments-sd
            background url("../../assets/image/nav-comments-sd.png") no-repeat
            background-size 100%
          &.nav-text-sd
            background url("../../assets/image/nav-text-sd.png") no-repeat
            background-size 100%
          &.nav-home-sd
            width px2rem(200)
            height px2rem(180)
            background url("../../assets/image/nav-home-sd.png") no-repeat
            background-size 100% 100%
</style>
