<template>
    <div class="index-wrap">
      <div class="index-scroll">
        <div class="top-nav">
          <div class="nav-score" @click="linkPage('/uc/myscore')">
            <div class="nav-text"><i>{{ucInfo.myscore}}</i> 积分</div></div>
          <div class="nav-card" @click="linkPage('/uc/mycard')">
            <div class="nav-text">我的卡券<span>x{{ucInfo.mycardnum}}</span></div>
          </div>
        </div>
        <div class="index-body">
          <div class="index-header">
            <div class="header-item">
              <div class="item-avator" @click.prevent.stop="linkPage('/uc/index')">
                <img :src="personInfo.headimgurl">
              </div>
            </div>
          </div>
          <div class="index-nick">
            <div class="nick-wrap">
              {{personInfo.username}}
            </div>
          </div>
          <div class="sign-box">
            <h3>
              连续签到<span>赢积分</span>
            </h3>
            <div class="sign-day">已连续签到<span>{{ucInfo.signday}}</span>天, 连签7天领福利！</div>
            <div class="sign-wrap">
              <div ref="pointer" :class="'jjd-pointer' + (signing ? ' jump' : '')" :style="'left: ' + parseFloat((ucInfo.signday < 2 ? 0 : ucInfo.signday - 1) * 1.2 - 0.32)  + 'rem;'"></div>
              <div class="sign-flex" v-for="(item, index) in signDayArr">
                <i :class="index < ucInfo.signday ? 'active' : ''" @click="sign(index)">{{index + 1}}天</i>
              </div>
              <div class="coin-tip"></div>
            </div>
          </div>
          <div class="index-entry">
            <div class="feed-entry">
              <div class="feed-wrap" @click="linkPage('/manor')">
                <div class="feed-tip"></div>
                <div class="feed-body"></div>
                <div class="feed-base"></div>
              </div>
            </div>
            <div class="lottery-entry">
              <div class="lottery-wrap" @click="linkPage('/lottery')">
                <div class="lottery-tip"></div>
                <div class="lottery-body"></div>
                <div class="lottery-base"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-footer :activeIndex="activeIndex"></v-footer>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" class="default">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import {sign} from '../../mock/getMocks';
  import Footer from '../../components/footer/footerMenu';
  import Tips from '../../components/pop/poptips';
  import {mapState} from 'vuex';
    export default {
      name: 'index',
      data () {
        return {
          pageInfo: {},
          activeIndex: 2,
          signInfo: {},
          popType: 'center',
          tiptext: '',
          tipvisible: !1,
          signDayArr: new Array(7),
          signing: !1
        };
      },
      created () {
        // this.initSignDay();
      },
      computed: {
        ...mapState(['personInfo', 'ucInfo'])
      },
      mounted () {
        document.querySelector('#manor').style.display = 'none';
      },
      methods: {
        initSignDay () {
          this.currentDate = new Date();
          this.signInfo['month'] = this.currentDate.getMonth() + 1;
          this.signInfo['monthEn'] = this.monthsInEn[this.currentDate.getMonth()];
          this.currentTime = this.currentDate.getTime();
          let oneday = 864e5;
          for (let t = -1, e = 4; t <= e; t++) {
            let settingTime = this.currentTime + t * oneday;
            let settingDay = (new Date(settingTime)).getDate();
            this.signDayArr.push(settingDay);
          }
        },
        sign (index) {
          if ((index) !== parseInt(this.$store.state['ucInfo'].signday)) {
            return;
          }
          this.$store.state['ucInfo'].signed ? this.setPoptips('已经签过的啦！')
            : this.putsign();
        },
        /* 请求首页签到 */
        async putsign () {
          try {
            let resp = await sign();
            if (resp.data.code === '-1') {
              this.setPoptips('签到失败！');
            } else {
              this.$store.state['ucInfo'].signed = !0;
              this.$store.state['ucInfo'].signday++;
              this.signing = !0;
              setTimeout(() => {
                this.signing = !1;
              }, 800);
              this.$store.state['ucInfo'].myscore = resp.data.data;
              this.setPoptips('签到成功！');
            }
            console.log(resp);
          } catch (e) {
            console.log(e);
            this.setPoptips('连接失败，请重试！');
          }
        },
        setPoptips (text) {
          this.tipvisible = !0;
          this.tiptext = text;
        },
        closetips (v) {
          this.tipvisible = v;
        },
        linkPage (path) {
          this.$router.push({path});
        }
      },
      components: {
        'v-footer': Footer,
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .index-wrap
    position relative
    width 100%
    height 100%
    .index-scroll
      position absolute
      width 100%
      top 0
      bottom px2rem(140)
      .top-nav
        position relative
        width 100%
        height px2rem(70)
        line-height px2rem(56)
        & i
          font-weight bold
          font-style normal
          font-size px2rem(30)
          margin-top px2rem(4)
        &>div
          width px2rem(232)
          height px2rem(70)
          position absolute
          top 0
          .nav-text
            width px2rem(200)
            text-align center
            font-weight bold
            font-size px2rem(24)
            color #fff
        .nav-score
          left 0
          background url("../../assets/image/nav_l.png") no-repeat
          background-size 100% 100%
          -webkit-text-stroke px2rem(1) #a20000
          text-shadow px2rem(2) px2rem(2) px2rem(4) #a20000
        .nav-card
          display flex
          justify-content flex-end
          right 0
          background url("../../assets/image/nav_r.png") no-repeat
          background-size 100% 100%
          -webkit-text-stroke px2rem(1) #005500
          text-shadow px2rem(2) px2rem(2) px2rem(4) #005500
          & span
            padding px2rem(0) px2rem(10)
            border-radius px2rem(10)
            margin-left px2rem(8)
            position relative
            bottom px2rem(10)
            font-size px2rem(14)
            background-color #eb6100
            -webkit-text-stroke 0
            text-shadow none
            color #fff
      .index-body
        padding px2rem(30)
        .index-header
          display flex
          width 100%
          font-size px2rem(34)
          height px2rem(116)
          .header-item
            position relative
            flex 1
            text-align center
            .item-avator
              width px2rem(166)
              height px2rem(166)
              border-radius 50%
              left 50%
              margin-left px2rem(-83)
              overflow hidden
              position absolute
              top px2rem(-78)
              box-shadow 0 0 px2rem(18) rgba(255,255,255,0.8)
              & img
                display block
                width 100%
                height 100%
        .index-nick
          display flex
          width 100%
          justify-content center
          .nick-wrap
            width px2rem(502)
            height px2rem(46)
            line-height px2rem(46)
            text-align center
            background url("../../assets/image/avator-decorate.png") no-repeat center
            background-size 100% 100%
            font-size px2rem(44)
            color #fff
            font-weight bolder
            -webkit-text-stroke px2rem(3) #003366
        .sign-box
          margin-top px2rem(46)
          width 100%
          height px2rem(350)
          border-radius px2rem(18)
          background-color #7fc9eb
          border px2rem(8) solid #fff
          box-shadow 0 0 px2rem(6) rgba(0,0,0,0.6)
          padding px2rem(26)
          & h3
            position relative
            font-size px2rem(44)
            width 100%
            height px2rem(44)
            line-height px2rem(44)
            color #003366
            text-align center
            letter-spacing px2rem(4)
            font-weight bold
            & span
              color #ff4500
          .sign-day
            text-align center
            font-size px2rem(24)
            color #003366
            height px2rem(60)
            line-height px2rem(60)
            font-weight 400
          .sign-wrap
            display flex
            height px2rem(122)
            padding-top px2rem(150)
            margin-left px2rem(-20)
            position relative
            .jjd-pointer
              width px2rem(142)
              height px2rem(132)
              background url("../../assets/image/jjd-cursor.png") no-repeat
              background-size 100% 100%
              position absolute
              top px2rem(-4)
              z-index 99
              transition left 200ms ease-in
              &.jump
                animation tada 800ms ease
            .coin-tip
              width px2rem(140)
              height px2rem(74)
              background url("../../assets/image/coin-tip.png") no-repeat
              background-size 100% 100%
              position absolute
              right px2rem(-20)
              top px2rem(-80)
            .sign-flex
              display flex
              justify-content center
              align-items center
              font-size px2rem(25)
              flex 1
              & i
                position relative
                display block
                font-style normal
                width px2rem(84)
                height px2rem(54)
                line-height px2rem(54)
                font-size px2rem(22)
                padding-left px2rem(36)
                background-color #df9b5e
                margin-right px2rem(4)
                color #8c3f06
                box-shadow 0 0 px2rem(6) #8c3f06
                font-weight bold
                &:after
                  position absolute
                  right px2rem(-26)
                  box-sizing border-box
                  content ''
                  width 0
                  height px2rem(54)
                  border-top px2rem(27) solid transparent
                  border-bottom px2rem(27) solid transparent
                  border-left px2rem(27) solid #df9b5e
                &:before
                  position absolute
                  left px2rem(-3)
                  box-sizing border-box
                  content ''
                  width 0
                  height px2rem(54)
                  border-top px2rem(27) solid transparent
                  border-bottom px2rem(27) solid transparent
                  border-left px2rem(27) solid #7fc9eb
              .active
                background-color #ff4600
                color #feee32
                &:after
                  border-left px2rem(27) solid #ff4600
            for n in 1 2 3 4 5 6 7
              .sign-flex:nth-child({8 - n})
                & i
                  z-index n
        .index-entry
          display flex
          width 100%
          padding-top px2rem(50)
          &>div
            display flex
            flex 1
            justify-content center
            align-items center
            position relative
            .feed-tip
              width px2rem(110)
              height px2rem(122)
              background url("../../assets/image/if-tip.png") no-repeat
              background-size 100% 100%
              position absolute
              z-index 999
              left px2rem(10)
              top px2rem(76)
              animation shake 2400ms infinite
            .feed-body
              width px2rem(176)
              height px2rem(206)
              background url("../../assets/image/Doginterface.png") no-repeat
              background-size 100% 100%
              position relative
              left px2rem(60)
              top px2rem(20)
              z-index 99
              transition all 500ms ease
            .feed-base
              position relative
              z-index 9
              width px2rem(276)
              height px2rem(94)
              background url("../../assets/image/if-base.png") no-repeat
              background-size 100% 100%
            .lottery-tip
              width px2rem(336)
              height px2rem(258)
              background url("../../assets/image/wastepaper.png") no-repeat
              background-size 100% 100%
              position absolute
              z-index 99
              left 0
              top 0
              animation suspend 3s ease-in-out infinite
            .lottery-body
              width px2rem(256)
              height px2rem(256)
              background url("../../assets/image/dial.png") no-repeat
              background-size 100% 100%
              position relative
              z-index 9
              top px2rem(16)
              margin 0 auto
              animation dial 3s ease infinite
            .lottery-base
              width px2rem(322)
              height px2rem(56)
              background url("../../assets/image/lottery-base.png") no-repeat
              background-size 100% 100%
              position relative
              z-index 8
              margin 0 auto
              bottom px2rem(20)

  @keyframes shake {
    0% {
      transform rotatey(0deg)
    }

    50% {
      transform rotate(50deg)
    }

    100% {
      transform rotate(0deg)
    }
  }

  @keyframes suspend {
    0% {
      transform translate3d(0, 0, 0) scale(1)
    }
    50% {
      transform translate3d(0, px2rem(10), 0) scale(1.1)
    }
    100% {
      transform translate3d(0, 0, 0) scale(1)
    }
  }

  @keyframes dial {
    from {
      transform rotate(0deg)
    }
    to {
      transform rotate(360deg)
    }
  }

  @-webkit-keyframes tada {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    10%,
    20% {
      -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
      transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    }

    30%,
    50%,
    70%,
    90% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
      transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }

    40%,
    60%,
    80% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
      transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  @keyframes tada {
    from {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }

    10%,
    20% {
      -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
      transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    }

    30%,
    50%,
    70%,
    90% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
      transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }

    40%,
    60%,
    80% {
      -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
      transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }

    to {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }

  .tada {
    -webkit-animation-name: tada;
    animation-name: tada;
  }
</style>
