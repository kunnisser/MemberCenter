<template>
    <div class="mall-wrap">
      <div class="mall-banner" :style="'background-repeat: no-repeat; background-image:url(' + personInfo.bannerurl_shop + '); background-size: 100% 100%;'"
      @click.prevent.stop="linkout(personInfo.bannerhref_shop)"></div>
      <v-topnav :navIndex="pageData.navIndex" :navData="pageData.navData" @linkNav="linkMallNav"></v-topnav>
      <div class="recommended-wrap" v-show="pageData.currentTab === 'scorepay'">
        <v-scroll ref="scorepay" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMoreListData(dispatchCurrentParams())" v-if="!pageData.noData">
          <div slot="scrolllist" class="inner-wrap">
            <div class="scroll-item" v-for="item in ListData[pageData.navIndex].listArr">
              <div class="flex-wrap" @click.prevent.stop="linkDetail(item.id)">
                <div class="flex-header">
                  <div class="goodspic" :style="'background-image:url(' + item.firstimg + '); background-size:cover; background-repeat: no-repeat;'"></div>
                </div>
                <div class="goods-content">
                  <div class="goods-wrap">
                    <h3>{{item.title}}</h3>
                    <p class="discountBigfont">{{item.score}}</p>
                    <p class="originalfont">{{item.orig}}</p>
                    <div class="limitfont">
                      <p>有效期至{{item.endtime}}</p>
                      <p>仅限{{item.scene_info}}使用</p>
                    </div>
                    <!--<div class="buybtn">-->
                      <!--<button type="button">立即兑换</button>-->
                    <!--</div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-scroll>
        <div class="no-data" v-else>- 暂无兑换内容 -</div>
      </div>
      <div class="recommended-wrap" v-show="pageData.currentTab === 'mbdiscount'">
        <v-scroll ref="mbdiscount" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMoreListData(dispatchCurrentParams())" v-if="!pageData.noData">
          <div slot="scrolllist" class="inner-wrap">
            <div class="scroll-item" v-for="item in ListData[pageData.navIndex].listArr">
              <div class="flex-wrap" @click.prevent.stop="linkDetail(item.id)">
                <div class="flex-header">
                  <div class="goodspic" :style="'background-image:url(' + item.firstimg + '); background-size:cover; background-repeat: no-repeat;'"></div>
                </div>
                <div class="goods-content">
                  <div class="goods-wrap">
                    <h3>{{item.title}}</h3>
                    <p class="discountfont">{{item.score}}分 +{{item.money ? ' ¥' + item.money : ''}}</p>
                    <p class="originalfont">{{item.orig}}</p>
                    <div class="limitfont">
                      <p>有效期至{{item.endtime}}</p>
                      <p>仅限{{item.scene_info}}使用</p>
                    </div>
                    <!--<div class="buybtn">-->
                      <!--<button type="button">立即抢购</button>-->
                    <!--</div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-scroll>
        <div class="no-data" v-else>- 暂无相关折扣 -</div>
      </div>
      <v-footer :activeIndex="activeIndex"></v-footer>
    </div>
</template>
<script type="text/ecmascript-6">
  import TopNav from 'components/navbar/topnav';
  import Scroll from 'components/scroll/scrollView';
  import Footer from 'components/footer/footerMenu';
  import {getRecommendScore} from 'mock/getMocks';
  import {mapState} from 'vuex';
    export default {
      name: 'mall-index',
      data () {
        return {
          activeIndex: 0,
          pageData: {
            navIndex: 0,
            currentTab: 'scorepay',
            navData: [
              {
                name: '积分兑换',
                type: 'scorepay'
              },
              {
                name: '会员折扣',
                type: 'mbdiscount'
              }
            ],
            loadstatus: 0,
            noData: !1
          },
          ListData: [
            {
              currentIndex: 1,
              fetchApi: 'score',
              currentArr: [],
              listArr: []
            },
            {
              currentIndex: 1,
              fetchApi: 'discount',
              currentArr: [],
              listArr: []
            }
          ]
        };
      },
      created () {
        this.init();
      },
      computed: {
        ...mapState(['personInfo'])
      },
      methods: {
        init () {
          if (this.$route.query.index) {
            this.pageData.navIndex = parseInt(this.$route.query.index);
            this.linkMallNav(['mbdiscount', this.pageData.navIndex]);
          }
          this.generateListData(this.dispatchCurrentParams());
        },
        linkMallNav (v) {
          this.pageData.navIndex = v[1];
          this.pageData.currentTab = v[0];
          this.pageData.loadstatus = 0;
          this.ListData[v[1]].currentIndex = 1;
          this.ListData[v[1]].listArr = [];
          this.generateListData(this.dispatchCurrentParams());
          this.$refs[this.pageData.currentTab] && this.$refs[this.pageData.currentTab].scroll.scrollTo(0, 0);
        },
        /* 构建参数 */
        dispatchCurrentParams () {
          return this.ListData[this.pageData.navIndex];
        },
        /*
        * @param currentIndex 当前页号
        * @param fetchApi 接口对象
        * @param currentArr 当前页数据
        * @param 页面list拼接总数据
        * */
        async generateListData ({currentIndex, fetchApi, currentArr, listArr} = this.dispatchCurrentParams()) {
          try {
            let Resp = await getRecommendScore({
              type: fetchApi,
              pageNow: currentIndex,
              pageSize: 5
            });
            if (Resp.statusText === 'OK') {
              currentArr = JSON.parse(Resp.data.data).list.length ? JSON.parse(Resp.data.data).list : [];
              listArr = listArr.concat(currentArr);
              this.ListData[this.pageData.navIndex].currentArr = currentArr;
              this.ListData[this.pageData.navIndex].listArr = listArr;
              this.$nextTick(() => {
                this.$refs[this.pageData.currentTab] && this.$refs[this.pageData.currentTab].refresh();
              });
            }
          } catch (e) {
            this.ListData[this.pageData.navIndex].currentArr = [];
            this.pageData.noData = !this.ListData[this.pageData.navIndex].listArr.length;
          }
          this.pageData.noData = !this.ListData[this.pageData.navIndex].listArr.length;
        },
        /*
        * 加载更多
        * */
        loadMoreListData ({currentIndex, currentArr} = this.dispatchCurrentParams()) {
          currentArr.length && currentIndex++;
          this.ListData[this.pageData.navIndex].currentIndex = currentIndex;
          this.pageData.loadstatus = -1;
          this.generateListData(this.dispatchCurrentParams()).then(() => {
            currentArr.length ? this.pageData.loadstatus = 1 : this.pageData.loadstatus = 2;
            setTimeout(() => {
              this.pageData.loadstatus = 0;
            }, 500);
          });
        },
        linkDetail (id) {
          this.$router.push({
            path: 'detail',
            query: {id}
          });
        },
        linkout (path) {
          window.location.href = path;
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
  @import '../../../assets/stylus/mixin.styl';
  .mall-wrap
    padding px2rem(24)
    position relative
    width 100%
    height 100%
    .mall-banner
      width 100%
      height px2rem(240)
      background-color #ff4d51
      border-radius px2rem(10)
      margin-bottom px2rem(20)
    .recommended-wrap
      position absolute
      left 0
      right 0
      top px2rem(390)
      bottom px2rem(150)
      padding 0 px2rem(24) px2rem(24) px2rem(24)
      .scrollwrap
        padding 0 px2rem(24)
        bottom 0
        .inner-wrap
          padding-bottom px2rem(20)
          .scroll-item
            width 100%
            border-radius px2rem(10)
            height px2rem(276)
            background-color #fff
            overflow hidden
            margin-bottom px2rem(20)
            padding 0
            &.scroll-item:last-child
              margin-bottom 0
            .flex-wrap
              display flex
              width 100%
              height 100%
              .flex-header
                width px2rem(430)
                flex 0 0 px2rem(430)
                padding px2rem(20)
                height 100%
                border-right px2rem(2) dashed #ccc
                .goodspic
                  width 100%
                  height 100%
              .goods-content
                display flex
                flex 1
                justify-content center
                align-items center
                .goods-wrap
                  font-size px2rem(20)
                  & h3
                    width px2rem(230)
                    overflow hidden
                    text-overflow ellipsis
                    white-space nowrap
                    height px2rem(60)
                    line-height px2rem(60)
                    font-size px2rem(30)
                    font-weight bold
                  & p
                    height px2rem(30)
                    line-height px2rem(30)
                  .discountfont
                    color #ff9d16
                  .discountBigfont
                    font-size px2rem(32)
                    color #ff9d16
                    font-weight bold
                  .originalfont
                    text-decoration line-through
                    color #9e9e9e
                  .limitfont
                    margin-top px2rem(18)
                    font-size px2rem(18)
                    color #9e9e9e
                  .buybtn
                    width 100%
                    margin-top px2rem(9)
                    & button
                      width 100%
                      height px2rem(36)
                      font-size px2rem(20)
                      color #fff
                      background-color #ff9d16
                      border-radius px2rem(10)
</style>
