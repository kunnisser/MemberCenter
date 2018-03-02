<template>
    <div class="share-mask" v-show="shareVisible" @click="hide">
      <div class="share-content">
        <div class="share-tip"></div>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" :class="'default' + (commitFlag ? '' : ' warning')">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import Tips from 'components/pop/poptips';
  import {shareSuccess} from 'mock/getMocks';
    export default {
      name: 'share',
      data () {
        return {
          popType: 'center',
          tipvisible: !1,
          commitFlag: !1,
          tiptext: ''
        };
      },
      props: {
        shareVisible: {
          type: Boolean,
          default: false
        },
        content: {
          type: String,
          default: ''
        }
      },
      methods: {
        hide () {
          this.$emit('closeShareMask');
        },
        share (data, id) {
          let conf = JSON.parse(this.content);
          let mediaid = id;
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems']
          });
          wx.ready(() => {
            wx.hideMenuItems({
              menuList: ['menuItem:copyUrl',
                'menuItem:share:qq',
                'menuItem:share:weiboApp',
                'menuItem:share:facebook',
                'menuItem:share:QZone',
                'menuItem:originPage',
                'menuItem:openWithQQBrowser',
                'menuItem:openWithSafari',
                'menuItem:share:email'
              ]
            });
            wx.error((res) => {
              this.showMessage('验证失败' + res);
            });
            wx.onMenuShareTimeline({
              title: conf.news_item[0].title,
              link: conf.news_item[0].url,
              imgUrl: conf.news_item[0].thumb_url,
              success: () => {
                this.commitFlag = !0;
                this.showMessage('分享成功！');
                this.shareSuccess(mediaid);
              },
              cancel: function () {
              }
            });

            wx.onMenuShareAppMessage({
              title: conf.news_item[0].title, // 分享标题
              desc: conf.news_item[0].digest, // 分享描述
              link: conf.news_item[0].url,
              imgUrl: conf.news_item[0].thumb_url, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: () => {
                this.commitFlag = !0;
                this.showMessage('分享成功！');
                this.shareSuccess(mediaid);
              },
              cancel: () => {
                // 用户取消分享后执行的回调函数
              }
            });
          });
        },
        showMessage (m) {
          this.tipvisible = !0;
          this.tiptext = m;
        },
        closetips (v) {
          this.tipvisible = v;
        },
        async shareSuccess (mediaid) {
          let resp = await shareSuccess({
            media_id: mediaid
          });
          console.log(resp);
          this.$store.state.ucInfo.myscore = resp.data.data.score;
        }
      },
      components: {
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .share-mask
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    background-color rgba(0, 0, 0, 0.7)
    .share-content
      position relative
      width 100%
      height 100%
      .share-tip
        position absolute
        right 0
        top 0
        width px2rem(540)
        height px2rem(830)
        background url("../../assets/image/shareTip.png") no-repeat
        background-size 100% 100%
</style>
