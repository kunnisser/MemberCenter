<template>
  <v-mdlist :fetchApi="fetchApi" @getApiData="dispatchData">
    <div class="activity-scroll" slot="mdscroll">
      <div class="scroll-item" v-for="item in listData">
        <div class="flex-wrapper">
          <div class="flex-banner">
            <img :src="item.bannerpic">
            <div class="date-tip">
              {{item.validtime}}
            </div>
          </div>
          <div class="active-bar">
            <span>{{item.name}}</span>
            <div :class="'active-btn ' + (item.isoverdue ? 'added': '')"><i class="icon-plus"></i><span>立即参与</span></div>
          </div>
        </div>
      </div>
    </div>
  </v-mdlist>
</template>
<script type="text/ecmascript-6">
  import MdList from '../mdlist/mdList';
  import {getActivity} from 'mock/getMocks';
  export default {
    name: 'activityDay',
    data () {
      return {
        fetchApi: null,
        listData: []
      };
    },
    created () {
      this.$emit('catchIndex', 2);
      this.fetchApi = getActivity;
    },
    methods: {
      dispatchData (d) {
        this.listData = d;
      }
    },
    components: {
      'v-mdlist': MdList
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../view/assets/stylus/mixin.styl';
  .share-title
    width 100%
    padding px2rem(36) 0
    font-size px2rem(26)
    & span
      color #ff9d16
      padding 0 px2rem(6)
  .scroll-item
    width 100%
    padding px2rem(30) 0
    font-size px2rem(24)
    border-bottom px2rem(1) solid #ccc
    &.scroll-item:last-child
      border-bottom none
    .flex-wrapper
      width 100%
      display block
      min-height px2rem(306)
      .flex-banner
        position relative
        width 100%
        & img
          display block
          width 100%
        .date-tip
          width px2rem(108)
          height px2rem(50)
          line-height px2rem(50)
          font-size px2rem(20)
          text-align center
          position absolute
          background-color #e4007f
          top 0
          left px2rem(12)
          color #fff
          &::after
            position absolute
            top px2rem(50)
            left 0
            content ''
            border-top px2rem(20) solid #e4007f
            border-left px2rem(54) solid transparent
            border-right px2rem(54) solid transparent
      .active-bar
        width 100%
        height px2rem(90)
        font-size px2rem(32)
        line-height px2rem(90)
        position relative
        .active-btn
          position absolute
          right 0
          top px2rem(24)
          width px2rem(140)
          background-image linear-gradient(to bottom, #c4ee01, #0ca11b)
          border-radius px2rem(32)
          height px2rem(40)
          line-height px2rem(30)
          border px2rem(2) solid #005600
          text-align center
          color #fff
          cursor pointer
          & i
            vertical-align middle
            color #fff
            margin-right px2rem(4)
            font-size px2rem(20)
            -webkit-text-stroke px2rem(1) #005600
          & span
            vertical-align middle
            font-size px2rem(20)
            font-weight bold
            -webkit-text-stroke px2rem(1) #005600
        & .added
          border px2rem(2) solid #b7b7b7
          background-image linear-gradient(to bottom, #f3f3f3, #b7b7b7)
          & i,& span
            -webkit-text-stroke px2rem(1) #b7b7b7

</style>
