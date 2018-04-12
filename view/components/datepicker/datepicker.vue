<template>
    <div class="dp-mask" @touchmove.prevent>
      <div class="dp-box">
        <div class="dp-wrap">
          <div class="top-mask"></div>
          <div class="bottom-mask"></div>
          <div class="datewrap" ref="pickerwrap" v-for="(item, index) in setPickdate" v-if="index < col">
            <ul class="wheel-scroll" v-if="index===0">
              <li class="wheel-item" v-for="(itemcd, index) in item.arr">{{startYear + index}}年</li>
            </ul>
            <ul class="wheel-scroll" v-if="index===1">
              <li class="wheel-item" v-for="(itemcd, index) in item.arr">{{1 + index}}月</li>
            </ul>
            <ul class="wheel-scroll" v-if="index===2">
              <li class="wheel-item" v-for="(itemcd, index) in item.arr">{{1 + index}}日</li>
            </ul>
          </div>
        </div>
        <div class="dp-toolbar">
          <div class="cancel" @click.prevent.stop="cancelDate">取消</div>
          <div class="confirm" @click.prevent.stop="confirmDate">确定</div>
        </div>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll';
    export default {
      name: 'datepicker',
      data () {
        return {
          setPickdate: [
            {
              arr: []
            },
            {
              arr: []
            },
            {
              arr: []
            }
            ],
          chosedDate: [],
          pickScroll: [],
          transformYear: -1,
          transformMonth: -1,
          leapyear: !1,
          isfeb: !1
        };
      },
      props: {
        startYear: {
          type: Number,
          default: 1970
        },
        endYear: {
          type: Number,
          default: (new Date()).getFullYear()
        },
        col: {
          type: Number,
          default: 3
        }
      },
      created () {
        this.init();
      },
      watch: {
        transformYear (v) {
          let curY = this.startYear + v;
          this.leapyear = (curY % 400 === 0 || (curY % 4 === 0 && curY % 100 > 0));
          if (this.isfeb) {
            this.setPickdate[2].arr.splice(0);
            this.leapyear ? (this.setPickdate[2].arr.length = 29) : (this.setPickdate[2].arr.length = 28);
          }
          this.$nextTick(() => {
            this.pickScroll[2] && this.pickScroll[2].refresh();
          });
        },
        transformMonth (v) {
          let curM = 1 + v;
          let lmh = [1, 3, 5, 7, 8, 10, 12];
          let mmh = [4, 6, 9, 11];
          let smh = [2];
          this.setPickdate[2].arr.splice(0);
          this.isfeb = !1;
          lmh.indexOf(curM) < 0 || (this.setPickdate[2].arr.length = 31);
          mmh.indexOf(curM) < 0 || (this.setPickdate[2].arr.length = 30);
          smh.indexOf(curM) < 0 || (this.setPickdate[2].arr.length = 28, this.isfeb = !0);
          this.leapyear && smh.indexOf(curM) >= 0 && (this.setPickdate[2].arr.length = 29, this.isfeb = !0);
          this.$nextTick(() => {
            this.pickScroll[2] && this.pickScroll[2].refresh();
          });
        }
      },
      methods: {
        init () {
          this.setPickdate[0].arr.length = this.endYear - this.startYear + 1;
          this.setPickdate[1].arr.length = 12;
          this.setPickdate[2].arr.length = 30;
        },
        initScroll () {
          let that = this;
          this.$nextTick(() => {
            let domArr = this.$refs.pickerwrap;
            for (let p of domArr.map((item, index) => [index, item])) {
              that.pickScroll[p[0]] = new Bscroll(p[1], {
                click: true,
                probeType: 3,
                bounce: !1,
                wheel: {
                  selectedIndex: 0,
                  adjustTime: 100,
                  wheelWrapperClass: 'wheel-scroll',
                  wheelItemClass: 'wheel-item'
                }
              });
              that.pickScroll[p[0]].enable();
              that.pickScroll[p[0]].on('scrollEnd', () => {
                this.chosedDate[p[0]] = that.pickScroll[p[0]].getSelectedIndex();
                p[0] === 0 && (this.transformYear = this.chosedDate[p[0]]);
                p[0] === 1 && (this.transformMonth = this.chosedDate[p[0]]);
              });
            }
            this.transformYear = 0;
            this.transformMonth = 0;
          });
        },
        confirmDate () {
          this.closeScroll();
          this.pickScroll[0] && this.$emit('pickYear', this.pickScroll[0].getSelectedIndex() + this.startYear);
          this.pickScroll[1] && this.$emit('pickMonth', this.pickScroll[1].getSelectedIndex() + 1);
          this.pickScroll[2] && this.$emit('pickDay', this.pickScroll[2].getSelectedIndex() + 1);
          this.$emit('dpVisible', {'close': !1, 'confirmed': !0});
        },
        cancelDate () {
          this.closeScroll();
          this.$emit('dpVisible', {'close': !1, 'confirmed': !1});
        },
        closeScroll () {
          let domArr = this.$refs.pickerwrap;
          for (let p of domArr.map((item, index) => [index, item])) {
            this.pickScroll[p[0]].disable();
          }
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .dp-mask
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background-color rgba(0,0,0,0.5)
    display flex
    justify-content center
    align-items center
    .dp-box
      box-sizing content-box
      width px2rem(620)
      height px2rem(490)
      border px2rem(6) solid #5e7382
      border-radius px2rem(10)
      overflow hidden
      .dp-toolbar
        width 100%
        display flex
        background-color #fcfcfc
        font-size px2rem(26)
        height px2rem(90)
        line-height px2rem(90)
        &>div
          text-align center
          flex 1
        .cancel
          color #5e7382
        .confirm
          color #81add4
      .dp-wrap
        display flex
        width px2rem(620)
        height px2rem(400)
        background-color #00a0e9
        font-size px2rem(30)
        color #fff
        overflow hidden
        position relative
        .top-mask
          width 100%
          height px2rem(160)
          background-image linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
          position absolute
          top 0
          left 0
        .bottom-mask
          width 100%
          height px2rem(160)
          position absolute
          background-image linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
          bottom 0
          left 0
        .datewrap
          flex 1
          text-align center
          height 100%
          .wheel-scroll
            margin-top px2rem(160)
            .wheel-item
              width 100%
              height px2rem(80)
              line-height px2rem(80)
</style>
