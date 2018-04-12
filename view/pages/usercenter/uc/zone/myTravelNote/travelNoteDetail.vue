<template>
    <div class="tn-container">
        <v-scroll ref="tnScroll" :bounce="false">
          <div slot="defaultScroll">
            <div class="scroll-container">
              <div class="tn-wrap">
                <header>
                  <h2>{{pageData.article.title}}</h2>
                  <h3>
                    <span>{{pageData.article.author}}</span><span class="hd-ml40">{{pageData.article.timestamp}}发布</span>
                    <div class="tip-bar">
                      <div class="tip-thumbup">
                        <i class="icon-thumbs-up2"></i><span>{{pageData.article.thumbupnum}}</span>
                      </div>
                      <div class="tip-comment hd-ml40">
                        <i class="icon-chat-3"></i>
                        <span>{{pageData.article.comments}}</span>
                      </div>
                    </div>
                  </h3>
                </header>
                <article v-html="pageData.article.richtext" id="watchImages"></article>
                <div class="article-end">
                  <hr/>
                  <span>END</span>
                </div>
              </div>
              <div class="tn-wrap">
                <div class="comment-header">
                  <i class="icon-comments-o"></i>
                  <strong>全部评论</strong>
                  <span>({{pageData.article.comments}})</span>
                </div>
                <div class="comment-list" v-if="pageData.commentList.length">
                  <div v-for="item in pageData.commentList" class="comment-item">
                    <div class="comment-avator">
                      <img :src="item.avator">
                    </div>
                    <div class="comment-text">
                      <p><span>{{item.commentator}} :</span>{{item.comtext}}</p>
                      <div class="comment-time">
                        {{getSendTime(item.current_time, item.sendtime)}}
                      </div>
                    </div>
                  </div>
                  <div class="loadMoreComments" v-show="pageData.loadMoreVisible" @click.prevent.stop="loadComments">{{pageData.commentmes}}<i class="icon-chevron-thin-down"></i></div>
                </div>
                <div class="comment-list" v-else>
                  <div class="comment-none">-- 暂无评论 --</div>
                </div>
                <div class="comment-button">
                  <div class="btn-border" @click.prevent.stop="linkComment"><span>说点什么...</span></div>
                </div>
              </div>
            </div>
          </div>
        </v-scroll>
    </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from '../../../../../components/scroll/scrollView';
  import {getTnDetail, getTnComment} from '../../../../../mock/getMocks';
  import ImagesLoaded from 'imagesloaded';
    export default {
      name: 'tn-detail',
      data () {
        return {
          pageData: {
            id: '',
            article: {},
            commentPage: 1,
            commentList: [],
            currentComment: [],
            commentmes: '',
            loadMoreVisible: !0
          }
        };
      },
      created () {
        this.init();
      },
      methods: {
        init () {
          this.pageData.commentmes = '加载更多';
          this.pageData.id = this.$route.query.id;
          this.getTnDetail(this.pageData.id);
        },
        async getTnDetail (id) {
          let article = await getTnDetail({
            id: id
          });
          this.pageData.article = article.data;
          this.getTnComment(this.pageData.id);
        },
        async getTnComment (id) {
          let comment = await getTnComment({
            id: id,
            pageNow: this.pageData.commentPage,
            pageSize: 3
          });
          this.pageData.currentComment = comment.data.data;
          this.pageData.currentComment.length === 0 && (this.pageData.loadMoreVisible = !1);
          this.pageData.commentList = this.pageData.commentList.concat(this.pageData.currentComment);
          this.$nextTick(() => {
            ImagesLoaded(document.querySelector('#watchImages'), () => {
              this.$refs.tnScroll.refresh();
            });
          });
        },
        loadComments (e) {
          if (!e._constructed) {
            return;
          }
          this.pageData.commentPage++;
          this.getTnComment(this.pageData.id);
        },
        getSendTime (c, t) {
          let sendTime = parseInt(c - t);
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
        },
        linkComment (e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path: 'editcomments',
            query: {
              id: this.pageData.id
            }
          });
        }
      },
      components: {
        'v-scroll': Scroll
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../../assets/stylus/mixin.styl';
  .tn-container
    width 100%
    height 100%
    position relative
    .scroll-container
      padding px2rem(24)
      .tn-wrap
        width 100%
        padding px2rem(40)
        background-color #fff
        border-radius px2rem(10)
        overflow hidden
        box-shadow 0 0 px2rem(4) rgba(0,0,0,0.6)
        color #474747
        margin-bottom px2rem(20)
        &.tn-wrap:last-child
          margin-bottom 0
        & header
          padding-bottom px2rem(22)
          border-bottom px2rem(1) solid #ccc
          & h2
            font-size px2rem(30)
            text-align center
          & h3
            margin-top px2rem(50)
            font-size px2rem(18)
            position relative
            .tip-bar
              position absolute
              display flex
              top 0
              right 0
              & i
                color #b2b2b2
                margin-right px2rem(10)
        & article
          & p
            text-indent 2em
            font-size px2rem(20)
            line-height px2rem(32)
            text-align justify
            padding px2rem(20) 0
          & img
            display block
            width 100%
            margin px2rem(16) 0
        .article-end
          display flex
          width 100%
          height px2rem(30)
          justify-content center
          align-items center
          position relative
          margin-top px2rem(20)
          & hr
            width 100%
          & span
            position absolute
            background-color #fff
            font-size px2rem(20)
            padding 0 px2rem(12)
        .comment-header
          padding-bottom px2rem(24)
          border-bottom px2rem(1) solid #ccc
          line-height px2rem(48)
          & i
            display inline-block
            width px2rem(48)
            height px2rem(48)
            line-height px2rem(48)
            text-align center
            color #fff
            font-size px2rem(28)
            border-radius 50%
            overflow hidden
            background-color #17a1e5
            vertical-align middle
          & strong
            vertical-align middle
            font-size px2rem(30)
            line-height px2rem(48)
          & span
            vertical-align middle
            font-size px2rem(24)
            line-height px2rem(48)
        .comment-list
          font-size px2rem(20)
          .comment-none
            text-align center
            color #7e8c8d
            padding-top px2rem(30)
            box-sizing content-box
            height px2rem(50)
            line-height px2rem(50)
          .comment-item
            display flex
            &.comment-item:first-child
              .comment-text
                border-top none
            .comment-avator
              width px2rem(80)
              padding px2rem(30) 0
              & img
                display block
                width px2rem(54)
                height px2rem(54)
                border-radius 50%
                overflow hidden
            .comment-text
              flex 1
              margin-left px2rem(10)
              padding px2rem(30) 0
              border-top px2rem(1) solid #ccc
              text-align justify
              line-height px2rem(24)
              & span
                color #1574ab
                margin-right px2rem(10)
              .comment-time
                margin-top px2rem(10)
          .loadMoreComments
            font-size px2rem(18)
            color #a3a3a3
            text-align center
            & i
              margin-left px2rem(10)
              color #a3a3a3
        .comment-button
          display flex
          justify-content center
          align-items center
          width 100%
          margin-top px2rem(40)
          font-size px2rem(20)
          height px2rem(90)
          border-radius px2rem(8)
          background-color #eaf0ff
          .btn-border
            width px2rem(540)
            height px2rem(50)
            line-height px2rem(48)
            padding-left px2rem(24)
            border px2rem(1) solid #1574ab
            background-color #fff
            border-radius px2rem(10)
            overflow hidden
</style>
