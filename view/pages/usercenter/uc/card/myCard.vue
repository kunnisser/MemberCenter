<template>
  <v-scroll ref="scrollview">
    <div slot="defaultScroll">
      <div class="card-wrap">
        <div class="card-panel" v-if="pageData.cardInfo.carditem">
          <h4>{{pageData.cardInfo.carditem.cardkindname}}<span @click.prevent.stop="showDetail('carditem', $event)">{{pageData.cardInfo.carditem.arr.length}}张<i class="icon-chevron-thin-right"></i></span></h4>
          <div class="card-list" v-if="pageData.cardInfo.carditem && pageData.cardInfo.carditem.arr.length">
            <div  v-for="(item, index) in pageData.cardInfo.carditem.arr" v-if="index < 2" :class="'card-item ' + getCardStyle(1)  + ' year-card'">
              <div class="card-flex">
                <p>{{item.goodsname}}</p>
                <h2>{{item.goodsnick}}</h2>
                <div class="card-tip">有效期至 : {{item.pov}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="no-data" v-else>
          暂无相关卡券
        </div>
        <div class="card-panel" v-if="pageData.cardInfo.ticketitem">
          <h4>{{pageData.cardInfo.ticketitem.cardkindname}}<span @click.prevent.stop="showDetail('ticketitem', $event)">{{pageData.cardInfo.ticketitem.arr.length}}张<i class="icon-chevron-thin-right"></i></span></h4>
          <div class="card-list">
            <div v-for="(item, index) in pageData.cardInfo.ticketitem.arr"  v-if="index < 3" :class="'card-item ' + getTicketStyle(1)  + ' year-ticket'">
              <div class="card-flex">
                <div class="header">
                  <div class="header-wrap">
                    <h2>{{item.goodsnick}}</h2>
                    <p>{{item.kindname}}</p>
                  </div>
                </div>
                <div class="content">
                  <h2>{{item.goodsname}}</h2>
                  <p>{{item.goodsexplain}}</p>
                  <p class="timer">有效期至{{item.pov}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from '../../../../components/scroll/scrollView';
  import {getUserCard} from '../../../../mock/getMocks';
    export default {
      name: 'mycard',
      data () {
        return {
          pageData: {
            cardInfo: {
              carditem: null,
              ticketitem: null
            },
            ticketStyle: ''
          }
        };
      },
      created () {
        this.init();
      },
      methods: {
        init () {
          this.getUserCard();
        },
        async getUserCard () {
          let resCard = await getUserCard();
          this.pageData.cardInfo.carditem = resCard.data[0];
          this.pageData.cardInfo.ticketitem = resCard.data[1];
          this.$store.commit('setPrizeInfo', this.pageData.cardInfo);
          this.$nextTick(() => {
            this.$refs.scrollview.refresh();
          });
        },
        getTicketStyle (type) {
          let styleName = '';
          type === 1 && (styleName = 'single-ticket');
          type === 2 && (styleName = 'double-ticket');
          type === 3 && (styleName = 'home-ticket');
          return styleName;
        },
        getCardStyle (type) {
          let styleName = '';
          type === 1 && (styleName = 'single-card');
          type === 2 && (styleName = 'double-card');
          type === 3 && (styleName = 'home-card');
          return styleName;
        },
        showDetail (type, e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path: '/uc/carddetail',
            query: {
              'type': type
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
  @import '../../../../assets/stylus/mixin.styl';
  .card-wrap
    width 100%
    height 100%
    padding px2rem(30)
    .card-panel
      position relative
      width 100%
      font-size px2rem(30)
      color #fff
      padding px2rem(20) 0
      & span
        position absolute
        right 0
        font-size px2rem(24)
        line-height px2rem(30)
        & i
          color #fff
          margin-left px2rem(20)
      .card-list
        margin-top px2rem(32)
        .card-item
          display flex
          width 100%
          .card-flex
            position relative
            width 100%
            & h2
              font-size px2rem(40)
              height px2rem(64)
              line-height px2rem(64)
            & p
              font-size px2rem(22)
            .card-tip
              position absolute
              top 0
              right 0
              color #fff
              font-size px2rem(18)
          &.year-card
            padding px2rem(36) px2rem(40)
            margin-bottom px2rem(24)
            border-top-left-radius px2rem(12)
            border-top-right-radius px2rem(12)
            overflow hidden
          &.single-card
            background-image linear-gradient(top, #469ae8, #3461ab)
          &.double-card
            background-image linear-gradient(top, #fe5193, #d5017d)
          &.home-card
            background-image linear-gradient(top, #eec454, #c8934f)
          &.year-ticket
            border-top-right-radius px2rem(12)
            border-bottom-right-radius px2rem(12)
            overflow hidden
            margin-bottom px2rem(30)
            .header
              width px2rem(220)
              height px2rem(174)
              flex 0 0 px2rem(220)
              display flex
              justify-content center
              align-items center
            .content
              height px2rem(174)
              flex 1
              background-color #fff
              color #000
              padding px2rem(28)
              & h2
                margin-bottom px2rem(8)
              & p
                font-size px2rem(18)
              .timer
                margin-top px2rem(12)
                color #cccccc
            .card-flex
              display flex
          &.single-ticket
            .header
              background url("../../../../assets/image/single-ticket.png") no-repeat
              background-size 100% 100%
          &.double-ticket
            .header
              background url("../../../../assets/image/double-ticket.png") no-repeat
              background-size 100% 100%
          &.home-ticket
            .header
              background url("../../../../assets/image/home-ticket.png") no-repeat
              background-size 100% 100%
</style>
