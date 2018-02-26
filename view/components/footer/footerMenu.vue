<template>
  <div class="footer-nav">
    <div class="footer-bg"></div>
    <div class="ftnav-wrap">
      <div class="nav-item" v-for="(item, index) in menu" :class="activeIndex === index && 'active'">
        <div class="item-wrap">
          <div class="item-frame" @click="linkNav(item.path)">
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
            path: 'mall',
            icon: 'nav-shop'

          },
          {
            name: '会员社区',
            path: 'zone',
            icon: 'nav-comments'
          },
          {
            name: '首页',
            path: 'home',
            icon: 'nav-home'
          },

          {
            name: '会员日',
            path: 'md',
            icon: 'nav-cake'
          },
          {
            name: '我的订单',
            path: '/uc/myorder',
            icon: 'nav-text'
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
    height px2rem(140)
    color #000
    justify-content center
    align-items flex-end
    .footer-bg
      position absolute
      bottom 0
      z-index 9
      width px2rem(704)
      height px2rem(68)
      background url("../../assets/image/footer-bg.png") no-repeat
      background-size 100% 100%
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
        margin-top px2rem(-80)
        .item-frame
          width px2rem(92)
          height px2rem(92)
          background url("../../assets/image/navframe.png") no-repeat
          background-size 100% 100%
          & i
            width 100%
            height 100%
            display block
          .nav-shop
            background url("../../assets/image/nav-shop.png") center no-repeat
            background-size 80%
          .nav-comments
            background url("../../assets/image/nav-comments.png") center no-repeat
            background-size 80%
          .nav-home
            background url("../../assets/image/nav-home.png") center no-repeat
            background-size 120%
          .nav-cake
            background url("../../assets/image/nav-cake.png") center no-repeat
            background-size 60%
          .nav-text
            background url("../../assets/image/nav-text.png") center no-repeat
            background-size 60%
        & b
          display block
          font-size px2rem(22)
          padding px2rem(10) 0
          font-weight bold
          -webkit-text-stroke px2rem(1) #003366
          color #fff
      .active
        .item-frame
          background url("../../assets/image/navframeactive.png") no-repeat
          background-size 100% 100%
</style>
