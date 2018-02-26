<template>
    <div class="ps-wrap">
      <div class="no-data" v-if="pageData.noData">- 数据丢失 -</div>
      <div v-else>
        <v-scroll :loadMore="false" :bounce="false">
          <div slot="defaultScroll">
            <div class="default-panel">
              <div class="ps-tip">
                <div class="tip-icon" v-if="pageData.orderContext.order_status === 'paid'"><i class="icon-check"></i></div>
                <div class="tip-text">{{this.pageData.status[this.pageData.orderContext.order_status]}}</div>
              </div>
            </div>
            <div class="ps-panel">
              <div class="ps-title">
                <div class="ps-thumbpic" :style="'background-repeat:no-repeat;background-image:url('+pageData.orderContext.firstimg+'); background-size:cover;'"></div>
                <div class="ps-info">
                  <h3>{{pageData.orderContext.goodname}}</h3>
                  <p>{{pageData.orderContext.score / pageData.orderContext.num}}积分 {{pageData.orderContext.money ? '¥ ' + pageData.orderContext.money / (pageData.orderContext.num): ''}}<span>x{{pageData.orderContext.num}}</span></p>
                </div>
              </div>
              <div class="order-progress">
                <i class="icon-meter"></i><span>订单进度</span>
                <button type="button" v-if="pageData.orderContext.order_status === 'paid'">确认领取</button>
                <button type="button" v-if="pageData.orderContext.order_status === 'unpaid'" @click.prevent.stop="repapreOrder(pageData.orderContext.out_trade_no, $event)">微信支付</button>
                <button class="cancelBtn" type="button" v-if="pageData.orderContext.order_status === 'unpaid'" @click.prevent.stop="cancelUserOrder(pageData.orderContext.out_trade_no, $event)">取消订单</button>
              </div>
              <div class="order-info">
                <div class="info-item" v-for="item in pageData.infoArr">
                  <span>{{item.name}}：</span><span>{{item.value}}</span>
                </div>
              </div>
            </div>
            <div class="btn-group">
              <div class="btn-half-wrap">
                <button type="button" class="success-btn" @click.prevent.stop="linkPage('/uc/myorder', $event)">查看兑换记录</button>
              </div>
              <div class="btn-half-wrap">
                <button type="button" class="primary-btn" @click.prevent.stop="linkPage('index', $event)">返回积分商城</button>
              </div>
            </div>
          </div>
        </v-scroll>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" :class="'default' + (commitFlag ? '' : ' warning')">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scrollView';
  import {getCommitOrderResp, cancelUserOrder, repapreOrder} from 'mock/getMocks';
  import Tips from 'components/pop/poptips';
    export default {
      name: 'pay-success',
      data () {
        return {
          pageData: {
            id: '',
            status: {},
            orderContext: {},
            noData: !1,
            infoArr: [
              {
                name: '订单号',
                value: ''
              },
              {
                name: '领取方式',
                value: ''
              },
              {
                name: '商品总额',
                value: ''
              },
              {
                name: '兑换时间',
                value: ''
              },
              {
                name: '联系人',
                value: ''
              },
              {
                name: '联系方式',
                value: ''
              },
              {
                name: '领取地址',
                value: ''
              }
            ]
          },
          popType: 'center',
          tipvisible: !1,
          tiptext: '',
          commitFlag: !1
        };
      },
      created () {
        this.init();
      },
      methods: {
        init () {
          this.pageData.id = this.$route.query.id || '0';
          this.getCommitOrderResp();
        },
        async getCommitOrderResp () {
          try {
            let coResp = await getCommitOrderResp(
              {
                out_trade_no: this.pageData.id
              }
            );
            if (coResp.statusText === 'OK' && coResp.data.data) {
              this.pageData.noData = !1;
              this.pageData.orderContext = coResp.data.data;
              this.pageData.infoArr[0].value = this.pageData.orderContext.id;
              this.pageData.infoArr[1].value = this.pageData.orderContext.method;
              this.pageData.infoArr[2].value = this.pageData.orderContext.score + '积分' + (this.pageData.orderContext.money ? ' ¥' + this.pageData.orderContext.money : '');
              this.pageData.infoArr[3].value = this.pageData.orderContext.usedate;
              this.pageData.infoArr[4].value = this.pageData.orderContext.username;
              this.pageData.infoArr[5].value = this.pageData.orderContext.telephone;
              this.pageData.infoArr[6].value = this.pageData.orderContext.address;
              this.pageData.status = {
                'paid': '恭喜，已经支付成功！',
                'unpaid': '此订单待支付',
                'cancel': '此订单已取消'
              };
            } else {
              this.pageData.noData = !0;
            }
          } catch (e) {
            this.pageData.noData = !0;
          }
        },
        async cancelUserOrder (orderId) {
          try {
            let resp = await cancelUserOrder({'out_trade_no': orderId});
            if (resp.data.code === '1') {
              this.showMessage('取消成功', !0);
            } else {
              this.showMessage('取消失败', !1);
            }
          } catch (e) {
            this.showMessage('网络连接失败，请重试！', !1);
          }
        },
        async repapreOrder (orderId) {
          try {
            let resp = await repapreOrder({'out_trade_no': orderId});
            if (resp.data.code === '1') {
              if (resp.data.data.appId) {
                if (typeof WeixinJSBridge === 'undefined') {
                  if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                  } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                  }
                } else {
                  this.onBridgeReady(resp.data.data);
                }
              }
            } else {
              this.showMessage('支付请求失败！', !1);
            }
          } catch (e) {
            this.showMessage('网络连接失败，请重试！', !1);
          }
        },
        onBridgeReady (data) {
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
              'appId': data.appId, // 公众号名称，由商户传入
              'timeStamp': data.timeStamp, // 时间戳，自 1970 年以来的秒数
              'nonceStr': data.nonceStr, // 随机串
              'package': data.package, // 商品包信息
              'signType': data.signType, // 微信签名方式:
              'paySign': data.paySign // 微信签名
            }, (res) => {
            console.log(res);
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                this.showMessage('支付成功！', !0);
                this.pageData.orderInfo.orderid = data.out_trade_no;
                this.commitFlag = !0;
              } else {
                this.showMessage('支付失败！', !1);
                this.commitFlag = !1;
              }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            }
          );
        },
        linkPage (path) {
          this.$router.push({
            path: path
          });
        },
        showMessage (m, f) {
          this.commitFlag = f;
          this.tipvisible = !0;
          this.tiptext = m;
        },
        // 提交成功，关闭遮罩跳转订单详情
        closetips (v) {
          this.tipvisible = v;
          this.commitFlag && this.$router.push({
            path: '/uc/myorder'
          });
        }
      },
      components: {
        'v-scroll': Scroll,
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
@import '../../../assets/stylus/mixin.styl';
  .ps-wrap
    padding px2rem(26)
    .scrollwrap
      padding px2rem(26)
      .default-panel
        justify-content center
        align-items center
        height px2rem(210)
        .ps-tip
          font-size px2rem(28)
          font-weight bold
          color #fff
          .tip-icon
            display flex
            width px2rem(100)
            height px2rem(100)
            margin 0 auto
            border-radius 50%
            border px2rem(6) solid #1f7702
            justify-content center
            align-items center
            background-image linear-gradient(to bottom, #b5ea01, #10a21a)
            font-size px2rem(60)
            -webkit-text-stroke px2rem(4) #1f7702
            & i
              color #fff
          .tip-text
            margin-top px2rem(18)
      .ps-panel
        border-radius px2rem(10)
        width 100%
        margin-top px2rem(28)
        padding px2rem(20) px2rem(40)
        background-color #fff
        .ps-title
          display flex
          width 100%
          .ps-thumbpic
            width px2rem(230)
            height px2rem(230)
            flex 0 0 px2rem(230)
          .ps-info
            flex 1
            padding-left px2rem(50)
            & h3
              font-weight bold
              font-size px2rem(30)
              height px2rem(72)
              line-height px2rem(72)
            & p
              font-weight bold
              font-size px2rem(28)
              height px2rem(50)
              line-height px2rem(50)
              position relative
              & span
                position absolute
                font-size px2rem(24)
                right 0
                color #5e7382
        .order-progress
          width 100%
          height px2rem(106)
          line-height px2rem(106)
          border-bottom px2rem(1) solid #ccc
          font-size px2rem(24)
          position relative
          & i
            color #ffb753
            margin-right px2rem(16)
          .cancelBtn
            position absolute
            right px2rem(180)
            background-image linear-gradient(to bottom, #7e8c8d, #5e7382)
            border px2rem(2) solid #f2f2f2
            box-shadow 0 px2rem(4) px2rem(2) #cccccc
            -webkit-text-stroke px2rem(0) #f2f2f2
          & button
            position absolute
            right 0
            top px2rem(11)
            width px2rem(166)
            height px2rem(64)
            font-size px2rem(26)
            font-weight bold
            -webkit-text-stroke px2rem(2) #b33600
            color #fff
            background-image linear-gradient(to bottom, #fcfa00, #ff7b00)
            border-radius px2rem(16)
            overflow hidden
            border px2rem(2) solid #a3310d
            box-shadow 0 px2rem(4) px2rem(2) #b04d12
        .order-info
          padding-top px2rem(40)
          font-size px2rem(26)
          color #737373
          .info-item
            line-height px2rem(50)
            & span
              font-weight bold
      .btn-group
        padding-bottom px2rem(20)
        .btn-half-wrap
          padding px2rem(20)
          & button
            width px2rem(330)
            height px2rem(80)
            border-radius px2rem(16)
            font-weight bold
            font-size px2rem(30)
          .success-btn
            background-image linear-gradient(to bottom, #ffff21, #0ca11b)
            -webkit-text-stroke px2rem(2) #005600
            box-shadow 0 px2rem(6) px2rem(6) #066f34
          .primary-btn
            background-image linear-gradient(to bottom, #72e7f9, #0692d9)
            -webkit-text-stroke px2rem(2) #003b83
            box-shadow 0 px2rem(6) px2rem(6) #004f95
</style>
