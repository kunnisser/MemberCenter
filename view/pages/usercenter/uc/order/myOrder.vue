<template>
    <div class="order-wrap">
      <v-topnav :navIndex="pageData.navIndex" :navData="pageData.navData" @linkNav="linkOrder"></v-topnav>
      <div class="scroll-wrap">
        <v-scroll ref="scrollview" :loadMore="false" :bounce="false">
          <div slot="defaultScroll">
            <div class="order-scroll" v-if="pageData.orderData && pageData.orderData.length">
              <div v-for="item in pageData.orderData" :class="'order-item ' + checkOrderKind(item.paykind).okclass" @click.prevent.stop="linkDetail(item.out_trade_no, $event)">
                <div class="order-box">
                  <div class="od-itemheader">
                    {{item.time}} <span :class="checkStatus(item.status).orderclass">{{checkStatus(item.status).text}}</span>
                  </div>
                  <div class="od-itemcontent">
                    <div class="od-name">
                      <i :class="checkOrderKind(item.money).icon"></i>
                      <span class="paytip">[{{checkOrderKind(item.money).text}}]</span>
                      <strong>{{item.title}}</strong>
                    </div>
                    <div class="od-value">{{item.score}}分{{item.money ? '+ ¥' + item.money : ''}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-data" v-else>暂无订单</div>
          </div>
        </v-scroll>
      </div>
      <v-footer :activeIndex="activeIndex"></v-footer>
    </div>
</template>
<script type="text/ecmascript-6">
  import {getUserOrder} from '../../../../mock/getMocks';
  import Scroll from '../../../../components/scroll/scrollView';
  import TopNav from '../../../../components/navbar/topnav';
  import Footer from 'components/footer/footerMenu';
  export default {
      name: 'myorder',
      data () {
        return {
          activeIndex: 4,
          pageData: {
            navIndex: 0,
            navData: [
              {
                name: '全部',
                type: 'all'
              },
              {
                name: '待付款',
                type: 'unpaid'
              },
              {
                name: '已付款',
                type: 'paid'
              },
              {
                name: '已取消',
                type: 'cancel'
              }
            ],
            orderData: [],
            orderKind: [
              {
                icon: 'paykind',
                okclass: 'exchange',
                text: '积分兑换'
              },
              {
                icon: 'paykind2',
                okclass: 'sale',
                text: '会员折扣'
              }
            ],
            orderStatus: [
              {
                orderclass: 'success',
                text: '交易成功'
              },
              {
                orderclass: 'unpaid',
                text: '立即支付'
              },
              {
                orderclass: 'cancel',
                text: '已取消'
              }
            ]
          }
        };
      },
      created () {
        this.init();
      },
      methods: {
        init () {
          this.getUserOrder('all');
        },
        async getUserOrder (t) {
          let config = {};
          t && (config['type'] = t);
          let resOfOrder = await getUserOrder(config);
          resOfOrder.data.data && (this.pageData.orderData = resOfOrder.data.data.list);
          this.$nextTick(() => {
            this.$refs.scrollview.refresh();
          });
        },
        checkStatus (s) {
            return s === '1' ? this.pageData.orderStatus[0] : s === '0' ? this.pageData.orderStatus[1] : this.pageData.orderStatus[2];
        },
        checkOrderKind (k) {
          return (k / 100) > 0 ? this.pageData.orderKind[1] : this.pageData.orderKind[0];
        },
        linkOrder (v) {
            this.pageData.navIndex = v[1];
            this.getUserOrder(v[0]);
        },
        linkDetail (tradeId, e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path: '/mall/paysuccess',
            query: {
              id: tradeId
            }
          });
        }
      },
      components: {
        'v-topnav': TopNav,
        'v-scroll': Scroll,
        'v-footer': Footer
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../assets/stylus/mixin.styl';
  .order-wrap
    padding px2rem(28)
    .scroll-wrap
      position absolute
      width px2rem(694)
      top px2rem(116)
      bottom px2rem(150)
      .order-scroll
        padding-top px2rem(10)
        padding-bottom px2rem(20)
        .order-item
          margin-top px2rem(20)
          width 100%
          height px2rem(250)
          border-radius px2rem(10)
          overflow hidden
          background-color #fff
          padding-left px2rem(40)
          &.exchange
            border-left px2rem(10) solid #17a1e5
            .paytip
              color #17a1e5
          &.sale
            border-left px2rem(10) solid #e5179f
            .paytip
              color #e5179f
          .order-box
            width 100%
            .od-itemheader
              width 100%
              position relative
              height px2rem(96)
              line-height px2rem(96)
              font-size px2rem(24)
              color #a3a3a3
              border-bottom px2rem(1) solid #ccc
              & span
                position absolute
                right px2rem(36)
              .cancel
                color #586fc3
              .success
                color #2db212
              .unpaid
                color #ff0000
            .od-itemcontent
              width 100%
              height px2rem(144)
              font-size px2rem(30)
              color #4c4c4c
              .od-name
                height px2rem(90)
                line-height px2rem(90)
                & i
                  display inline-block
                  vertical-align middle
                  width px2rem(36)
                  height px2rem(36)
                  margin-right px2rem(16)
                  &.paykind
                    background url("../../../../assets/image/paykind-icon.png") no-repeat
                    background-size 100% 100%
                  &.paykind2
                    background url("../../../../assets/image/paykind2-icon.png") no-repeat
                    background-size 100% 100%
              .od-value
                text-align right
                padding-right px2rem(36)

</style>
