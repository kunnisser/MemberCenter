<template>
  <v-scroll ref="scrollview">
    <div slot="defaultScroll">
      <div class="card-wrap">
        <div class="card-panel" v-if="pageData.showType === 1">
          <div class="card-list" v-if="pageData.cardInfo.carditem && pageData.cardInfo.carditem.length">
            <div  v-for="item in pageData.cardInfo.carditem" :class="'card-item ' + getCardStyle(item.type)  + ' year-card'">
              <div class="card-flex">
                <p>{{item.shop}}</p>
                <h2>{{item.goodsname}}</h2>
                <div class="card-tip">{{item.state === 1 ? '最近使用' : ''}}{{item.state === 2 ? '最近添加' : ''}}</div>
              </div>
            </div>
          </div>
          <div class="no-data" v-else>
            暂无相关卡券
          </div>
        </div>
        <div class="card-panel" v-if="pageData.showType === -1">
          <div class="card-list" v-if="pageData.cardInfo.ticketitem && pageData.cardInfo.ticketitem.length">
            <div v-for="item in pageData.cardInfo.ticketitem" :class="'card-item ' + getTicketStyle(item.type)  + ' year-ticket'">
              <div class="card-flex">
                <div class="header">
                  <div class="header-wrap">
                    <h2>{{item.goodsnick}}</h2>
                    <p>{{item.kindname}}</p>
                  </div>
                </div>
                <div class="content">
                  <h2>{{item.goodsname}}</h2>
                  <p>{{item.goodsexplain}}</p>
                  <p class="timer">有效期至{{item.pov}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="no-data" v-else>
            暂无相关卡券
          </div>
        </div>
      </div>
    </div>
  </v-scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from '../../../../components/scroll/scrollView';
  import {mapState} from 'vuex';
  export default {
    name: 'mycard',
    data () {
      return {
        pageData: {
          cardInfo: {},
          ticketStyle: '',
          showType: 0
        }
      };
    },
    mounted () {
      this.init();
    },
    computed: {
      ...mapState(['cardInfo'])
    },
    watch: {
      cardInfo: {
        handler (val) {
          this.pageData.cardInfo = val;
          this.init();
        },
        deep: !0
      }
    },
    methods: {
      init () {
        this.pageData.showType = 0;
        this.$route.query.type === 'carditem' && (this.pageData.showType = 1);
        this.$route.query.type === 'ticketitem' && (this.pageData.showType = -1);
        this.getUserCard();
      },
      getUserCard () {
        this.pageData.cardInfo = this.$store.state.cardInfo;
        console.log(this.pageData.cardInfo);
        this.$nextTick(() => {
          this.$refs.scrollview && this.$refs.scrollview.refresh();
        });
      }
    },
    components: {
      'v-scroll': Scroll
    }
  };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  .card-wrap
    .card-panel
      padding 0
</style>

