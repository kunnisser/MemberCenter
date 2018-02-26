<template>
  <div class="mdlist-wrap">
    <div class="mdlist-nav-wrap">
      <div class="mdlist-nav">
        <div v-for="(item, index) in navData" :class="'md-navitem ' + ((index === navIndex) ? 'active' : '')" @click="linkNav(item.key, index)">{{item.name}}</div>
      </div>
    </div>
    <v-scroll ref="mdscroll" :loadMore="true" :loadstatus="loadstatus" @scrollEndHandle="loadMoreListData(dispatchCurrentParams())" v-if="!noData">
      <div slot="scrolllist">
        <slot name="mdscroll"></slot>
      </div>
    </v-scroll>
    <div class="no-data" v-else>-- 暂无数据 --</div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'components/scroll/scrollView';
  export default {
    name: 'mdList',
    data () {
      return {
        navIndex: 0,
        navData: [
          {
            name: '最热',
            key: 'hot'
          },
          {
            name: '最新',
            key: 'new'
          }
        ],
        listData: {
          currentIndex: 1,
          fetchApi: null,
          currentArr: [],
          listArr: []
        },
        totalPage: null,
        sharedNum: null,
        loadstatus: 0,
        noData: !1
      };
    },
    props: {
      fetchApi: {
        type: Function
      }
    },
    created () {
      this.init();
    },
    methods: {
      init () {
        this.generateListData(this.dispatchCurrentParams());
      },
      dispatchCurrentParams () {
        this.listData.fetchApi = this.fetchApi;
        return this.listData;
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
            type: this.navData[this.navIndex].key,
            pageNow: currentIndex,
            pageSize: 6
          });
          if (Resp.data.code === '1') {
            currentArr = Resp.data.data.item.length ? Resp.data.data.item : [];
            Resp.data.data.total && (this.totalPage = Resp.data.data.total);
            Resp.data.data['my_share_num'] === undefined || (this.sharedNum = Resp.data.data['my_share_num'].toString());
            listArr = listArr.concat(currentArr);
            this.listData.currentArr = currentArr;
            this.listData.listArr = listArr;
            this.$emit('getApiData', {'list': this.listData.listArr, 'total': this.totalPage, 'num': this.sharedNum});
            this.$nextTick(() => {
              this.$refs.mdscroll && this.$refs.mdscroll.refresh();
            });
          }
        } catch (e) {
          this.listData.currentArr = [];
          this.noData = !this.listData.listArr.length;
        }
        this.noData = !this.listData.listArr.length;
      },
      /*
      * 加载更多
      * */
      loadMoreListData ({currentIndex, currentArr} = this.dispatchCurrentParams()) {
        currentArr.length && currentIndex++;
        this.listData.currentIndex = currentIndex;
        this.loadstatus = -1;
        this.generateListData(this.dispatchCurrentParams()).then(() => {
          currentArr.length ? this.loadstatus = 1 : this.loadstatus = 2;
          setTimeout(() => {
            this.loadstatus = 0;
          }, 500);
        });
      },
      linkNav (key, index) {
        this.navIndex = index;
        this.listData.currentIndex = 1;
        this.listData.listArr = [];
        this.generateListData(this.dispatchCurrentParams());
      }
    },
    components: {
      'v-scroll': Scroll
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../view/assets/stylus/mixin.styl';
  .mdlist-wrap
    position absolute
    width px2rem(694)
    top px2rem(140)
    bottom px2rem(28)
    background-color #fff
    border-radius px2rem(10)
    overflow hidden
    padding px2rem(24)
    .mdlist-nav-wrap
      box-shadow 0 px2rem(1) px2rem(1) rgba(0,0,0,0.2)
      .mdlist-nav
        width px2rem(166)
        display flex
        margin 0 auto
        padding px2rem(30) 0
        font-size px2rem(24)
        .md-navitem
          flex 1
          text-align center
          font-weight bold
        .active
          color #003366
    .scrollwrap
      top px2rem(108)
      padding 0 px2rem(24)
</style>
