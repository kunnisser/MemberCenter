<template>
  <div class="uc-share">
    <h3>猜你喜欢</h3>
    <div class="share-wrap" @click="linkout(linkhref)" :style="'background-image:url(' + background + '); background-repeat: no-repeat; background-size: 100% 100%;'">
      <section class="share-text">
        <slot name="share-title"></slot>
        <slot name="share-text"></slot>
      </section>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
    export default {
      name: 'hobby',
      props: {
        background: {
          type: String
        },
        linkhref: {
          type: String
        }
      },
      methods: {
        linkout (path) {
          window.location.href = path;
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .uc-share
    margin-top px2rem(20)
    font-size px2rem(30)
    & h3
      height px2rem(60)
      line-height px2rem(60)
      color #fff
    .share-wrap
      margin-top px2rem(10)
      display flex
      box-sizing border-box
      padding-left px2rem(32)
      width px2rem(700)
      height px2rem(202)
      align-items center
      border-radius px2rem(12)
      overflow hidden
      border px2rem(8) solid #fff
      box-shadow 0 0 px2rem(2) rgba(0,0,0,0.6)
      & h2
        font-size px2rem(42)
        font-weight bold
      & p
        font-size px2rem(28)
        line-height px2rem(50)
        height px2rem(50)
</style>
