<template>
    <div class="index-wrap">
      <div class="index-scroll">
        <v-swiper ref="swiper">
          <div class="slide-item" v-for="item in personInfo.index_banner">
            <div class="slide-pic" :style="`background: url(${item.img_link}) no-repeat center;`" @click.prevent.stop="bannerLink(item.url_link)"></div>
          </div>
        </v-swiper>
        <div class="top-nav">
          <div class="nav-score" @click="linkPage('/uc/myscore')">
            <div class="icon"></div>
            <div class="nav-text"><i>{{ucInfo.myscore}}</i></div>
          </div>
          <div class="nav-card" @click="linkPage('/uc/mycard')">
            <div class="icon"><span>{{ucInfo.mycardnum}}</span></div>
            <div class="nav-text">我的卡券</div>
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
            <div class="sign-title">
              <h4>已连续签到<strong>{{ucInfo.signday}}</strong>天</h4>
              <h2>连签<strong>7</strong>天领福利！</h2>
            </div>
            <div class="sign-wrap">
              <div class="sign-flex" v-for="(item, index) in signDayArr" :class="index < ucInfo.signday ? 'active' : ''" @click="sign(index)">
                <div :class="`sign-wrapper ${index > ucInfo.signday ? 'new-pointer' : index === ucInfo.signday ? 'cur-pointer' : ''}`">
                  <h3>星期{{item}}</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="index-entry">
            <div class="feed-entry">
              <div class="feed-wrap" @click="linkPage('/manor')">
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
  import Swiper from '../../components/scroll/swiper';
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
          signDayArr: ['一', '二', '三', '四', '五', '六', '日'],
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
      watch: {
        personInfo: {
          handler: function () {
            this.$refs.swiper.update();
          },
            deep: true
        }
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
        },
        bannerLink (path) {
          window.location.href = path;
        }
      },
      components: {
        'v-footer': Footer,
        'v-tips': Tips,
        'v-swiper': Swiper
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
      overflow-y auto
      -webkit-overflow-scrolling touch
      .slide-item
        width px2rem(750)
        height px2rem(340)
        .slide-pic
          width 100%
          height 100%
          border-radius 0 0 50% 40%/16%;
      .top-nav
        position relative
        width 100%
        z-index 9999
        & i
          font-weight bold
          font-style normal
          font-size px2rem(30)
          margin-top px2rem(4)
        &>div
          width px2rem(232)
          position absolute
          top px2rem(20)
          .icon
            width px2rem(104)
            height px2rem(72)
            margin 0 auto
          .nav-text
            width 100%
            text-align center
            font-weight bold
            font-size px2rem(24)
            color #fff
            margin-top px2rem(20)
        .nav-score
          left 0
          .icon
            background url("../../assets/image/nav_l.png") no-repeat
            background-size 100% 100%
        .nav-card
          right 0
          .icon
            background url("../../assets/image/nav_r.png") no-repeat
            background-size 100% 100%
            position relative
            & span
              padding px2rem(5) px2rem(10)
              border-radius 50%
              position absolute
              top 0
              right 0
              font-size px2rem(26)
              background-color #ff0000
              -webkit-text-stroke 0
              text-shadow none
              color #fff
      .index-body
        padding px2rem(30)
        position relative
        top px2rem(-40)
        z-index 999
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
            line-height px2rem(42)
            text-align center
            font-size px2rem(32)
            color #fff
            font-weight bolder
        .sign-box
          margin-top px2rem(46)
          width 100%
          height px2rem(410)
          border-radius px2rem(18)
          background-color #dfc391
          border px2rem(8) solid #bd7c35
          box-shadow 0 0 px2rem(6) rgba(0,0,0,0.6)
          padding px2rem(16)
          .sign-title
            position relative
            top px2rem(-48)
            width 100%
            height px2rem(168)
            background url("../../assets/image/signTitle.png") no-repeat;
            background-size 100% 100%
            color #fff
            padding-left px2rem(42)
            font-style italic
            text-shadow 0 0 px2rem(6) rgba(0,0,0,0.9)
            & h4
              font-size px2rem(20)
              height px2rem(24)
              line-height px2rem(24)
              font-weight bold
              padding-top px2rem(68)
              margin-bottom px2rem(10)
              box-sizing content-box
              & strong
                color #fde76d
                font-weight bold
                font-size px2rem(32)
                margin 0 px2rem(10)
            & h2
              font-size px2rem(32)
              height px2rem(30)
              line-height px2rem(40)
              font-weight bold
              padding-left px2rem(90)
              & strong
                color #056bea
                font-weight bold
                font-size px2rem(40)
                margin 0 px2rem(10)
                text-shadow 0 px2rem(4) px2rem(10) rgba(0, 0, 0, 0.8)
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
            padding px2rem(20)
            position relative
            box-shadow 0 0 px2rem(6) rgba(0, 0, 0, 0.8) inset
            border-radius px2rem(8)
            background-color #d5b680
            .sign-flex
              display flex
              font-size px2rem(25)
              flex 1
              width px2rem(100)
              height px2rem(160)
              background url("../../assets/image/sign-item.png") no-repeat
              background-size 100% 100%
              position relative
              & h3
                position absolute
                top 0
                left 0
                width 100%
                padding-left px2rem(12)
                margin-top px2rem(10)
                font-size px2rem(18)
                font-weight bold
                color #bb4f00
                z-index 999
              .sign-wrapper
                width 100%
                height 100%
                &.new-pointer
                  background url("../../assets/image/jjd-cursor_dis.png") no-repeat center
                  z-index 99
                  opacity 0.6
                  background-size px2rem(84) px2rem(82)
                &.cur-pointer
                  background url("../../assets/image/jjd-cursor.png") no-repeat center
                  background-size px2rem(84) px2rem(82)
              &.active
                background url("../../assets/image/signed-item.png") no-repeat
                background-size 100% 100%
            for n in 1 2 3 4 5 6 7
              .sign-flex:nth-child({8 - n})
                & i
                  z-index n
        .index-entry
          display flex
          width 100%
          padding-top px2rem(16)
          &>div
            width 50%
            flex 1
            height px2rem(260)
            justify-content center
            align-items center
            position relative
            background-color #dfc391
            border px2rem(8) solid #bd7c35
            box-shadow 0 0 px2rem(6) rgba(0, 0, 0, 0.8) inset
            border-radius px2rem(8)
            margin-left px2rem(16)
            overflow hidden
            &:first-child
              margin-left 0
            .feed-body
              width 100%
              height 100%
              background url("../../assets/image/Doginterface.png") no-repeat center
              position absolute
              z-index 99
            .feed-base
              width 100%
              height 100%
              background url("../../assets/image/feed-base.png") no-repeat center
              background-size 100% 100%
              position absolute
              z-index 9
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
              position absolute
              z-index 9
              top px2rem(0)
              margin 0 auto
              animation dial 3s ease infinite
            .lottery-base
              width 100%
              height px2rem(56)
              background url("../../assets/image/lottery-base.png") no-repeat
              background-size 100% 100%
              position absolute
              z-index 8
              bottom 0
              left 0

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
