<template>
    <div class="edit-wrap">
      <div class="textarea-wrap">
        <textarea placeholder="评价超过10个字就会获得100积分~" maxlength="500" v-model="comments"></textarea>
        <div class="edit-tip">{{comments.length}}/500</div>
      </div>
      <div class="btn-wrap">
        <button type="button" @click.prevent.stop="commitComment">立即提交</button>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" :class="'default' + (commitFlag ? '' : ' warning')">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import Tips from '../../../../../components/pop/poptips';
  import {editComment} from '../../../../../mock/getMocks';
    export default {
      name: 'edit-comments',
      data () {
        return {
          comments: '',
          popType: 'center',
          tipvisible: !1,
          tiptext: '',
          commitFlag: !1
        };
      },
      methods: {
        commitComment () {
          if (!this.comments.trim().length) {
            this.showMessage(!1, '请填写评论');
          } else {
            this.sendComment(this.$route.query.id);
          }
        },
        async sendComment (id) {
          try {
            let sendResp = await editComment({
              id: id,
              detail: this.comments
            });
            console.log(sendResp);
            sendResp.data.code === '1' &&
            this.showMessage(!0, '评论成功');
            sendResp.data.code === 'contain_sensitive_word' &&
            this.showMessage(!1, sendResp.data.msg);
          } catch (e) {
            console.log(e);
            this.showMessage(!1, '网络错误，请重试!');
          }
        },
        showMessage (f, m) {
          this.commitFlag = f;
          this.tipvisible = !0;
          this.tiptext = m;
        },
        closetips (v) {
          this.tipvisible = v;
          this.commitFlag &&
          this.$router.go(-1);
        }
      },
      components: {
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import "../../../../../assets/stylus/mixin.styl";
  .edit-wrap
    padding px2rem(26)
    width 100%
    height 100%
    .textarea-wrap
      width 100%
      height px2rem(480)
      border-radius px2rem(10)
      overflow hidden
      background-color #fff
      padding px2rem(50) px2rem(40)
      font-size px2rem(24)
      position relative
      & textarea
        width 100%
        height 100%
        resize none
        outline none
        font-size px2rem(24)
        border none
      .edit-tip
        position absolute
        bottom px2rem(10)
        right px2rem(40)
    & button
      background-image linear-gradient(to bottom, #fff300, #ff7b00)
      color #fff
      font-weight bold
      -webkit-text-stroke px2rem(2) #b33600
      box-shadow 0 px2rem(4) px2rem(4) #ac541e
</style>
