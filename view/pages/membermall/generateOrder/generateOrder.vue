<template>
    <div class="go-wrap">
      <div class="no-data" v-if="pageData.noData">没有相关数据</div>
      <div class="pay-bar">
        <div class="paybar-wrap">
          <div class="pay-info">
            <i class="payscore-icon"></i>
            <span>所需金额：{{pageData.orderInfo.score * pageData.inputNum}}积分 {{pageData.orderInfo.money ? ('+ ¥' + pageData.orderInfo.money * pageData.inputNum) : ''}}</span>
          </div>
          <div class="echelon-box" @click="commitOrder">立即兑换</div>
        </div>
      </div>
      <v-scroll :loadMore="false" :bounce="false" ref="goScroll">
        <div slot="defaultScroll">
          <div class="slotwrap">
            <div class="default-panel">
              <div class="address-icon">
                <i class="icon-location"></i>
              </div>
              <div class="address-text">
                <div class="ad-textwrap">
                  <h3>自提地址:</h3>
                  <p>{{pageData.orderInfo.address}}</p>
                </div>
              </div>
            </div>
            <div class="go-panel">
              <div class="go-line">
                <div class="go-pic" :style="'background-repeat:no-repeat;background-image:url('+pageData.orderInfo.firstimg+'); background-size:cover;'"></div>
                <div class="go-text">
                  <h3>{{pageData.orderInfo.title}}</h3>
                  <h4><strong>{{pageData.orderInfo.score}}</strong><b>积分</b><b> {{pageData.orderInfo.money ? ('+ ¥' + pageData.orderInfo.money) : ''}}</b></h4>
                  <p>市场参考价:<span>{{pageData.orderInfo.orig}}</span>元 </p>
                </div>
              </div>
              <div class="go-line">
                <div class="line-flex left-flex">
                  购买数量
                </div>
                <div class="line-flex right-flex">
                  <div class="countbar">
                    <i :class="'icon-minus '+ (pageData.inputNum > 1 ? 'active': '')" @click.prevent.stop="minusNum"></i><span>{{pageData.inputNum}}</span><i class="icon-plus2 active" @click.prevent.stop="plusNum"></i>
                  </div>
                </div>
              </div>
              <div class="go-line">
                <div class="line-flex left-flex">
                  游玩日期
                </div>
                <div class="line-flex right-flex" @click.prevent.stop="openDp">
                  <span>{{selectDate[0]}}-{{selectDate[1]}}-{{selectDate[2]}}</span><i class="icon-chevron-thin-right"></i>
                </div>
              </div>
              <div class="go-line">
                <div class="line-flex left-flex">
                  支付方式
                </div>
                <div class="line-flex right-flex">
                  在线支付
                </div>
              </div>
            </div>
            <div class="go-panel">
              <div class="go-line">
                <div class="line-flex left-flex">
                  <strong>联系人信息</strong>
                </div>
              </div>
              <div class="go-line">
                <div class="line-flex left-flex">
                  <label>手机号</label>
                  <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="pageData.telnum">
                </div>
              </div>
              <div class="go-line">
                <div class="line-flex left-flex">
                  <label>身份证号</label>
                  <input type="text" maxlength="18" placeholder="用于出游人身份证验票" v-model="pageData.idnum">
                </div>
              </div>
            </div>
            <div class="go-panel">
              <div class="go-line" @click.prevent.stop="useFvTicket" v-if="pageData.orderInfo.suitcard">
                <div class="line-flex left-flex">
                  <strong :class="pageData.orderInfo.suitcard.length ? '' : 'disabled'">优惠券</strong>
                </div>
                <div class="line-flex right-flex" v-if="pageData.orderInfo.suitcard.length">
                  <div class="ticket-info" v-show="pageData.orderInfo.ticketname">
                    {{pageData.orderInfo.ticketname}}
                  </div>
                  <div class="ticket-info" v-show="!pageData.orderInfo.ticketname">
                    <span>{{pageData.orderInfo.suitcard.length}} 张可用</span><i class="icon-chevron-thin-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="go-panel">
              <div class="go-line">
                <div class="line-flex left-flex">
                  <strong>商品金额</strong>
                </div>
                <div class="line-flex right-flex">
                  <strong>{{pageData.orderInfo.score * pageData.inputNum}}积分 {{pageData.orderInfo.money ? ('+ ¥' + pageData.orderInfo.money * pageData.inputNum) : ''}}</strong>
                </div>
              </div>
            </div>
            <div class="go-panel">
              <div class="go-line sm-line">
                <div class="line-flex left-flex">
                  <strong>预订须知</strong>
                </div>
              </div>
              <div class="go-line sm-line">
                <div class="line-flex left-flex">
                  <div class="rule-wrap" v-if="pageData.orderInfo.explain">
                    <h3>预订规则</h3>
                    <p>预订时间: {{pageData.orderInfo.explain.bookrule.booktime}}</p>
                    <p>入园限制: {{pageData.orderInfo.explain.bookrule.booklimit}}</p>
                    <p>有效期: {{pageData.orderInfo.explain.bookrule.validate}}</p>
                  </div>
                </div>
              </div>
              <div class="go-line sm-line">
                <div class="line-flex left-flex">
                  <div class="rule-wrap" v-if="pageData.orderInfo.explain">
                    <h3>退票规则</h3>
                    <p>{{pageData.orderInfo.explain.refundrule.ruletext}}</p>
                  </div>
                </div>
              </div>
              <div class="go-line sm-line">
                <div class="line-flex left-flex">
                  <div class="rule-wrap" v-if="pageData.orderInfo.explain">
                    <h3>补充说明</h3>
                    <p v-for="(item, index) in pageData.orderInfo.explain.supplement">{{index+1}}、 {{item}}</p>
                  </div>
                </div>
              </div>
              <div class="go-line sm-line">
                <div class="line-flex left-flex">
                  <div class="rule-wrap" v-if="pageData.orderInfo.explain">
                    <h3>入园方式</h3>
                    <p>入园方式: {{pageData.orderInfo.explain.intermethod.method}}</p>
                    <p>入园地址: {{pageData.orderInfo.explain.intermethod.address}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-scroll>
      <v-datepicker ref="datepicker" v-show="pageData.datePickVisible" :startYear="startYear" :endYear="endYear" :col="col" @dpVisible="closeDp"
                    @pickYear="getYear" @pickMonth="getMonth" @pickDay="getDay"></v-datepicker>
      <div class="ticket-picker" @click="cancelCheckTicket" v-show="pageData.ticketVisible">
        <v-scroll ref="ticketScroll" :loadMore="false" :bounce="false">
          <div slot="defaultScroll">
            <div class="card-wrap">
              <div class="card-panel">
                <div class="card-list" v-if="!pageData.cardNoData">
                  <div v-for="(item, index) in pageData.cardInfo" :class="'card-item ' + getTicketStyle(1)  + ' year-ticket'">
                    <div class="card-flex">
                      <div class="header">
                        <div class="header-wrap">
                          <h2>{{item.goodsnick}}</h2>
                          <p>{{item.kindname}}</p>
                        </div>
                      </div>
                      <div class="content">
                        <h2>{{item.nickname}}</h2>
                        <p>{{item.detail}}</p>
                        <p class="timer">有效期至{{item.expire}}</p>
                        <div :class="'checkbox ' + (item.goodsid === pageData.orderInfo.id ? '' : 'disable') + (item.ticketChecked? 'active': '')" @click.prevent.stop="checkTicket(index, $event)">
                          <i v-if="item.ticketChecked" class="icon-check"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-data" v-else>
                  暂无相关卡券
                </div>
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
  import {getGenerateOrder, addUserOrder} from 'mock/getMocks';
  import Scroll from 'components/scroll/scrollView';
  import Datepicker from 'components/datepicker/datepicker';
  import Tips from 'components/pop/poptips';
    export default {
      name: 'go-wrap',
      data () {
        return {
          pageData: {
            id: '',
            orderid: '',
            orderInfo: {},
            noData: !1,
            inputNum: 1,
            datePickVisible: !1,
            ticketVisible: !1,
            cardInfo: {},
            ticketStyle: '',
            cardNoData: !1,
            telnum: '',
            idnum: ''
          },
          popType: 'center',
          tipvisible: !1,
          tiptext: '',
          commitFlag: '',
          checkArr: [],
          selectDate: [],
          startYear: '',
          currentDate: null,
          endYear: '',
          col: 0,
          commitData: {
            cardId: 0
          },
          commitId: ''
        };
      },
      created () {
        this.init();
      },
      methods: {
        init () {
          this.pageData.id = this.$route.query.id;
          this.col = 3;
          this.currentDate = new Date();
          this.startYear = this.currentDate.getFullYear();
          this.endYear = this.currentDate.getFullYear() + 1;
          this.selectDate = [];
          this.selectDate.push(this.startYear);
          this.selectDate.push(this.currentDate.getMonth() + 1);
          this.selectDate.push(this.currentDate.getDate());
          this.getGenerateOrder();
        },
        async getGenerateOrder () {
          try {
            let goResp = await getGenerateOrder({
              id: this.pageData.id
            });
            if (goResp.statusText === 'OK' && goResp.data.data.length) {
              this.pageData.noData = !1;
              this.pageData.orderInfo = JSON.parse(goResp.data.data);
              this.$nextTick(() => {
                this.$refs.goScroll.refresh();
              });
            } else {
              this.pageData.noData = !0;
            }
          } catch (e) {
            this.pageData.noData = !0;
          }
        },
        minusNum (e) {
          if (!e._constructed) {
            return;
          }
          this.pageData.inputNum > 1 && this.pageData.inputNum--;
        },
        plusNum (e) {
          if (!e._constructed) {
            return;
          }
          this.pageData.inputNum++;
        },
        getYear (y) {
          this.selectDate[0] = y;
        },
        getMonth (m) {
          if (this.selectDate[0] === this.startYear) {
            this.selectDate[1] = (m < this.currentDate.getMonth() + 1 ? this.currentDate.getMonth() + 1 : m);
          } else {
            this.selectDate[1] = m;
          }
        },
        getDay (d) {
          if (this.selectDate[0] === this.startYear && (this.selectDate[1] === this.currentDate.getMonth() + 1)) {
            this.selectDate[2] = d < this.currentDate.getDate() ? this.currentDate.getDate() : d;
          } else {
            this.selectDate[2] = d;
          }
        },
        openDp (e) {
          if (!e._constructed) {
            return;
          }
          this.pageData.datePickVisible = !0;
          this.$refs.datepicker.initScroll();
        },
        closeDp (v) {
          this.pageData.datePickVisible = v.close;
        },
        useFvTicket (e) {
          if (!e._constructed) {
            return;
          }
          if (this.pageData.orderInfo.suitcard.length > 0) {
            this.pageData.ticketVisible = !0;
            this.getUserCard();
          }
        },
        // 验证订单，封装提交参数
        commitOrder () {
          this.commitFlag = !1;
          let testTel = /^(13[0-9]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|5|6|7|8|9]|147|177)\d{8}$/;
          let testId = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
          if (!this.pageData.telnum.trim().length) {
            this.showMessage('请输入手机号！', !1);
          } else if (!testTel.test(this.pageData.telnum)) {
            this.showMessage('手机号码不正确！', !1);
          } else if (!this.pageData.idnum.trim().length) {
            this.showMessage('请输入身份证号！', !1);
          } else if (!testId.test(this.pageData.idnum)) {
            this.showMessage('身份证号不正确！', !1);
          } else {
            this.commitData['goodId'] = this.pageData.id;
            this.commitData['telephone'] = this.pageData.telnum;
            this.commitData['id_card_no'] = this.pageData.idnum;
            this.commitData['usedate'] = this.selectDate[0] + '-' + this.selectDate[1] + '-' + this.selectDate[2];
            this.commitData['num'] = this.pageData.inputNum;
            this.addNewOrder();
          }
        },
        // 提交订单
        async addNewOrder () {
          try {
            let addResp = await addUserOrder(this.commitData);
            switch (addResp.data.code) {
              case 'check_account_wx':
                this.showMessage('请登录微信后再试', !1);
                break;
              case 'good_not_exist':
                this.showMessage('商品不存在', !1);
                break;
              case 'less_card':
                this.showMessage('卡券不存在！', !1);
                break;
              case 'out_time':
                this.showMessage('商品过期！', !1);
                break;
              case 'less_score':
                this.showMessage('积分不够！', !1);
                break;
              case '0':
                this.showMessage('下单出错！', !1);
                break;
              default:
                // 提交成功
                let payData = addResp.data.data;
                if (payData.appId) {
                  if (typeof WeixinJSBridge === 'undefined') {
                    if (document.addEventListener) {
                      document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                    } else if (document.attachEvent) {
                      document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                      document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                    }
                  } else {
                    this.onBridgeReady(payData);
                  }
                } else {
                  this.showMessage('提交订单成功！', !0);
                  this.pageData.orderInfo.orderid = payData.out_trade_no;
                  this.commitFlag = !0;
                }
                break;
            }
          } catch (e) {
            console.log(e);
            this.showMessage('网络连接错误，请重试！', !1);
          }
        },
        // wechat支付接口
        onBridgeReady (data) {
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
              'appId': data.appId, // 公众号名称，由商户传入
              'timeStamp': data.timeStamp, // 时间戳，自 1970 年以来的秒数
              'nonceStr': data.nonceStr, // 随机串
              'package': data.package, // 商品包信息
              'signType': data.signType, // 微信签名方式:
              'paySign': data.paySign // 微信签名
            }, (res) => {
              if (res.err_msg === 'get_brand_wcpay_request:ok') {
                this.showMessage('支付成功！', !0);
                this.pageData.orderInfo.orderid = data.out_trade_no;
                this.commitFlag = !0;
              } else {
                this.showMessage('支付失败！', !0);
                this.commitFlag = !1;
              }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            }
          );
        },
        getUserCard () {
            this.pageData.cardInfo = this.pageData.orderInfo.suitcard;
            this.pageData.cardNoData = !1;
              for (let c of this.pageData.cardInfo) {
                c['ticketChecked'] = !1;
              }
              this.$nextTick(() => {
                this.$refs.ticketScroll.refresh();
              });
        },
        getTicketStyle (type) {
          let styleName = '';
          type === 1 && (styleName = 'single-ticket');
          type === 2 && (styleName = 'double-ticket');
          type === 3 && (styleName = 'home-ticket');
          return styleName;
        },
        checkTicket (index, e) {
          if (!e._constructed) {
            return;
          }
          for (let c of this.pageData.cardInfo) {
            c.ticketChecked = !1;
          }
          this.pageData.cardInfo[index].ticketChecked = !0;
          this.$set(this.pageData.cardInfo, index, this.pageData.cardInfo[index]);
          this.commitData.cardId = this.pageData.cardInfo[index].id;
          this.pageData.orderInfo.ticketname = this.pageData.cardInfo[index].nickname;
          setTimeout(() => {
            this.pageData.ticketVisible = !1;
          }, 100);
        },
        cancelCheckTicket () {
          this.commitData['cardId'] = null;
          this.pageData.orderInfo.ticketname = null;
          this.pageData.ticketVisible = !1;
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
            path: 'paysuccess',
            query: {
              id: this.pageData.orderInfo.orderid
            }
          });
        }
      },
      components: {
        'v-datepicker': Datepicker,
        'v-scroll': Scroll,
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../assets/stylus/mixin.styl';
  .go-wrap
    padding px2rem(26)
    width 100%
    height 100%
    .scrollwrap
      padding px2rem(26)
      bottom px2rem(70)
      .slotwrap
        padding-bottom px2rem(52)
        .default-panel
          height px2rem(170)
          .address-icon
            display flex
            width px2rem(110)
            flex 0 0 px2rem(110)
            justify-content center
            align-items center
            & i
              padding px2rem(20)
              border-radius 50%
              background-image linear-gradient(to bottom, #ffff00, #fe7f00)
              color #fff
              border px2rem(2) solid #a93500
              font-size px2rem(30)
          .address-text
            display flex
            align-items center
            color #fff
            flex 1
            font-size px2rem(22)
            & h3
              font-size px2rem(30)
              height px2rem(40)
              line-height px2rem(40)
            & p
              line-height px2rem(30)
        .go-panel
          width 100%
          background-color #fff
          border-radius px2rem(10)
          padding px2rem(24)
          margin-top px2rem(24)
          .go-line
            display flex
            width 100%
            padding px2rem(40) 0
            border-bottom px2rem(1) solid #ccc
            &.sm-line
              padding px2rem(20) 0
            &.go-line:last-child
              border-bottom 0
            .go-pic
              width px2rem(220)
              height px2rem(220)
              flex 0 0 px2rem(220)
            .go-text
              flex 1
              padding-left px2rem(56)
              & h3
                height px2rem(50)
                line-height px2rem(50)
                font-weight bold
                font-size px2rem(34)
              & h4
                height px2rem(60)
                line-height px2rem(60)
                & strong
                  vertical-align middle
                  font-weight bold
                  color #ff9d16
                  font-size px2rem(50)
                & b
                  vertical-align middle
                  margin-left px2rem(10)
                  font-weight bold
                  font-size px2rem(26)
              & p
                font-size px2rem(22)
                margin-top px2rem(74)
                color #494949
                & span
                  margin 0 px2rem(6)
                  text-decoration line-through
            .line-flex
              display flex
              flex 1
              align-items center
              font-size px2rem(28)
              &.left-flex
                padding-left px2rem(16)
                justify-content flex-start
                & strong
                  font-weight bold
                  font-size px2rem(30)
                  &.disabled
                    color #ccc
                & label
                  display inline-block
                  min-width px2rem(150)
                .rule-wrap
                  & h3
                    font-size px2rem(26)
                    margin-bottom px2rem(20)
                    font-weight 600
                  & p
                    color #616161
                    text-align justify
                    line-height px2rem(36)
                    font-size px2rem(24)
              &.right-flex
                padding-right px2rem(16)
                justify-content flex-end
                & strong
                  font-size px2rem(36)
                  font-weight 600
                  color #ff9d16
                & i
                  margin-left px2rem(4)
                  color #5e7382
                .countbar
                  display flex
                  justify-content center
                  align-items center
                  & i
                    display inline-block
                    width px2rem(50)
                    text-align center
                    height px2rem(50)
                    line-height px2rem(50)
                    font-size px2rem(40)
                    color #b2b2b2
                    &.active
                      color #f8a53c
                  & span
                    padding px2rem(5) px2rem(20)
                    font-size px2rem(40)
    .ticket-picker
      position absolute
      width 100%
      top 0
      left 0
      bottom 0
      background-color #003366
      .card-wrap
        padding 0
        .content
          position relative
          .checkbox
            position absolute
            right px2rem(30)
            top px2rem(60)
            width px2rem(60)
            height px2rem(60)
            border-radius 50%
            border px2rem(4) solid #1f7702
            display flex
            justify-content center
            align-items center
            & i
              color #fff
            &.disable
              border-color #b5b5b5
              background-color #ccc
            &.active
              background-image linear-gradient(to bottom, #b5ea01, #10a21a)
</style>
