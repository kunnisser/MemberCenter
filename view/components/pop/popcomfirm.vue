<template>
    <div class="confirm-wrap" v-show="openVisible">
      <div class="confirm-mask"></div>
      <div class="confirm-container">
        <h3>提示</h3>
        <div class="confirm-box">
          <slot name="tipscf"></slot>
        </div>
        <div class="box-btn">
          <div class="btn-cancel" @click.prevent.stop="closeTips(false)">取消</div>
          <div class="btn-ok" @click.prevent.stop="closeTips(true)">确定</div>
        </div>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
      name: 'popconfirm',
      data () {
        return {
        };
      },
      props: {
        open: {
          type: Boolean,
          default: !1
        }
      },
      computed: {
        openVisible () {
          return this.open;
        }
      },
      methods: {
        closeTips (f) {
          // 注册触发父组件对应的closetips事件，并传递！1
          this.$emit('close', f);
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .confirm-wrap
    width 100%
    height 100%
    position absolute
    top 0
    left 0
    z-index 999
    font-size px2rem(30)
    display flex
    justify-content center
    align-items center
    .confirm-mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      background-color rgba(0,0,0,0.7)
    .confirm-container
      position relative
      z-index 9
      width px2rem(400)
      background-color #00a0e9
      & h3
        color #fff
        padding px2rem(20)
        border-bottom px2rem(1) dotted #fff
      .confirm-box
        width 100%
        min-height px2rem(80)
        padding px2rem(20)
        & div
          width 100%
          & p
            width 100%
            text-align justify
            color #fff
            line-height px2rem(40)
      .box-btn
        width 100%
        height px2rem(80)
        display flex
        border-top px2rem(1) solid #fff
        &>div
          flex 1
          text-align center
          line-height px2rem(80)
          color #fff
        .btn-cancel
          background-color #5e7382
        .btn-ok
          background-color #8fbc8f
</style>
