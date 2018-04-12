<template>
    <div class="md-wrap">
      <v-topnav :navIndex="pageData.navIndex" :navData="pageData.navData" @linkNav="linkNav"></v-topnav>
      <div class="sd-wrap" v-show="this.pageData.currentTab === 'shareday'">
        <v-mdlist ref="shareday" :fetchApi="fetchApi" @getApiData="dispatchData">
          <div class="share-scroll" slot="mdscroll">
            <div class="share-title">共{{total}}篇文章，我已分享了<span>{{num}}</span>篇</div>
            <div class="scroll-item" v-for="item in listData[0].list">
              <div class="flex-wrap" @click.prevent.stop="linkOut(item.url, item.url)">
                <div class="flex-header" :style="'background-image:url(' + JSON.parse(item.content).news_item[0].thumb_url + '); background-size:cover; background-repeat: no-repeat;'"></div>
                <div class="flex-content">
                  <h3>{{JSON.parse(item.content).news_item[0].title}}</h3>
                  <p>
                    <span><i class="icon-database red"></i>{{share_score}}</span>
                  </p>
                  <div class="flex-bar">{{getSendTime(new Date().getTime(), item.update_time * 1000)}}<div :class="'show-comments ' + (item.haveShared === 'haved' ? 'shared': '')" @click.prevent.stop="share(item.haveShared, item.media_id, item.content, $event)">
                    <i class="icon-share-alternitive"></i><span>立即分享</span>
                  </div></div>
                </div>
              </div>
            </div>
          </div>
        </v-mdlist>
      </div>
      <div class="ad-wrap" v-show="this.pageData.currentTab === 'activityday'">
        <v-mdlist ref="activityday" :fetchApi="fetchApiC" @getApiData="dispatchData2">
          <div class="activity-scroll" slot="mdscroll">
            <div class="scroll-item" v-for="item in listData[2].list">
              <div class="flex-wrapper">
                <div class="flex-banner" @click.prevent.stop="linkOut(!0, item.url)">
                  <img :src="item.firstimg">
                  <div class="date-tip">
                    {{item.begintime}}-{{item.endtime}}
                  </div>
                </div>
                <div class="active-bar">
                  <span>{{item.title}}</span>
                  <div :class="'active-btn ' + (item.int_time ? '': 'added')" @click.prevent.stop="linkOut(item.int_time, item.url)"><i class="icon-plus"></i><span>立即参与</span></div>
                </div>
              </div>
            </div>
          </div>
        </v-mdlist>
      </div>
      <v-share ref="share" :shareVisible="shareVisible" :content="content" @closeShareMask="closeShare"></v-share>
      <v-footer :activeIndex="activeIndex"></v-footer>
    </div>
</template>
<script type="text/ecmascript-6">
  import TopNav from 'components/navbar/topnav';
  import MdList from './mdlist/mdList';
  import {getShareTn, getActivity, shareApi} from 'mock/getMocks';
  import Share from 'components/share/share';
  import Footer from 'components/footer/footerMenu';
    export default {
      name: 'memberDay',
      data () {
        return {
          nowTime: (new Date()).getTime(),
          activeIndex: 3,
          pageData: {
            navIndex: 0,
            currentTab: 'shareday',
            navData: [
              {
                name: '会员分享日',
                type: 'shareday',
                api: getShareTn
              },
              {
                name: '会员折扣日',
                type: 'discountday'
              },
              {
                name: '会员活动日',
                type: 'activityday',
                api: getActivity
              }
            ]
          },
          listData: [
            {
              list: []
            },
            {
              list: []
            },
            {
              list: []
            }
          ],
          total: null,
          num: null,
          share_score: null,
          shareVisible: !1,
          content: ''
        };
      },
      created () {
        this.fetchApi = getShareTn;
        this.fetchApiC = getActivity;
      },
      methods: {
        linkNav (v) {
          this.pageData.navIndex = v[1];
          if (v[1] === 1) {
            this.$router.push({
              path: '/mall/index',
              query: {
                index: 1
              }
            });
            return;
          }
          this.pageData.currentTab = this.pageData.navData[v[1]].type;
          this.$refs[this.pageData.currentTab].init();
        },
        dispatchData (d) {
          this.listData[0].list = d.list;
          this.total = d.total;
          this.num = d.num;
          this.share_score = d.share_score;
        },
        dispatchData2 (d) {
          this.listData[2].list = d.list;
        },
        catchIndex (i) {
          this.pageData.navIndex = i;
        },
        closeShare () {
          this.shareVisible = !1;
        },
        share (shared, id, content, e) {
          if (!e._constructed || shared === 'haved') {
            return;
          }
          this.content = content;
          this.shareApi(id);
        },
        async shareApi (id) {
          let resp = await shareApi({
            media_id: id,
            url: window.location.href
          });
          this.shareVisible = !0;
          resp.data.code === '1' && this.$refs.share.share(resp.data.data, id);
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
        linkOut (flag, url) {
          flag && (window.location.href = url);
        }
      },
      components: {
        'v-topnav': TopNav,
        'v-mdlist': MdList,
        'v-share': Share,
        'v-footer': Footer
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../view/assets/stylus/mixin.styl';
  .md-wrap
    padding px2rem(28)
    .sd-wrap
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
              width px2rem(410)
              height px2rem(64)
              overflow hidden
              text-align justify
              line-height px2rem(32)
              font-size px2rem(28)
            & p
              height px2rem(70)
              line-height px2rem(70)
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
    .ad-wrap
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
            min-height px2rem(240)
            & img
              display block
              width 100%
              height px2rem(240)
            .date-tip
              width px2rem(108)
              height px2rem(50)
              line-height px2rem(50)
              font-size px2rem(16)
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
