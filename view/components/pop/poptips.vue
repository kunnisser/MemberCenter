<template>
    <div :class="'tips-wrap '+ popType" v-show="openVisible">
      <div class="mask" @click.prevent.stop="closeTips" :style="'background-color:rgba(0,0,0,'+ opacity +');'"></div>
      <div class="meswrap">
        <slot name="tipmes">
        </slot>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
      name: 'tips',
      data () {
        return {
        };
      },
      props: {
        popType: {
          type: String,
          default: 'center'
        },
        open: {
          type: Boolean,
          default: !1
        },
        delay: {
          type: Boolean,
          default: !1
        },
        opacity: {
          type: Number,
          default: 0.4
        }
      },
      computed: {
        openVisible () {
          this.delay && this.open && setTimeout(() => {
            this.closeTips();
          }, 800);
          return this.open;
        }
      },
      methods: {
        closeTips () {
          // 注册触发父组件对应的closetips事件，并传递！1
          this.$emit('close', !1);
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .tips-wrap
    position absolute
    width 100%
    height 100%
    left 0
    top 0
    z-index 999
    display flex
    .mask
      position absolute
      width 100%
      height 100%
      left 0
      top 0
    &.center
      justify-content center
      align-items center
      .meswrap
        & .default
          min-width px2rem(400)
          height px2rem(100)
          line-height px2rem(92)
          border-radius px2rem(10)
          background-color #00abd7
          border px2rem(4) solid #fff
          animation jackInTheBox 500ms
          text-align center
          &.warning
            background-color #e64242
    &.top
      justify-content center
      align-items flex-start
      .meswrap
        & .default
          width px2rem(750)
          height px2rem(100)
          line-height px2rem(100)
          background-color rgba(94,115,130,0.9)
          border-bottom px2rem(4) solid #fff
          animation slideInDown 500ms
          text-align center
    .meswrap
      position relative
      z-index 9999
      font-size px2rem(26)
      color #fff

  @keyframes jackInTheBox {
    from {
      opacity: 0;
      transform: scale(0.1) rotate(30deg);
      transform-origin: center bottom;
    }

    50% {
      transform: rotate(-10deg);
    }

    70% {
      transform: rotate(3deg);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideInDown {
    from {
      transform: translate3d(0, -100%, 0);
      visibility: visible;
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }
</style>
