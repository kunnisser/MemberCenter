<template>
    <div class="loading-view" v-show="loadvisible">
      <div class="loading-wrap">
        <div class="loading-effect">
          <div class="loadblock">
            <div class="child"></div>
            <div class="child"></div>
            <div class="child"></div>
            <div class="child"></div>
          </div>
        </div>
        <div class="loading-mes">
          {{loadmes}}
        </div>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import Axios from 'axios';
    export default {
      name: 'loading',
      data () {
        return {
          loadvisible: !1,
          loadmes: ''
        };
      },
      created () {
        // axios拦截器设置loading
        Axios.interceptors.request.use(config => {
          config.method === 'get' ? this.loadmes = '加载数据中' : this.loadmes = '请求提交中..';
          this.loadvisible = !0;
          return config;
        });

        Axios.interceptors.response.use(response => {
          this.loadvisible = !1;
          this.loadmes = '';
          return response;
        }, error => {
          this.loadmes = '请求超时,刷新重新请求数据';
          setTimeout(() => {
            this.loadvisible = !1;
            this.loadmes = '';
          }, 800);
          return Promise.reject(error);
        });
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .loading-view
    position absolute
    width 100%
    height 100%
    top 0
    left 0
    z-index 9999
    background-color rgba(0,0,0,0.4)
    display flex
    justify-content center
    align-items center
    .loading-wrap
      text-align center
      .loading-effect
        width px2rem(200)
        height px2rem(200)
        position relative
        margin 0 auto
        .loadblock
          position absolute
          display flex
          flex-wrap wrap
          width px2rem(100)
          height px2rem(100)
          left px2rem(50)
          top px2rem(50)
          transform: rotate(45deg);
          animation: squareWrapTrans 1.5s infinite;
          .child
            width px2rem(50)
            height px2rem(50)
            background-color #5e7382
          .child:first-child
            background-color #ff9d16
            animation squareChildTrans1 1.5s infinite;
          .child:nth-child(2)
            background-color #fb5c31
            animation squareChildTrans2 1.5s infinite;
          .child:nth-child(3)
            background-color #c2e1fe
            animation squareChildTrans3 1.5s infinite;
          .child:nth-child(4)
            background-color #00a0e9
            animation squareChildTrans4 1.5s infinite;
      .loading-mes
        font-size px2rem(28)
        color #fff

  @keyframes squareWrapTrans {
    100% {transform: rotate(-45deg)}
  }
  @keyframes squareChildTrans1 {
    25% {transform:translate(0, px2rem(-20)) rotate(-180deg)}
    100% {transform:translate(0,0) rotate(-180deg)}
  }
  @keyframes squareChildTrans2 {
    25% {transform:translate(px2rem(20),0) rotate(-180deg)}
    100% {transform:translate(0,0) rotate(-180deg)}
  }
  @keyframes squareChildTrans3 {
    25% {transform:translate(px2rem(-20),0) rotate(-180deg)}
    100% {transform:translate(0,0) rotate(-180deg)}
  }
  @keyframes squareChildTrans4 {
    25% {transform:translate(0,px2rem(20)) rotate(-180deg)}
    100% {transform:translate(0,0) rotate(-180deg)}
  }

</style>
