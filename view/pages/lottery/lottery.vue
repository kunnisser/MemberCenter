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
</style>
