<template>
    <div class="score-detail">
      <div class="score-notice">
        <div class="notice-wrap">
          <div class="date-picker" @click.prevent.stop="openDp">{{selectDate[0]}}年{{selectDate[1]}}月<i class="icon-chevron-thin-down"></i></div>
          <div class="notice-text">{{scoreInfo ? scoreInfo.totalIncome + scoreInfo.totalExpend :0}}<span>积分</span></div>
        </div>
      </div>
      <div class="score-table">
        <div class="table-header" v-if="scoreInfo">
          <div v-for="(item, index) in pageData.scorenav" :class=" item.chosed ?  'header-flex taped' : 'header-flex'" @click.prevent.stop="checkNav(index)">
            <div class="title">{{item.name}}</div>
            <div class="value">{{!index ? '+' + scoreInfo.totalIncome : scoreInfo.totalExpend}}分</div>
          </div>
        </div>
        <div class="table-body">
          <div class="body-wrap" v-if="scoreInfo && scoreInfo.scorelist.length">
            <v-scroll ref="scrollview" :loadMore="false" :bounce="false">
              <div slot="defaultScroll">
                <h3><strong>当月活动奖励积分</strong><span><i :class="!pageData.navth ? 'icon-plus2' : 'icon-minus'"></i> {{!pageData.navth ? scoreInfo.totalIncome : scoreInfo.totalExpend.toString().replace('-', '')}}<i class="icon-chevron-thin-up"></i></span></h3>
                <div class="scorelist-wrap">
                  <ul v-show="!pageData.navth">
                    <li v-for="item in scoreInfo.scorelist" v-if="item.scorevalue > 0">
                      <div class="list-header">
                        <p>{{item.timestamp}}</p>
                        <h4>{{item.name}}</h4>
                      </div>
                      <div class="list-value">{{item.scorevalue}}</div>
                    </li>
                  </ul>
                  <ul v-show="pageData.navth">
                    <li v-for="item in scoreInfo.scorelist" v-if="item.scorevalue < 0">
                      <div class="list-header">
                        <p>{{item.timestamp}}</p>
                        <h4>{{item.name}}</h4>
                      </div>
                      <div class="list-value">{{item.scorevalue}}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </v-scroll>
          </div>
          <div class="no-score" v-else><i class="icon-text-document"></i>暂无积分记录！</div>
        </div>
      </div>
      <div class="score-hobby">
        <v-hobby :background="personInfo.bannerurl_score" :linkhref="personInfo.bannerhref_score">
          <h2 slot="share-title">小积分抽大奖</h2>
          <p slot="share-text">开启你的幸运时刻</p>
        </v-hobby>
      </div>
      <v-datepicker ref="datepicker" v-show="pageData.datePickVisible" :startYear="startYear" :col="col" @dpVisible="closeDp"
      @pickYear="getYear" @pickMonth="getMonth"></v-datepicker>
      <div class="footer-btn" @click.prevent.stop="linkpath('/uc/myorder')">我的订单</div>
    </div>
</template>
<script type="text/ecmascript-6">
  import Datepicker from '../../../../components/datepicker/datepicker';
  import Hobby from '../../../../components/banner/hobby';
  import {getUserScore} from '../../../../mock/getMocks';
  import Scroll from '../../../../components/scroll/scrollView';
  import {mapState} from 'vuex';
    export default {
      name: 'scoreDetail',
      data () {
        return {
          pageData: {
            startYear: 0,
            col: 0,
            datePickVisible: !1,
            selectDate: [],
            scorenav: [
              {
                name: '积分获取',
                value: '',
                chosed: !0
              },
              {
                name: '积分支出',
                value: '',
                chosed: !1
              }
            ],
            navth: 0
          },
          scoreInfo: null
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
          this.col = 2;
          this.currentDate = new Date();
          this.startYear = this.currentDate.getFullYear() - 3;
          this.selectDate = [];
          this.selectDate.push(this.currentDate.getFullYear());
          this.selectDate.push(this.currentDate.getMonth() + 1);
          this.catchScoreList(this.selectDate);
        },
        openDp () {
          this.pageData.datePickVisible = !0;
          this.$refs.datepicker.initScroll();
        },
        closeDp (v) {
          this.pageData.datePickVisible = v.close;
          v.confirmed && this.catchScoreList(this.selectDate);
        },
        getYear (y) {
          this.selectDate[0] = y;
        },
        getMonth (m) {
          this.selectDate[1] = m;
        },
        checkNav (index) {
          for (let n of this.pageData.scorenav) {
            n.chosed = !1;
          }
          this.pageData.navth = index;
          this.pageData.scorenav[index].chosed = !0;
          this.$nextTick(() => {
            this.$refs.scrollview && this.$refs.scrollview.refresh();
          });
        },
        async catchScoreList (d) {
          let resData = await getUserScore({timestamp: d[0] + '-' + (parseInt(d[1]) < 10 ? ('0' + d[1]) : d[1])});
          this.scoreInfo = resData.data;
          this.$nextTick(() => {
            this.$refs.scrollview && this.$refs.scrollview.scroll && this.$refs.scrollview.refresh();
          });
        },
        linkpath (path) {
          this.$router.push({
            path
          });
        }
      },
      components: {
        'v-datepicker': Datepicker,
        'v-hobby': Hobby,
        'v-scroll': Scroll
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../assets/stylus/mixin.styl';
  .score-detail
    width 100%
    height 100%
    padding px2rem(20)
    .score-notice
      width 100%
      height px2rem(244)
      background-color #035aa8
      border-radius px2rem(40)
      overflow hidden
      border px2rem(10) solid #024a8d
      display flex
      justify-content center
      align-items center
      text-align center
      .date-picker
        margin 0 auto
        width px2rem(262)
        height px2rem(44)
        background-color #81add4
        color #035fac
        font-size px2rem(20)
        line-height px2rem(44)
        border-radius px2rem(44)
        & i
          color #035fac
          font-size px2rem(20)
          margin-left px2rem(10)
      .notice-text
        margin-top px2rem(40)
        font-size px2rem(60)
        font-weight bold
        color #fff
        -webkit-text-stroke px2rem(2) #003d85
        & span
          font-weight bold
          font-size px2rem(28)
          margin-left px2rem(8)
          position relative
          bottom px2rem(4)
    .score-table
      width 100%
      .table-header
        display flex
        padding-top px2rem(30)
        font-size px2rem(32)
        color #d0d0d0
        -webkit-text-stroke px2rem(1) #555555
        .header-flex
          width px2rem(320)
          height px2rem(72)
          background url("../../../../assets/image/score-untap.png") no-repeat
          background-size 100% 100%
          display flex
          .title
            font-size px2rem(16)
            line-height px2rem(20)
            width px2rem(90)
            padding px2rem(14) px2rem(26)
            font-weight bold
          .value
            width px2rem(226)
            text-align center
            line-height px2rem(68)
            font-weight bold
            & i
              color #fff
        .taped
          background url("../../../../assets/image/score-tap.png") no-repeat
          background-size 100% 100%
          color #fff
          .title
            -webkit-text-stroke px2rem(1) #005600
          .value
            -webkit-text-stroke px2rem(1) #b33600
        .header-flex:last-child
          margin-left px2rem(66)
      .table-body
        width 100%
        background-color #002b5a
        margin-top px2rem(30)
        border-radius px2rem(16)
        padding px2rem(36) px2rem(40)
        font-size px2rem(30)
        color #fff
        display flex
        justify-content center
        align-items center
        height px2rem(360)
        .no-score
          font-size px2rem(30)
          & i
            font-size px2rem(30)
            margin-right px2rem(20)
            color #fff
        & h3
          position relative
          & strong
            font-weight bold
            -webkit-text-stroke px2rem(2) #003d85
          & span
            position absolute
            right 0
            & i
              color #fff
              margin-left px2rem(20)
        .body-wrap
          width 100%
          height 100%
          position relative
          overflow hidden
          .scorelist-wrap
            padding-top px2rem(30)
            & li
              padding-bottom px2rem(40)
              position relative
              .list-header
                line-height px2rem(46)
                font-size px2rem(24)
              .list-value
                position absolute
                right 0
                top px2rem(24)
                font-size px2rem(30)
            & li:last-child
              padding-bottom 0

</style>
