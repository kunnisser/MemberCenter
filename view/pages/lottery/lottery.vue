<template>
    <div class="lottery-wrap">
      <div class="lottery-box">
        <div class="lottery-title">
          <b>抽奖次数:</b><span>当前剩余<strong>{{remain}}</strong>次</span>
        </div>
        <div class="lottery-plate" v-if="prizeItems && prizeItems[0]">
          <div :class="'plate-item' + (prizeItems[0].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[0].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[1].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[1].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[2].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[2].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[7].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[7].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div class="plate-item">
            <div class="plate-child"
                 :style="'background:url(' + startBtn + ') no-repeat center; background-size:100% 100%;'"
            @click.prevent.stop="roll">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[3].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[3].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[6].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[6].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[5].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[5].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
          <div :class="'plate-item' + (prizeItems[4].active ? ' active' : '')">
            <div class="plate-child"
                 :style="'background:url(' + prizeItems[4].firstimg + ') no-repeat center; background-size:50%;'">
            </div>
          </div>
        </div>
        <div class="lottery-broadcast">
          <h3><i class="icon-star"></i>中奖纪录 (已有{{prizeCounts}}人中奖)<i class="icon-star"></i></h3>
          <div class="bc-box">
            <marquee direction="up">
              <ul>
                <li v-for="item in prizeAccouts">
                  <span class="usname">{{item.userName}}</span>抽中了 <span class="pzname">{{item.title}}</span>
                  <span class="timer">{{getSendTime(new Date().getTime(), item.time)}}</span>
                </li>
              </ul>
            </marquee>
          </div>
        </div>
        <div class="lottery-rule">
          <h3>
            <span>抽奖规则</span>
            <hr />
          </h3>
          <p>1、会员日开启幸运抽奖</p>
          <p>2、100积分兑换一次抽奖机会</p>
          <p>3、每次会员日每人有5次抽奖机会</p>
          <p>4、请在个人中心查询所获得奖品</p>
        </div>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" class="default">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import {reqLottery, reqPrizeList} from 'mock/getMocks';
  import Tips from 'components/pop/poptips';
  import {mapState} from 'vuex';
  import {prostatus} from '../../utils/env';

  export default {
      name: 'lottery',
      data () {
        return {
          prizeItems: [],
          clickable: !0,
          popType: 'center',
          tiptext: '',
          tipvisible: !1,
          remain: 0,
          less_score: '0',
          notInTime: '0',
          prizeAccouts: [],
          prizeCounts: 0,
          startBtn: prostatus === 'development' ? '/static/image/roll-btn.png' : '/MemberCenter/static/image/roll-btn.png'
        };
      },
      created () {
        this.init();
      },
      computed: {
        ...mapState(['ucInfo'])
      },
      methods: {
        init () {
          this.reqLotteryList();
        },
        async reqLotteryList () {
          let respList = await reqPrizeList();
          for (let prize of respList.data.prizelist) {
            prize['active'] = !1;
            this.prizeItems.push(prize);
          }
          this.prizeAccouts = respList.data.prizeRecord;
          this.prizeCounts = respList.data.personCount;
          this.notInTime = respList.data.notInTime;
          this.remain = respList.data.remain;
          this.less_score = respList.data.less_score;
        },
        roll () {
          if (!this.clickable) {
            return;
          }
          this.clickable = !1;
          if (this.notInTime === '0') {
            this.setPoptips('请在会员日参加抽奖！');
            this.clickable = !0;
          } else if (!this.remain) {
            this.setPoptips('今日次数已用光');
            this.clickable = !0;
          } else if (this.less_score === '0') {
            this.setPoptips('积分不足, 请获取积分!');
            this.clickable = !0;
          } else {
            this.reqLottery();
          }
        },
        async reqLottery () {
          try {
            let resp = await reqLottery();
            if (resp.data.code === 'over_limit+times') {
              this.setTipsText('今日次数已用光');
              return;
            }
            let MaxNum = 16 + JSON.parse(resp.data.data).id;
            let startNum = 0;
            this.$store.state['ucInfo'].myscore = JSON.parse(resp.data.data).score;
            this.$store.state['ucInfo'].myprize = JSON.parse(resp.data.data).myprize;
            let timeLoop = setInterval(() => {
              for (let p of this.prizeItems) {
                p.active = !1;
              }
              this.prizeItems[startNum % 8].active = !0;
              startNum++;
              startNum >= MaxNum && (
                this.setPoptips(JSON.parse(resp.data.data).prizeName),
                clearInterval(timeLoop),
                this.remain = JSON.parse(resp.data.data).remain,
                this.less_score = JSON.parse(resp.data.data).less_score,
                this.clickable = !0
              );
            }, 300);
        } catch (e) {
            this.clickable = !0;
          }
        },
        setPoptips (text) {
          this.tipvisible = !0;
          this.tiptext = text;
        },
        closetips (v) {
          this.tipvisible = v;
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
        }
      },
      components: {
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .lottery-wrap
    padding px2rem(26)
    width 100%
    height 100%
    .lottery-box
      width 100%
      height 100%
      background-color #fff
      border-radius px2rem(10)
      padding px2rem(20)
      position relative
      overflow-y auto
      -webkit-overflow-scrolling touch
      .lottery-title
        width 100%
        height px2rem(80)
        line-height px2rem(80)
        text-align center
        color #474747
        font-size px2rem(34)
        & b
          font-weight bold
          margin-right px2rem(36)
        & strong
          font-size px2rem(45)
          color #ff9d16
          padding 0 px2rem(10)
          font-weight bold
      .lottery-plate
        margin-top px2rem(20)
        width 100%
        height px2rem(658)
        background url("../../assets/image/lottery-bg.png") no-repeat
        background-size 100% 100%
        padding px2rem(40)
        display flex
        flex-wrap wrap
        .plate-item
          width px2rem(180)
          height px2rem(180)
          margin-top px2rem(7)
          margin-left px2rem(10)
          background-color #fff
          border-radius px2rem(20)
          &.active
            background-color #fff366
          .plate-child
            width 100%
            height 100%
      .lottery-rule
        margin-top px2rem(10)
        & h3
          width px2rem(620)
          height px2rem(50)
          line-height px2rem(50)
          margin 0 auto
          position relative
          display flex
          justify-content center
          align-items center
          padding px2rem(50)
          & hr
            width 100%
            margin 0
          & span
            position absolute
            z-index 999
            display inline-block
            font-size px2rem(34)
            padding 0 px2rem(14)
            background-color #fff
        & p
          padding-left px2rem(42)
          font-size px2rem(26)
          line-height px2rem(50)

      .lottery-broadcast
        margin-top px2rem(24)
        padding px2rem(16)
        background-color #f3cf9f
        border-radius px2rem(24)
        & h3
          width px2rem(580)
          font-size px2rem(26)
          color #fff
          height px2rem(56)
          line-height px2rem(56)
          background-color #d9a768
          text-align center
          margin 0 auto
          position relative
          &::after
            content ''
            position absolute
            top 0
            width 0
            height 0
            border-left px2rem(20) solid #d9a768
            border-top px2rem(28) solid transparent
            border-bottom px2rem(28) solid transparent
            right px2rem(-18)
          &::before
            content ''
            position absolute
            top 0
            width 0
            height 0
            border-right px2rem(20) solid #d9a768
            border-top px2rem(28) solid transparent
            border-bottom px2rem(28) solid transparent
            left px2rem(-18)
          & i
            margin 0 px2rem(20)
            color #fff
        .bc-box
          margin-top px2rem(24)
          width 100%
          height px2rem(150)
          & marquee
            width 100%
            height 100%
            & ul
              padding px2rem(20) px2rem(10)
              font-size px2rem(24)
              color #000
              & li
                line-height px2rem(54)
                position relative
                .usname
                  width px2rem(110)
                  overflow hidden
                  text-overflow ellipsis
                  white-space nowrap
                  margin-right px2rem(20)
                .pzname
                  width px2rem(200)
                  overflow hidden
                  text-overflow ellipsis
                  white-space nowrap
                  margin-left px2rem(20)
                  color #fe0002
                .timer
                  position absolute
                  right 0
</style>
