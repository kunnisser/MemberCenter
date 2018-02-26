<template>
    <div class="score-wrap">
      <div class="score-scrollbox">
        <v-scroll>
          <div slot="defaultScroll">
            <div class="scorebar">
              <div class="score-icon"></div>
              <div class="score-text">{{ucInfo.myscore}}</div>
            </div>
            <div class="score-nav-list">
              <div class="score-flex" v-for="item in navData" @click.prevent.stop="linkpath(item.path, $event)">
                <div class="flex-wrap">
                  <div :class="'icon ' + item.icon"></div>
                  <div class="flex-text">{{item.name}}</div>
                </div>
              </div>
            </div>
            <div class="score-rule">
              <div class="rule-wrap">
                <h3>积分规则</h3>
                <p>登录会员中心、每日签到、分享内容等操作都可以获取积分。获得的积分可以在积分商城中兑换优惠券等礼品。具体的积分规则及获得方式如下：</p>
                <p>1.注册新会员+100；</p>
                <p>2.个人信息完善+200；</p>
                <p>3.生日签到+100；</p>
                <p>4.分享推文：日常活动推文分享+20，每月16号会员分享日分享活动推文+60</p>
              </div>
            </div>
            <div class="score-hobby">
              <v-hobby :background="personInfo.bannerurl" :linkhref="personInfo.bannerhref">
                <h2 slot="share-title">小积分抽大奖</h2>
                <p slot="share-text">开启你的幸运时刻</p>
              </v-hobby>
            </div>
          </div>
        </v-scroll>
      </div>
      <div class="footer-btn" @click.prevent.stop="linkOrder">我的订单</div>
    </div>
</template>
<script type="text/ecmascript-6">
  import Hobby from '../../../../components/banner/hobby';
  import Scroll from '../../../../components/scroll/scrollView';
  import {mapState} from 'vuex';
    export default {
      name: 'myscore',
      data () {
        return {
          pageData: {},
          navData: [
            {
              name: '积分账单',
              icon: 'bill-icon',
              path: '/uc/scoredetail'
            },
            {
              name: '积分抽奖',
              icon: 'dial-icon',
              path: '/lottery'
            },
            {
              name: '积分兑换',
              icon: 'exchange-icon',
              path: '/mall'
            }
          ]
        };
      },
      computed: {
        ...mapState(['ucInfo', 'personInfo'])
      },
      created () {
        this.init();
      },
      methods: {
        init () {
        },
        linkpath (path, e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path
          });
        },
        linkOrder () {
          this.$router.push({
            path: '/uc/myorder'
          });
        }
      },
      components: {
        'v-hobby': Hobby,
        'v-scroll': Scroll
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../assets/stylus/mixin.styl';
  .score-wrap
    width 100%
    height 100%
    .score-scrollbox
      width 100%
      position absolute
      top 0
      bottom px2rem(56)
      overflow hidden
      .scorebar
        width px2rem(692)
        height px2rem(126)
        background url("../../../../assets/image/scorebar.png") no-repeat
        background-size 100% 100%
        margin 0 auto
        display flex
        justify-content center
        align-items center
        .score-icon
          width px2rem(58)
          height px2rem(54)
          background url("../../../../assets/image/score-icon.png") no-repeat
          background-size 100% 100%
          margin-right px2rem(30)
        .score-text
          font-size px2rem(60)
          color #fff
          font-weight bold
          -webkit-text-stroke px2rem(3) #a20000
          transform skewX(-10deg)
      .score-nav-list
        padding px2rem(20)
        width 100%
        display flex
        margin-top px2rem(40)
        .score-flex
          display flex
          flex 1
          font-size px2rem(18)
          color #fff
          justify-content center
          align-items flex-end
          .icon
            margin 0 auto
          .bill-icon
            width px2rem(84)
            height px2rem(86)
            background url("../../../../assets/image/bill-icon.png") no-repeat
            background-size 100% 100%
          .dial-icon
            width px2rem(94)
            height px2rem(96)
            background url("../../../../assets/image/dial-icon.png") no-repeat
            background-size 100% 100%
          .exchange-icon
            width px2rem(92)
            height px2rem(84)
            background url("../../../../assets/image/exchange-icon.png") no-repeat
            background-size 100% 100%
          .flex-text
            margin-top px2rem(28)
            width px2rem(134)
            height px2rem(34)
            line-height px2rem(34)
            text-align center
            color #fff
            background-color #024a8d
            border-radius px2rem(34)
      .score-rule
        padding px2rem(20)
        .rule-wrap
          padding px2rem(40)
          background-color #002b5a
          width 100%
          min-height px2rem(356)
          border-left px2rem(10) solid #002450
          color #fff
          font-size px2rem(18)
          & h3
            font-size px2rem(24)
            padding-bottom px2rem(20)
          & p
            font-size px2rem(18)
            line-height px2rem(32)
          .loadmore
            text-align center
            color #465b7a
            line-height px2rem(40)
            cursor pointer
            & i
              margin-left px2rem(6)
              color #465b7a
      .score-hobby
        padding 0 px2rem(25)
        & h2, & p
          color #8e4700
</style>
