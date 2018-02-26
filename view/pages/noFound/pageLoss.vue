<template>
    <div class="nf-view">
      <div class="nf-content">
        <div class="icon-cup"></div>
        <div class="nf-text">--- 您是在访问火星么 ---</div>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
      name: 'pageLoss'
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
    .nf-view
      width 100%
      height 100%
      display flex
      justify-content center
      align-items center
      font-size px2rem(30)
      color #fff
      background-color #5e7382
      z-index 999
      .icon-cup
        font-size px2rem(180)
        text-align center
        color #fff
        margin-bottom px2rem(40)
      .nf-text
        font-size px2rem(28)
</style>
