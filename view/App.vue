<template>
  <div class="view-wrap">
    <div id="manor"></div>
    <transition name="routeTransform">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="routeTransform">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <v-loading></v-loading>
  </div>
</template>
<script type="text/ecmascript-6">
  import loadCom from 'components/loading/loadingView';
  import {getUserData} from 'mock/getMocks';
  export default {
      name: 'app',
      data () {
        return {
          pageInfo: null
        };
      },
      components: {
        'v-loading': loadCom
      },
      created () {
        this.getParams('xxgmc_jwt_token') && window.localStorage.setItem('xxgmc_jwt_token', this.getParams('xxgmc_jwt_token'));
      },
      mounted () {
        this.initPage();
      },
      methods: {
        /* 初始化用户数据 */
        async initPage () {
          try {
            let res = await getUserData();
            this.pageInfo = res.data;
            this.pageInfo.code === '401' && (window.location.href = this.pageInfo.data);
            this.$store.commit('setUserInfo', this.pageInfo);
          } catch (e) {
            console.log(e);
          }
        },
        getParams (key) {
          let url = window.location.search.replace(/^\?/, '').split('&');
          let paramsObj = {};
          for (let i = 0, iLen = url.length; i < iLen; i++) {
            let param = url[i].split('=');
            paramsObj[param[0]] = param[1];
          }
          if (key) {
            return paramsObj[key] || '';
          }
          return paramsObj;
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import 'assets/stylus/index.styl';
  @font-face
    font-family GrilledCheeseBTNToasted
    src url('assets/fonts/GrilledCheeseBTNToasted.woff')
  body
    width 100%
    height 100%
    background-color #f2f2f2
    .wrap
      width px2rem(750)
      margin 0 auto
      background-color #003366
      box-sizing border-box
      height 100%
      box-shadow 0 0 px2rem(8) rgba(0,0,0,0.6)
      #app
        position relative
        width 100%
        height 100%
        .view-wrap
          width 100%
          height 100%
          #manor
            position absolute
            top 0
            left 0
            z-index 9
            display none
            width 100%
            height 100%
            justify-content center
            align-items center
          .routeTransform-enter-active
            transition opacity 500ms cubic-bezier(0.55, 0, 0.1, 1)
          .routeTransform-leave-to, .routeTransform-enter
            opacity 0
          .routeTransform-leave, .routeTransform-enter-to
            opacity 1
</style>
