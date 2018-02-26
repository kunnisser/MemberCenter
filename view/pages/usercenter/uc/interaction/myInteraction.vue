<template>
    <div class="ia-wrap">
      <v-topnav :navIndex="pageData.navIndex" :navData="pageData.navData" @linkNav="linkIa"></v-topnav>
      <div class="ia-box ia-comments" v-show="pageData.currentTab === 'icomments'">
        <div class="ia-scroll">
          <v-scroll ref="icomments" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMoreListData(dispatchCurrentParams())" v-if="!pageData.noData">
            <div slot="scrolllist" class="inner-wrap">
              <div class="scroll-item" v-for="item in ListData[pageData.navIndex].listArr">
                <div class="flex-wrap">
                  <div class="flex-header" :style="'background-image:url(' + item.thumbpic + '); background-size:cover; background-repeat: no-repeat;'"></div>
                  <div class="flex-content">
                    <h3>{{item.tnname}}</h3>
                    <p>已获{{item.catchscore}}积分</p>
                    <div class="flex-bar">{{item.sendtime}}<div class="show-comments" @click.prevent.stop="linkComments(item.articleid, item.tnname, $event)">
                      <i class="icon-search"></i><span>查看评论</span>
                    </div></div>
                  </div>
                </div>
              </div>
            </div>
          </v-scroll>
          <div class="no-data" v-else>- 暂无评论记录 -</div>
        </div>
      </div>
      <div class="ia-box ia-praise" v-show="pageData.currentTab === 'ipraise'">
        <div class="ia-scroll">
          <v-scroll ref="ipraise" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMoreListData(dispatchCurrentParams())" v-if="!pageData.noData">
            <div slot="scrolllist" class="inner-wrap">
              <div class="scroll-item" v-for="item in ListData[this.pageData.navIndex].listArr">
                <div class="flex-wrap">
                  <div class="flex-header" :style="'background-image:url(' + item.pic + '); background-size:cover; background-repeat: no-repeat;'"></div>
                  <div class="flex-content">
                    <h3>{{item.title}}</h3>
                    <p><span><i class="icon-thumbs-up"></i> {{item.supportNum}}</span></p>
                    <div class="flex-bar">{{item.time}}</div>
                  </div>
                </div>
              </div>
            </div>
          </v-scroll>
          <div class="no-data" v-else>- 暂无点赞记录 -</div>
        </div>
      </div>
      <div class="ia-box ia-share" v-show="pageData.currentTab === 'ishare'">
        <div class="ia-scroll">
          <v-scroll ref="ishare" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMoreListData(dispatchCurrentParams())" v-if="!pageData.noData">
            <div slot="scrolllist" class="inner-wrap">
              <div class="scroll-item" v-for="item in ListData[this.pageData.navIndex].listArr">
                <div class="flex-wrap" v-if="item.content">
                  <div class="flex-header" :style="'background-image:url(' + JSON.parse(item.content).news_item[0].thumb_url + '); background-size:cover; background-repeat: no-repeat;'"></div>
                  <div class="flex-content">
                    <h3>{{JSON.parse(item.content).news_item[0].title}}</h3>
                    <p>
                      <span :class="item.haveShared === 'haved' ? 'shared' : 'unshare'">{{item.haveShared === 'haved' ? '已分享': '未分享'}}</span>
                    </p>
                    <div class="flex-bar">{{item.sendtime}}</div>
                  </div>
                </div>
              </div>
            </div>
          </v-scroll>
          <div class="no-data" v-else>- 暂无分享记录 -</div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import TopNav from 'components/navbar/topnav';
  import Scroll from 'components/scroll/scrollView';
  import {getCommentedTn, getThumbedTn, getSharedTn} from 'mock/getMocks';
    export default {
      name: 'my-interaction',
      data () {
        return {
          pageData: {
            navIndex: 0,
            currentTab: 'icomments',
            navData: [
              {
                name: '我的评论',
                type: 'icomments'
              },
              {
                name: '我的点赞',
                type: 'ipraise'
              },
              {
                name: '我的分享',
                type: 'ishare'
              }
            ],
            loadstatus: 0,
            noData: !1
          },
          ListData: [
            {
              currentIndex: 1,
              fetchApi: getCommentedTn,
              currentArr: [],
              listArr: []
            },
            {
              currentIndex: 1,
              fetchApi: getThumbedTn,
              currentArr: [],
              listArr: []
            },
            {
              currentIndex: 1,
              fetchApi: getSharedTn,
              currentArr: [],
              listArr: []
            }
          ]
        };
      },
      created () {
        this.init();
      },
      methods: {
        init () {
          this.generateListData(this.dispatchCurrentParams());
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
            let Resp = await fetchApi({
              pageNow: currentIndex,
              pageSize: 6
            });
            if (Resp.data.code === '1') {
              currentArr = Resp.data.data.length ? Resp.data.data : [];
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
        linkComments (articleid, title, e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path: 'mycomments',
            query: {
              noteId: articleid,
              tnname: title
            }
          });
        },
        linkIa (v) {
          this.pageData.navIndex = v[1];
          this.pageData.currentTab = v[0];
          this.pageData.loadstatus = 0;
          this.ListData[v[1]].currentIndex = 1;
          this.ListData[v[1]].listArr = [];
          this.generateListData(this.dispatchCurrentParams());
          this.$refs[this.pageData.currentTab] && this.$refs[this.pageData.currentTab].scroll.scrollTo(0, 0);
        }
      },
      components: {
        'v-topnav': TopNav,
        'v-scroll': Scroll
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../assets/stylus/mixin.styl';
  .ia-wrap
    padding px2rem(28)
    .ia-box
      position absolute
      width 100%
      top px2rem(116)
      left 0
      bottom 0
      padding px2rem(28)
      .ia-scroll
        position relative
        width 100%
        height 100%
        background-color #fff
        border-radius px2rem(10)
        overflow hidden
        .inner-wrap
          padding 0 px2rem(40)
          .scroll-item
            width 100%
            padding px2rem(30) 0
            font-size px2rem(24)
            border-bottom px2rem(1) solid #ccc
            &.scroll-item:last-child
              border-bottom none
            .flex-wrap
              width 100%
              display flex
              .flex-header
                width px2rem(190)
                flex 0 0 px2rem(190)
                height px2rem(166)
              .flex-content
                flex 1
                margin-left px2rem(36)
                & h3
                  width 100%
                  height px2rem(48)
                  line-height px2rem(48)
                  font-size px2rem(28)
                  overflow hidden
                  text-overflow ellipsis
                  white-space nowrap
                & p
                  height px2rem(80)
                  line-height px2rem(80)
                  font-size px2rem(20)
                  color #474747
                  & span
                    margin-right px2rem(60)
                  .unshare
                    color #ccc
                  .shared
                    color #8fbc8f
                    & i
                      color #474747
                      margin-right px2rem(10)
                    .red
                      color #ffa222
                  & span:last-child
                    margin-right 0
                .flex-bar
                  height px2rem(40)
                  line-height px2rem(40)
                  position relative
                  width 100%
                  font-size px2rem(20)
                  .show-comments
                    position absolute
                    right 0
                    top 0
                    width px2rem(140)
                    background-image linear-gradient(to bottom, #ef62dd, #b205a0)
                    border-radius px2rem(32)
                    height px2rem(40)
                    line-height px2rem(30)
                    border px2rem(2) solid #9a337c
                    text-align center
                    color #fff
                    cursor pointer
                    & i
                      vertical-align middle
                      color #fff
                      margin-right px2rem(4)
                      font-size px2rem(20)
                    & span
                      vertical-align middle
                      font-size px2rem(20)
</style>
