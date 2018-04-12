<template>
  <div class="mct-wrap">
    <div class="mct-box">
      <v-scroll ref="scrollview" v-if="!pageData.noData" :loadMore="false" :bounce="false">
        <div slot="defaultScroll" class="mct-scroll">
          <div class="mct-item" v-for="item in pageData.commentsArr">
            <div class="mct-info">
              <div class="mct-avator"><img :src="personInfo.headimgurl"></div>
              <div class="mct-text">
                <div class="text-wrap">
                  <h3>{{personInfo.username}}</h3>
                  <p>{{getSendTime(item.time.current_time, item.time.time)}}</p>
                </div>
              </div>
            </div>
            <div class="mct-content">
              <h3>{{item.detail}}</h3>
              <p>-- {{pageData.commentsTitle}}</p>
            </div>
          </div>
        </div>
      </v-scroll>
      <div class="no-data" v-else>-- 暂无评论 --</div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scrollView';
  import {locationMyComment} from 'mock/getMocks';
  import {mapState} from 'vuex';
  export default {
    name: 'my-comments',
    data () {
      return {
        pageData: {
          commentsArr: [],
          commentsTitle: '',
          noData: !1
        }
      };
    },
    created () {
      this.init();
    },
    computed: {
      ...mapState(['personInfo'])
    },
    methods: {
      init () {
        this.getMycomments();
      },
      async getMycomments () {
        let query = this.$route.query;
        let noteId = query.noteId;
        this.pageData.commentsTitle = query.tnname;
        try {
          let tnCommentsResp = await locationMyComment({
            noteId: noteId
          });
          this.pageData.commentsArr = tnCommentsResp.data.data;
          // 判断是否noData
          this.pageData.noData = !this.pageData.commentsArr.length;
          this.$nextTick(() => {
            this.$refs.scrollview && this.$refs.scrollview.refresh();
          });
        } catch (e) {
          this.pageData.noData = !0;
        }
      },
      getSendTime (c, t) {
        let sendTime = parseInt(c - t);
        console.log(sendTime);
        let sendTimeString = '';
        let defaultDate = new Date(parseInt(t));
        sendTimeString = this.patchDate(defaultDate);
        sendTime < 6e4 && (sendTimeString = parseInt(sendTime / 1000) + '秒前');
        sendTime >= 6e4 && sendTime < 36e5 && (sendTimeString = parseInt(sendTime / 6e4) + '分钟前');
        sendTime >= 36e5 && sendTime < 24 * 36e5 && (sendTimeString = parseInt(sendTime / 36e5) + '小时前');
        return sendTimeString;
      },
      patchDate (d) {
        let formatDate = d.getFullYear() + '-' + this.patchZero(parseInt(d.getMonth() + 1)) + '-' + this.patchZero(d.getDate()) + ' ' + this.patchZero(d.getHours()) + ':' + this.patchZero(d.getMinutes());
        return formatDate;
      },
      patchZero (d) {
        let r = '';
        r = d < 10 ? ('0' + d.toString()) : d;
        return r;
      }
    },
    components: {
      'v-scroll': Scroll
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../../assets/stylus/mixin.styl';
  .mct-wrap
    padding px2rem(34)
    width 100%
    height 100%
    .mct-box
      position relative
      width 100%
      height 100%
      overflow hidden
      background-color #fff
      border-radius px2rem(10)
      .mct-scroll
        padding px2rem(30)
        .mct-item
          width 100%
          padding px2rem(20) 0
          border-bottom px2rem(1) dashed #ccc
          &.mct-item:last-child
            border-bottom none
          .mct-info
            display flex
            .mct-avator
              flex 0 0 px2rem(94)
              width px2rem(94)
              height px2rem(94)
              border-radius 50%
              overflow hidden
              border px2rem(2) solid #ccc
              & img
                width 100%
                height 100%
                display block
            .mct-text
              margin-left px2rem(20)
              display flex
              align-items center
              flex 1
              height px2rem(94)
              font-size px2rem(28)
              & h3
                height px2rem(40)
                line-height px2rem(40)
              & p
                height px2rem(40)
                line-height px2rem(40)
                font-size px2rem(20)
          .mct-content
            width 100%
            text-align justify
            font-size px2rem(28)
            margin-top px2rem(30)
            & h3
              line-height px2rem(36)
            & p
              font-size px2rem(24)
              color #ccc
              height px2rem(50)
              line-height px2rem(50)
</style>
