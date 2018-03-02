<template>
    <div class="prize-wrap">
      <div class="prize-box">
        <v-scroll ref="scrollview" :loadMore="false" v-if="pageData.prizeData && pageData.prizeData.length">
          <div slot="defaultScroll">
            <div class="prize-item" v-for="(item, index) in pageData.prizeData">
              <div class="prize-thumb">
                <img :src="item.prizepic">
              </div>
              <div class="prize-info">
                <div class="info-wrap">
                  <h3>{{item.title}}</h3>
                  <p>有效期至{{item.timestamp}}</p>
                </div>
              </div>
              <div class="prize-btn">
                <button type="button" :class="checkPrizeStatus(item.status).prizeClass" @click.prevent.stop="receive(item.id, index, $event)">
                  {{checkPrizeStatus(item.status).text}}
                </button>
              </div>
            </div>
          </div>
        </v-scroll>
        <div class="no-data" v-else>暂无奖品</div>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" class="default">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from '../../../../components/scroll/scrollView';
  import {getUserPrize, receivePrize} from '../../../../mock/getMocks';
  import Tips from 'components/pop/poptips';
  import {mapState} from 'vuex';
    export default {
      name: 'myprize',
      data () {
        return {
          pageData: {
            prizeData: [],
            prizeStatus: [
              {
                prizeClass: 'usable',
                text: '立即领取'
              },
              {
                prizeClass: 'unusable',
                text: '已经领取'
              },
              {
                prizeClass: 'unusable',
                text: '已过期'
              }
            ]
          },
          popType: 'center',
          tiptext: '',
          tipvisible: !1
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
          this.getUserPrize();
        },
        async getUserPrize () {
          let resOfPrize = await getUserPrize();
          this.pageData.prizeData = resOfPrize.data;
          this.$nextTick(() => {
            this.$refs.scrollview && this.$refs.scrollview.scroll && this.$refs.scrollview.refresh();
          });
        },
        checkPrizeStatus (s) {
          if (s === '0') {
            return this.pageData.prizeStatus[0];
          }
          if (s === '1') {
            return this.pageData.prizeStatus[1];
          }
          if (s === '-1') {
            return this.pageData.prizeStatus[2];
          }
        },
        receive (id, index) {
          this.receivePrize({'prizeRecordId': id}, index);
        },
        async receivePrize (param, index) {
          try {
            let resp = await receivePrize(param);
            resp.data.code === 'success' && (this.setPoptips('领取成功'),
              this.pageData.prizeData[index].status = '1',
              this.$store.state.ucInfo.myscore = resp.data.data.score,
              this.$store.state.ucInfo.myprize = resp.data.data.not_receive_num);
            resp.data.code === 'overTime' && this.setPoptips('已过期');
            resp.data.code === 'allreadyReceived' && this.setPoptips('已经领取');
          } catch (e) {
            this.setPoptips('网络连接错误，请重试！');
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
        'v-scroll': Scroll,
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../assets/stylus/mixin.styl';
  .prize-wrap
    padding px2rem(34)
    width 100%
    height 100%
    .prize-box
      position relative
      width 100%
      height 100%
      overflow hidden
      .prize-item
        display flex
        width 100%
        padding px2rem(36) px2rem(22)
        height px2rem(180)
        background-color #fff
        margin-bottom px2rem(30)
        border-radius px2rem(10)
        overflow hidden
        &.prize-item:last-child
          margin-bottom 0
        .prize-thumb
          width px2rem(110)
          flex 0 0 px2rem(110)
          height px2rem(110)
          border px2rem(1) solid #f2f2f2
          & img
            display block
            width 100%
            height 100%
        .prize-info
          display flex
          align-items center
          width px2rem(340)
          font-size px2rem(32)
          color #404040
          padding-left px2rem(26)
          & p
            font-size px2rem(18)
            margin-top px2rem(30)
        .prize-btn
          flex 1
          & button
            width px2rem(166)
            height px2rem(82)
            font-size px2rem(24)
            font-weight bold
            color #fff
          .usable
            background url("../../../../assets/image/usable-btn.png") no-repeat
            background-size 100% 100%
            -webkit-text-stroke px2rem(2) #b33600
          .unusable
            background url("../../../../assets/image/unusable-btn.png") no-repeat
            background-size 100% 100%
            -webkit-text-stroke px2rem(2) #9c9c9c
</style>
