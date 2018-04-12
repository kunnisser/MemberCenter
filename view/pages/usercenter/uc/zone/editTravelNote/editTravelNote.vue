<template>
    <div class="editWrap">
      <div class="editTn-panel">
        <v-scroll ref="editView" :loadMore="false">
          <div slot="defaultScroll">
            <div class="ed-title-input">
              <input type="text" maxlength="20" placeholder="请在这里输入游记标题" v-model="title">
            </div>
            <div class="ed-content">
              <textarea maxlength="1000" placeholder="添加游记内容" v-model="tnContent"></textarea>
              <div class="ed-tips">{{tnContent.length}} / 1000</div>
            </div>
            <div class="desc-wrap">
              <div class="add-desc">
                <i class="icon-plus">
                  <vue-core-image-upload
                     ref="uploader"
                    class="btn btn-primary"
                    :crop="false"
                    @imagechanged="hasChanged"
                    @imageuploaded="imageUploaded"
                    @errorhandle="uploadErr"
                     :maxFileSize="819200"
                     :multiple="false"
                     :multipleSize="1"
                     :compress="25"
                    :url="uploaderApi" >
                  </vue-core-image-upload>
                </i>
              </div>
              <div class="desc-list">
                <div class="desc-item" v-for="(item, index) in descArr">
                  <div class="desc-flex">
                    <div class="flex-pic" :style="'background-size: cover; background-image: url(' + item.picpath + '); background-repeat: no-repeat'"></div>
                    <div class="flex-text">
                      <textarea placeholder="添加描述" maxlength="200" v-model="descArr[index].desc"></textarea>
                    </div>
                  </div>
                  <div class="delete-desc" @click.prevent.stop="deleteDesc(index, item.picpath, $event)">
                    <i class="icon-times-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-scroll>
      </div>
      <div class="btn-wrap">
        <button type="button" @click.prevent.stop="commitTn">立即提交</button>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" :class="'default' + (commitFlag ? '' : ' warning')">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import {basePath, prostatus} from '../../../../../utils/env.js';
  import ImageUploader from 'vue-core-image-upload';
  import Scroll from 'components/scroll/scrollView';
  import {addTnDetail, delImgPic} from 'mock/getMocks';
  import {mapState} from 'vuex';
  import Tips from 'components/pop/poptips';
  import xss from 'xss';
    export default {
      name: 'edit-tn',
      data () {
        return {
          respId: '',
          title: '',
          tnContent: '',
          descArr: [],
          userId: '',
          username: '',
          uploadIndex: 0,
          tipvisible: !1,
          popType: 'center',
          commitFlag: !1,
          tiptext: '',
          uploaderApi: basePath + (prostatus === 'development' ? '/api/noteWeb/uploader' : '/xxgmc/noteWeb/uploader')
        };
      },
      mounted () {
        this.init();
      },
      computed: {
        ...mapState(['personInfo'])
      },
      methods: {
        init () {
          const loginToken = window.localStorage.getItem('xxgmc_jwt_token') || null;
          this.$refs.uploader.headers.xxgmc_jwt_token = loginToken;
          // this.username = user.username;
          // this.avator = user.avator;
        },
        hasChanged (e) {
          let reader = new FileReader();
          reader.readAsDataURL(e);
          reader.onload = () => {
            this.descArr.push({
              picpath: reader.result,
              desc: ''
            });
            this.uploadIndex = this.descArr.length - 1;
            this.$nextTick(() => {
              this.$refs.editView.refresh();
            });
          };
        },
        async deleteDesc (index, url, e) {
          if (!e._constructed) {
            return;
          }
          try {
            let resp = await delImgPic({delpath: url});
            if (resp.data.code === '1') {
              this.descArr.splice(index, 1);
              this.$nextTick(() => {
                this.$refs.editView.refresh();
              });
            } else {
              this.showMessage(!1, '图片删除失败，请重试');
            }
          } catch (e) {
            this.showMessage(!1, '网络连接错误');
          }
        },
        async commitTn () {
          try {
            if (!this.title.trim().length) {
              this.showMessage(!1, '请输入游记标题');
            } else if (!this.tnContent.trim().length) {
              this.showMessage(!1, '请输入游记内容');
            } else {
              let commitResp = await addTnDetail({
                title: xss(this.title),
                detail: xss(this.generateRichText())
              });
              if (commitResp.data.code === '1') {
                this.showMessage(!0, '上传游记成功');
                this.respId = commitResp.data.data;
              } else {
                this.showMessage(!1, '上传游记失败');
              }
            }
          } catch (e) {
            this.showMessage(!1, '网络连接错误');
          }
        },
        imageUploaded (e) {
          if (e.url) {
            this.descArr[this.uploadIndex].picpath = e.url;
          } else {
            this.showMessage(!1, '图片上传失败！');
            this.descArr.splice(this.descArr.length - 1, 1);
          }
        },
        uploadErr (mes) {
          this.showMessage(!1, mes);
        },
        generateRichText () {
          let rt = '';
          rt = '<p>' + this.tnContent + '</p>';
          for (let e of this.descArr) {
            rt += '<img src="' + e.picpath + '">' + '<p>' + xss(e.desc) + '</p>';
          }
          return rt;
        },
        showMessage (s, m) {
          this.commitFlag = s;
          this.tipvisible = !0;
          this.tiptext = m;
        },
        closetips (v) {
          this.tipvisible = v;
          this.commitFlag && this.$router.push({
            path: 'tndetail',
            query: {
              id: this.respId
            }
          });
        }
      },
      components: {
        'vue-core-image-upload': ImageUploader,
        'v-scroll': Scroll,
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../../assets/stylus/mixin.styl';
  .editWrap
    padding px2rem(24) px2rem(24) px2rem(160) px2rem(24)
    width 100%
    height 100%
    .editTn-panel
      position relative
      width 100%
      height 100%
      font-size px2rem(24)
      .scrollwrap
        background-color #fff
        border-radius px2rem(10)
        overflow hidden
        padding px2rem(50) px2rem(26)
        .ed-title-input
          width 100%
          padding px2rem(20) px2rem(30)
          background-color #eee
          & input
            display block
            width 100%
            background-color #eee
        .ed-content
          margin-top px2rem(16)
          width 100%
          height px2rem(194)
          padding px2rem(30)
          background-color #eee
          position relative
          & textarea
            border none
            outline none
            resize none
            width 100%
            height 100%
            background-color #eee
            font-size px2rem(24)
            color #999
          .ed-tips
            position absolute
            right px2rem(10)
            bottom px2rem(4)
            color #ccc
            font-size px2rem(20)
        .desc-wrap
          padding px2rem(30)
          .add-desc
            text-align center
            & i
              position relative
              cursor pointer
              display inline-block
              width px2rem(48)
              height px2rem(48)
              line-height px2rem(42)
              border-radius 50%
              border px2rem(4) solid #003781
              color #fff
              background-image linear-gradient(to bottom, #62d7ef, #056bb2)
              text-align center
              .g-core-image-upload-btn
                position absolute
                left 0
                top 0
                width 100%
                height 100%
          .desc-list
            margin-top px2rem(20)
            padding-bottom px2rem(20)
            .desc-item
              width 100%
              height px2rem(190)
              padding px2rem(24)
              background-color #eee
              margin-bottom px2rem(20)
              position relative
              .delete-desc
                position absolute
                top px2rem(-10)
                right px2rem(-10)
                & i
                  cursor pointer
                  font-size px2rem(30)
                  color #ff4d51
              .desc-flex
                display flex
                width 100%
                height 100%
                .flex-pic
                  border px2rem(1) solid #ccc
                  width px2rem(150)
                  flex 0 0 px2rem(150)
                  height 100%
                .flex-text
                  flex 1
                  margin-left px2rem(24)
                  & textarea
                    width 100%
                    height 100%
                    background-color #eee
                    font-size px2rem(20)
    & button
      background-image linear-gradient(to bottom, #feeb00, #ff7c00)
      color #fff
      font-weight bold
      -webkit-text-stroke px2rem(2) #b33600
      box-shadow 0 px2rem(4) px2rem(4) #a9531f
</style>
