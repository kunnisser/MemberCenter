<template>
  <div class="uc-nav">
    <div v-for="(item, index) in navData" :class="'uc-nav-item ' + (index===navIndex ? 'active' : '')"
         @click.prevent.stop="linkNav(item.type, index)">
        {{item.name}}
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
    export default {
      name: 'topnav-com',
      data () {
        return {
        };
      },
      props: {
        navIndex: {
          type: Number,
          default: 0
        },
        navData: {
          type: Array,
          default: []
        }
      },
      methods: {
        linkNav (type, index) {
          this.$emit('linkNav', [type, index]);
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
/* uc-nav */
.uc-nav
  display flex
  color #fff
  font-size px2rem(30)
  .uc-nav-item
    cursor pointer
    height px2rem(76)
    line-height px2rem(76)
    text-align center
    flex 1
    overflow hidden
    background-image linear-gradient(to bottom, #fff000, #ff7b00)
    box-shadow 0 px2rem(8) px2rem(6) #a64b18
    font-weight bold
    -webkit-text-stroke px2rem(2) #b33600
  .uc-nav-item:first-child
    border-top-left-radius px2rem(12)
    border-bottom-left-radius px2rem(12)
  .uc-nav-item:last-child
    border-top-right-radius px2rem(12)
    border-bottom-right-radius px2rem(12)
  .active
    background-image linear-gradient(to bottom, #b9ed00, #089e1e)
    box-shadow 0 px2rem(8) px2rem(6) #0c7b4e
    -webkit-text-stroke px2rem(2) #005600
</style>
