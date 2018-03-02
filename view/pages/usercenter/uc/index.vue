<template>
    <div class="uc-wrap">
      <div class="uc-avator" @click.prevent.stop="linkEditUserinfo">
        <div class="avator-wrap">
          <img :src="personInfo.headimgurl">
        </div>
        <div class="avator-text" v-if="personInfo">
          <div class="text-wrap">
            <div class="avator-name">{{personInfo.username}}</div>
            <div :class="!personInfo.sex ? 'gender male':'gender female'"></div>
            <div class="nextPage"></div>
          </div>
        </div>
      </div>
      <div class="uc-list">
        <div class="uc-item" v-for="(item, index) in listData" @click.prevent.stop="linkItem(item.linkpath)">
          <div class="item-wrap">
            <div :class="'item-icon ' + item.icon"></div>
            <div class="item-name">{{item.name}}</div>
            <div class="update-box">
              <div :class="item.num ? 'item-num': 'item-num none'" v-if="item.num && !Number.isFinite(item.num)">有更新<span></span></div>
              <div :class="item.num ? 'item-num': 'item-num none'" v-if="Number.isFinite(item.num) && item.num">{{item.num}}</div>
            </div>
          </div>
        </div>
      </div>
      <v-hobby :background="personInfo.bannerurl_index" :linkhref="personInfo.bannerhref_index">
          <h2 slot="share-title">分享好友</h2>
          <p slot="share-text">999积分等你来拿</p>
      </v-hobby>
      <!--<div class="btn-wrap">-->
        <!--<button type="button" class="exit-btn">退出登录</button>-->
      <!--</div>-->
    </div>
</template>
<script type="text/ecmascript-6">
  import Hobby from '../../../components/banner/hobby';
  import {mapState} from 'vuex';
    export default {
      name: 'ucindex',
      data () {
        return {
          pageData: {},
          listData: [
            {
              name: '我的积分',
              num: 0,
              icon: 'uc-score',
              linkpath: 'myscore'
            },
            {
              name: '我的卡券',
              num: 0,
              icon: 'uc-card',
              linkpath: 'mycard'
            },
            {
              name: '我的奖品',
              num: 0,
              icon: 'uc-prize',
              linkpath: 'myprize'
            },
            {
              name: '我的订单',
              num: 0,
              icon: 'uc-order',
              linkpath: 'myorder'
            },
            {
              name: '我的会员社区',
              num: 0,
              icon: 'uc-bbs',
              linkpath: 'myzone'
            },
            {
              name: '我的互动',
              num: 0,
              icon: 'uc-message',
              linkpath: 'myinteraction'
            }
          ],
          bgurl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514991282357&di=ad579b26ecd66b64a92e04c04090f309&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01091b596d6820a8012193a331a068.png%401280w_1l_2o_100sh.png'
        };
      },
      computed: {
        ...mapState(['ucInfo', 'personInfo'])
      },
      mounted () {
        this.pageData = this.$store.state.ucInfo;
        this.init();
      },
      methods: {
        init () {
          this.listData[0].num = this.pageData.myscore;
          this.listData[1].num = this.pageData.mycardnum;
          this.listData[2].num = this.pageData.myprize;
          this.listData[3].num = this.pageData.myorder;
          this.listData[4].num = this.pageData.mynews;
          this.listData[5].num = this.pageData.mymessage;
        },
        linkEditUserinfo () {
          this.$router.push({
            path: '/uc/edit'
          });
        },
        linkItem (path) {
          if (path === 'myzone') {
            this.$store.state.myZoneIndex = 0;
          }
          this.$router.push({
            path: '/uc/' + path
          });
        }
      },
      watch: {
        ucInfo: {
          handler (curVal) {
            this.pageData = curVal;
            this.init();
          },
          deep: true
        }
      },
      components: {
        'v-hobby': Hobby
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../assets/stylus/mixin.styl';
  .uc-wrap
    padding px2rem(20)
    .uc-avator
      display flex
      width 100%
      height px2rem(240)
      background-color #035aa8
      border-radius px2rem(16)
      border px2rem(10) solid #024a8d
      box-shadow 0 0 px2rem(4) rgba(0,0,0,0.6)
      .avator-wrap
        display flex
        justify-content center
        align-items center
        width px2rem(240)
        flex 0 0 px2rem(240)
        & img
          display block
          width px2rem(160)
          height px2rem(160)
          border px2rem(8) solid #fff
          border-radius 50%
      .avator-text
        display flex
        flex 1
        justify-content center
        align-items center
        color #fff
        position relative
        .text-wrap
          width 100%
          .avator-name
            font-size px2rem(36)
            font-weight bold
            -webkit-text-stroke px2rem(2) #003366
          .gender
            margin-top px2rem(18)
          .male
            width px2rem(42)
            height px2rem(42)
            background url("../../../assets/image/gender-male.png") no-repeat
            background-size 100% 100%
          .female
            width px2rem(36)
            height px2rem(50)
            background url("../../../assets/image/gender-female.png") no-repeat
            background-size 100% 100%
          .nextPage
            position absolute
            width px2rem(34)
            height px2rem(50)
            background url("../../../assets/image/enter.png") no-repeat
            background-size 100% 100%
            right px2rem(56)
            top 50%
            margin-top px2rem(-25)
    .uc-list
      margin-top px2rem(24)
      display flex
      flex-wrap wrap
      .uc-item
        min-width 33%
        height px2rem(240)
        flex 1
        font-size px2rem(30)
        text-align center
        color #fff
        display flex
        align-items flex-end
        justify-content center
        .item-wrap
          .item-name
            padding px2rem(30) 0
          .update-box
            height px2rem(34)
            .item-num
              width px2rem(130)
              text-align center
              font-size px2rem(18)
              margin 0 auto
              background-color #024a8d
              height px2rem(34)
              line-height px2rem(34)
              border-radius px2rem(34)
              position relative
              &.none
                opacity 0
              & span
                width px2rem(6)
                height px2rem(6)
                background-color #90caf2
                display block
                border-radius 50%
                position absolute
                right px2rem(26)
                top px2rem(6)
          .item-icon
            margin 0 auto
            &.uc-score
              width px2rem(90)
              height px2rem(62)
              background url("../../../assets/image/uc-score.png") no-repeat
              background-size 100% 100%
            &.uc-card
              width px2rem(86)
              height px2rem(60)
              background url("../../../assets/image/uc-card.png") no-repeat
              background-size 100% 100%
            &.uc-prize
              width px2rem(88)
              height px2rem(66)
              background url("../../../assets/image/uc-prize.png") no-repeat
              background-size 100% 100%
            &.uc-order
              width px2rem(66)
              height px2rem(66)
              background url("../../../assets/image/uc-order.png") no-repeat
              background-size 100% 100%
            &.uc-bbs
              width px2rem(74)
              height px2rem(70)
              background url("../../../assets/image/uc-bbs.png") no-repeat
              background-size 100% 100%
            &.uc-message
              width px2rem(60)
              height px2rem(68)
              background url("../../../assets/image/uc-message.png") no-repeat
              background-size 100% 100%
    .exit-btn
      background-color #15a1db
      -webkit-text-stroke px2rem(2) #003366
      box-shadow 0 px2rem(4) px2rem(8) #005aa0
</style>
