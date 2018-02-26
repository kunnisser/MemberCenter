<template>
  <v-mdlist :fetchApi="fetchApi" @getApiData="dispatchData">
    <div class="share-scroll" slot="mdscroll">
      <div class="share-title">共10篇文章，我已分享了<span>2</span>篇</div>
      <div class="scroll-item" v-for="item in listData">
        <div class="flex-wrap">
          <div class="flex-header" :style="'background-image:url(' + item.thumbpic + '); background-size:cover; background-repeat: no-repeat;'"></div>
          <div class="flex-content">
            <h3>{{item.tnname}}</h3>
            <p>
              <span>阅读{{item.readnum}}</span>
              <span><i class="icon-thumbs-up red"></i>{{item.thumbnum}}</span>
              <span><i class="icon-database red"></i>{{item.catchscore}}</span>
            </p>
            <div class="flex-bar">{{item.sendtime}}<div :class="'show-comments ' + (item.shared ? 'shared': '')">
              <i class="icon-share-alternitive"></i><span>立即分享</span>
            </div></div>
          </div>
        </div>
      </div>
    </div>
  </v-mdlist>
</template>
<script type="text/ecmascript-6">
  import MdList from '../mdlist/mdList';
  import {getShareTn} from 'mock/getMocks';
    export default {
      name: 'shareDay',
      data () {
        return {
          fetchApi: null,
          listData: []
        };
      },
      created () {
        this.fetchApi = getShareTn;
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
    .flex-wrap
      width 100%
      display flex
      .flex-header
        width px2rem(190)
        flex 0 0 px2rem(190)
        height px2rem(166)
      .flex-content
        flex 1
        margin-left px2rem(36)
        & h3
          width 100%
          height px2rem(48)
          line-height px2rem(48)
          font-size px2rem(28)
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        & p
          height px2rem(80)
          line-height px2rem(80)
          font-size px2rem(20)
          color #474747
          & span
            margin-right px2rem(60)
            & i
              color #474747
              margin-right px2rem(10)
            .red
              color #ffa222
          & span:last-child
            margin-right 0
        .flex-bar
          height px2rem(40)
          line-height px2rem(40)
          position relative
          width 100%
          font-size px2rem(20)
          .show-comments
            position absolute
            right 0
            top 0
            width px2rem(140)
            background-image linear-gradient(to bottom, #efe762, #dc6a04)
            border-radius px2rem(32)
            height px2rem(40)
            line-height px2rem(30)
            border px2rem(2) solid #b35900
            text-align center
            color #fff
            cursor pointer
            & i
              vertical-align middle
              color #fff
              margin-right px2rem(4)
              font-size px2rem(20)
            & span
              vertical-align middle
              font-size px2rem(20)
           & .shared
            border px2rem(2) solid #d3d3d3
            background-image linear-gradient(to bottom, #f3f3f3, #dbdbdb)
</style>
