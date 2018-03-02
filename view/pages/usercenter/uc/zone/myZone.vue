<template>
    <div class="zone-wrap">
      <v-topnav :navIndex="pageData.navIndex" :navData="pageData.navData" @linkNav="linkZone"></v-topnav>
      <div class="zone-box zone-box-all" style="bottom:0;">
        <div class="zone-travelNote" v-show="pageData.currentTab === 'travelNote'">
          <v-scroll ref="travelNote" v-if="!pageData.noteNodata" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMore">
            <div slot="scrolllist">
              <div class="noteList">
                    <div class="note-item" v-for="(item, index) in pageData.notelist" @click.prevent.stop="linkTndetail(item.id, $event)">
                    <h3>{{item.title}}</h3>
                    <div class="note-info">
                      <p>{{item.detail}}</p>
                      <div class="thumblist">
                        <div v-for="item1 in item.pics" class="thumb-item" :style="'background: url(' + item1 + ') no-repeat center;'"></div>
                      </div>
                      <div class="note-tips">
                        <p>{{item.time}} 发布</p>
                        <div class="tip-bar">
                          <div :class="'tip-thumbup ' + (item.support_flag ? 'parised' : '')" @click.prevent.stop="praise(index, item.id, item.support_flag, item.support_num, $event)">
                            <i class="icon-thumbs-up"></i><span>{{item.support_num}}</span>
                          </div>
                          <div class="tip-comment" @click.prevent.stop="linkComment(item.id, $event)">
                            <i class="icon-chat-3"></i>
                            <span>{{item.comment_num}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </v-scroll>
          <div class="no-data" v-else>暂无游记</div>
          <div class="addTnBtn" @click.prevent.stop="linkAddTn"></div>
        </div>
        <div class="zone-photos" v-show="pageData.currentTab === 'myPhotos'">
          <div :class="'photos-scroll' + (pageData.picNodata ? ' photos-empty' : '')">
                <div class="photos-wrap" v-if="pageData.picNodata">
                  <div class="photos-btn">
                    <vue-core-image-upload
                      class="btn btn-primary"
                      ref="uploader"
                      :crop="false"
                      @imageuploaded="uploadPic"
                      @errorhandle="uploadErr"
                      :maxFileSize="819200"
                      :multiple="true"
                      :multipleSize="9"
                      :compress="25"
                      :url="uploaderApi" >
                    </vue-core-image-upload>
                    <i class="icon-plus"></i>
                  </div>
                  <div class="photos-tip">
                    <div class="photos-icon"></div>
                    <div class="photos-text">
                      <p>您还没有发布照片，赶快来发一张吧！</p>
                    </div>
                  </div>
                </div>
                <v-scroll v-else class="photos-list" ref="myPhotos" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadMorePhotos">
                  <div slot="scrolllist">
                    <div class="photos-box" v-for="(item, index) in pageData.picArr">
                      <div class="box-title">{{item.time}}<i class="icon-trash" @click.prevent.stop="deletePhotos(item.id, index, $event)"></i></div>
                      <div class="box-list">
                        <div class="photos-item" v-for="(pitem, pindex) in item.detail" @click.prevent.stop="linkMyPhotos(item.id, pindex, item)"
                             :style="'background:url(' + pitem + ') no-repeat center; background-size: cover;'">
                        </div>
                      </div>
                    </div>
                  </div>
                </v-scroll>
          </div>
          <div v-if="!pageData.picNodata" class="btn-wrap">
              <button type="button" class="btn-add">发布照片到会员社区<vue-core-image-upload
                ref="uploader"
                class="btn btn-primary"
                :crop="false"
                @imageuploaded="uploadPic"
                @errorhandle="uploadErr"
                :maxFileSize="819200"
                :multiple="true"
                :multipleSize="9"
                :compress="25"
                :url="uploaderApi" >
              </vue-core-image-upload></button>
          </div>
        </div>
        <div class="zone-suggestion" v-show="pageData.currentTab === 'feedback'">
          <div class="suggestion-wrap">
            <div class="no-data" v-if="pageData.feedNodata">请发表您的意见</div>
            <v-scroll v-else ref="feedback" :loadMore="true" :loadstatus="pageData.loadstatus" @scrollEndHandle="loadFeedMore">
              <div slot="scrolllist" class="feed-list" v-show="pageData.feedArr.length">
                <div class="feed-item" v-for="(item, index) in pageData.feedArr">
                  <h3 :class="index === pageData.respIndex ? 'resp': ''" @click.prevent.stop="toggleResp(index, $event)">{{(index + 1) + '、' +item.detail}}<i v-if="item.is_reply" class="icon-check-circle"></i></h3>
                  <div :class="'resp-wrap ' + (index === pageData.respIndex ? 'open' : '')" v-if="item.is_reply">
                    <p>{{item.reply}}</p>
                  </div>
                </div>
              </div>
            </v-scroll>
          </div>
          <div class="suggestion-bar">
            <div class="bar-wrap">
              <div class="textarea-box">
                <textarea placeholder="请填写您的意见~" maxlength="50" v-model="pageData.feedtext"></textarea>
                <div class="sgt-tip">{{pageData.feedtext.length}}/50</div>
              </div>
              <div class="input-box">
                <input type="text" placeholder="请输入验证码" maxlength="4" v-model="pageData.checkcode"/>
                <div class="checkcode" @click.prevent.stop="shakeNum">{{pageData.randomNum}}</div>
              </div>
              <div class="btn-wrap">
                <button type="button" @click.prevent.stop="commitSgt">立即提交</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" :class="'default' + (commitFlag ? '' : ' warning')">{{tiptext}}</div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import {basePath} from '../../../../utils/env';
  import TopNav from 'components/navbar/topnav';
  import {getUserTravelNote, thumbUpTravelNote,
    inquireTnPhotos, deleteTnPhotos, addUserFeed,
    getUserFeed} from 'mock/getMocks';
  import Scroll from 'components/scroll/scrollView';
  import ImageUploader from 'vue-core-image-upload';
  import Tips from 'components/pop/poptips';
  import xss from 'xss';
    export default {
      name: 'myzone',
      data () {
        return {
          pageData: {
            userid: '',
            username: '',
            avator: '',
            navIndex: this.$store.state.myZoneIndex,
            currentTab: 'travelNote',
            tapNav: !1,
            navData: [
              {
                name: '我的游记',
                type: 'travelNote'
              },
              {
                name: '我的照片',
                type: 'myPhotos'
              },
              {
                name: '意见反馈',
                type: 'feedback'
              }
            ],
            notelist: [],
            currentIndex: 1,
            currentNoteArr: [],
            noteNodata: !1,
            picArr: [],
            currentPhotoIndex: 1,
            currentPhotoArr: [],
            picNodata: !1,
            feedArr: [],
            currentFeedIndex: 1,
            currentFeedArr: [],
            feedNodata: !1,
            loadstatus: 0,
            feedtext: '',
            checkcode: '',
            randomNum: '',
            respIndex: 0
          },
          popType: 'center',
          tipvisible: !1,
          commitFlag: !1,
          tiptext: '',
          uploaderApi: basePath + '/xxgmc/photoWeb/savePhoto'
        };
      },
      created () {
        this.init();
      },
      methods: {
        boot () {
          const loginToken = window.localStorage.getItem('xxgmc_jwt_token') || null;
          this.$refs.uploader.headers.xxgmc_jwt_token = loginToken;
        },
        init () {
          this.shakeNum();
          this.linkZone([this.pageData.navData[this.pageData.navIndex].type, this.pageData.navIndex]);
        },
        initNoteData () {
          this.pageData.currentIndex = 1;
          this.pageData.notelist = [];
          this.getUserTravelNote(this.pageData.currentIndex);
        },
        initPhotosData () {
          this.pageData.currentPhotoIndex = 1;
          this.pageData.picArr = [];
          this.requestPic(this.pageData.currentPhotoIndex);
        },
        initSuggestData () {
          this.pageData.currentFeedIndex = 1;
          this.pageData.feedArr = [];
          this.getUserFeed(this.pageData.currentFeedIndex);
        },
        linkZone (v) {
          this.pageData.navIndex = v[1];
          this.pageData.currentTab = v[0];
          this.pageData.tapNav = !0;
          this.pageData.navIndex === 0 && this.initNoteData();
          this.pageData.navIndex === 1 && this.initPhotosData();
          this.pageData.navIndex === 2 && this.initSuggestData();
        },
        async getUserTravelNote (index) {
          try {
            let response = await getUserTravelNote(
              {
                pageNow: index,
                pageSize: 5
              }
            );
            this.pageData.currentNoteArr = response.data.length ? response.data : [];
            this.pageData.notelist = this.pageData.notelist.concat(this.pageData.currentNoteArr);
            this.$nextTick(() => {
              this.$refs.travelNote && this.$refs.travelNote.scroll && this.$refs.travelNote.refresh();
              index === 1 && this.pageData.tapNav && this.$refs[this.pageData.currentTab] && this.$refs[this.pageData.currentTab].scroll.scrollTo(0, 0);
            });
            this.pageData.noteNodata = !this.pageData.notelist.length;
          } catch (e) {
            this.pageData.currentNoteArr = [];
            this.pageData.noteNodata = !this.pageData.notelist.length;
          }
        },
        loadMore () {
          this.pageData.tapNav = !1;
          this.pageData.currentNoteArr.length && this.pageData.currentIndex++;
          this.pageData.loadstatus = -1;
          this.getUserTravelNote(this.pageData.currentIndex).then(() => {
            this.pageData.currentNoteArr.length ? this.pageData.loadstatus = 1 : this.pageData.loadstatus = 2;
            setTimeout(() => {
              this.pageData.loadstatus = 0;
            }, 500);
          });
        },
        async praise (index, id, flag, num, e) {
          if (!e._constructed) {
            return;
          }
          try {
            let n = flag ? -1 : 1;
            let status = flag ? !1 : !0;
            let resp = await thumbUpTravelNote({
              id: id
            });
            this.pageData.notelist[index].support_flag = status;
            this.pageData.notelist[index].support_num = parseInt(num + n) < 0 ? 0 : parseInt(num + n);
            this.$store.state.ucInfo.myscore = resp.data.data.score;
          } catch (e) {
            this.showMessage('网络连接错误，请重试！');
          }
        },
        linkTndetail (id, e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path: '/uc/tndetail',
            query: {id}
          });
        },
        linkAddTn () {
          this.$router.push({
            path: 'edittravelnote'
          });
        },
        linkComment (id, e) {
          if (!e._constructed) {
            return;
          }
          this.$router.push({
            path: 'editcomments',
            query: {id}
          });
        },
        async requestPic (index) {
          try {
            let piclist = await inquireTnPhotos({
              pageNow: index,
              pageSize: 5
            });
            this.pageData.currentPhotoArr = piclist.data.data;
            if (this.pageData.currentPhotoArr.length && piclist.data.code === '1') {
              this.pageData.picArr = this.pageData.picArr.concat(this.pageData.currentPhotoArr);
              this.pageData.picNodata = !this.pageData.picArr.length;
              this.$nextTick(() => {
                this.$refs.myPhotos && this.$refs.myPhotos.refresh();
                this.$refs[this.pageData.currentTab] && this.$refs[this.pageData.currentTab].scroll && this.$refs[this.pageData.currentTab].scroll.scrollTo(0, 0);
              });
            } else {
              this.pageData.picNodata = !this.pageData.picArr.length;
              this.pageData.currentPhotoArr = [];
            }
            this.$nextTick(() => {
              this.boot();
            });
          } catch (e) {
            this.pageData.currentPhotoArr = [];
            this.pageData.picNodata = !this.pageData.picArr.length;
          }
        },
        uploadPic (res) {
          try {
            if (res.code === '1') {
              this.commitFlag = !0;
              this.showMessage('发布成功！');
              this.initPhotosData();
            } else {
              this.showMessage('发布失败！');
            }
          } catch (e) {
            this.showMessage('网络连接失败！');
          }
        },
        uploadErr (res) {
          this.showMessage(res);
        },
        loadMorePhotos () {
          this.pageData.tapNav = !1;
          this.pageData.currentPhotoArr.length && this.pageData.currentPhotoIndex++;
          this.pageData.loadstatus = -1;
          this.requestPic(this.pageData.currentPhotoIndex).then(() => {
            this.pageData.currentPhotoArr.length ? this.pageData.loadstatus = 1 : this.pageData.loadstatus = 2;
            setTimeout(() => {
              this.pageData.loadstatus = 0;
            }, 500);
          });
        },
        formatDateTime (date) {
          let y = date.getFullYear();
          let m = date.getMonth() + 1;
          m = m < 10 ? ('0' + m) : m;
          let d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          let h = date.getHours();
          let minute = date.getMinutes();
          minute = minute < 10 ? ('0' + minute) : minute;
          return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
        },
        async deletePhotos (id, index, e) {
          try {
            if (!e._constructed) {
              return;
            }
            let delResp = await deleteTnPhotos({id: id});
            if (delResp.data.code === '1') {
              this.commitFlag = !0;
              this.showMessage('删除成功！');
              this.pageData.picArr = [];
              this.pageData.currentPhotoIndex = 1;
              this.requestPic(this.pageData.currentPhotoIndex);
            } else {
              this.commitFlag = !1;
              this.showMessage('删除失败，请重试！');
            }
          } catch (e) {
            this.commitFlag = !1;
            this.showMessage('网络连接错误！');
          }
        },
        linkMyPhotos (id, index, item) {
          let str = '';
           for (let i of item.detail) {
             str = str + ',' + i;
           }
          str = str.substr(1, str.length);
          this.$router.push({
            path: 'myphotos',
            query: {
              id,
              index,
              pathGp: str
            }
          });
        },
        async commitSgt () {
          if (!this.pageData.feedtext.trim().length) {
            this.commitFlag = !1;
            this.showMessage('请输入建议内容！');
          } else if (this.pageData.checkcode !== this.pageData.randomNum) {
            this.showMessage('验证码不正确！');
          } else {
            try {
              let sgtResp = await addUserFeed({
                detail: xss(this.pageData.feedtext)
              });
              if (sgtResp.data.code === '1') {
                this.commitFlag = !0;
                this.showMessage('提交成功，等待审核！');
                this.pageData.feedtext = '';
                this.pageData.checkcode = '';
                this.initSuggestData();
              } else {
                this.commitFlag = !1;
                this.showMessage('提交失败！');
              }
            } catch (e) {
              this.commitFlag = !1;
              this.showMessage('网络连接失败！');
            }
          }
          this.shakeNum();
        },
        shakeNum () {
          this.pageData.randomNum = (1000 + parseInt(Math.random() * 8999)).toString();
        },
        async getUserFeed (index) {
          try {
            let feedResp = await getUserFeed({
              pageNow: index,
              pageSize: 12
            });
            this.pageData.currentFeedArr = feedResp.data.data;
            this.pageData.feedArr = this.pageData.currentFeedArr.concat(this.pageData.feedArr);
            this.$nextTick(() => {
              this.$refs.feedback && this.$refs.feedback.scroll && this.$refs.feedback.refresh();
              this.$refs[this.pageData.currentTab] && this.$refs[this.pageData.currentTab].scroll && this.$refs[this.pageData.currentTab].scroll.scrollTo(0, 0);
            });
            this.pageData.feedNodata = !this.pageData.feedArr.length;
          } catch (e) {
            this.pageData.currentFeedArr = [];
            this.pageData.feedNodata = !this.pageData.feedArr.length;
          }
        },
        loadFeedMore () {
          this.pageData.tapNav = !1;
          this.pageData.currentFeedArr.length && this.pageData.currentFeedIndex++;
          this.pageData.loadstatus = -1;
          this.getUserFeed(this.pageData.currentFeedIndex).then(() => {
            this.pageData.currentFeedArr.length ? this.pageData.loadstatus = 1 : this.pageData.loadstatus = 2;
            setTimeout(() => {
              this.pageData.loadstatus = 0;
            }, 500);
          });
        },
        toggleResp (index, e) {
          if (!e._constructed) {
            return;
          }
          this.pageData.respIndex = index;
          setTimeout(() => {
            this.$refs.feedback.refresh();
          }, 400);
        },
        showMessage (m) {
          this.tipvisible = !0;
          this.tiptext = m;
        },
        closetips (v) {
          this.tipvisible = v;
        }
  },
      components: {
        'v-topnav': TopNav,
        'v-scroll': Scroll,
        'vue-core-image-upload': ImageUploader,
        'v-tips': Tips
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../assets/stylus/mixin.styl';
  .zone-wrap
    padding px2rem(28)
    .zone-box
      position absolute
      width 100%
      top px2rem(116)
      left 0
      bottom 0
      padding px2rem(28)
      .zone-travelNote
        position relative
        width 100%
        height 100%
        background-color #fff
        border-radius px2rem(10)
        .addTnBtn
          width px2rem(157)
          height px2rem(175)
          background url("../../../../assets/image/add-tn-icon.png") no-repeat
          background-size 100% 100%
          position absolute
          z-index 999
          right px2rem(10)
          bottom px2rem(10)
        .noteList
          width 100%
          height 100%
          padding 0 px2rem(34)
          font-size px2rem(30)
          overflow hidden
          .note-item
            padding px2rem(50) 0
            border-bottom px2rem(1) solid #ccc
            & h3
              padding-left px2rem(24)
              border-left px2rem(8) solid #6cb4ed
              font-weight bold
            .note-info
              margin-top px2rem(10)
              padding-left px2rem(24)
              font-size px2rem(24)
              & p
                line-height px2rem(30)
                text-align justify
              .thumblist
                margin-top px2rem(20)
                display flex
                padding px2rem(14) 0
                .thumb-item
                  width px2rem(190)
                  height px2rem(164)
                  margin-right px2rem(14)
                  &.thumb-item:last-child
                    margin-right 0
              .note-tips
                position relative
                color #b2b2b2
                line-height px2rem(30)
                .tip-bar
                  position absolute
                  display flex
                  top 0
                  right 0
                  & i
                    color #b2b2b2
                    margin-right px2rem(10)
                  .tip-thumbup
                    margin-right px2rem(50)
                    &.parised
                      color #e64242
                      & i
                        display inline-block
                        animation shakeThumb 500ms cubic-bezier(0,.75,1,.27)
                        color #e64242
          .note-item:last-child
            border-bottom none

      .zone-photos
        width 100%
        height 100%
        position relative
        .photos-scroll
          position absolute
          top 0
          left 0
          bottom px2rem(120)
          background-color #fff
          border-radius px2rem(10)
          overflow hidden
          width 100%
          display flex
          justify-content center
          align-items center
          &.photos-empty
            bottom px2rem(10)
          .photos-wrap
            .photos-btn
              display flex
              justify-content center
              align-items center
              width px2rem(190)
              height px2rem(190)
              border-radius px2rem(10)
              background-color #d1d1d1
              margin 0 auto
              position relative
              & i
                color #fff
              .btn
                position absolute
                width 100%
                height 100%
                left 0
                top 0
                & input
                  display block
                  position absolute
                  left 0
                  top 0
                  width 100%
                  height 100%
                  opacity 0
                  z-index 999
            .photos-tip
              position relative
              display flex
              margin-top px2rem(24)
              width px2rem(360)
              .photos-icon
                position relative
                width px2rem(144)
                height px2rem(140)
                background url("../../../../assets/image/addPhoto-tip.png") no-repeat
                background-size 100% 100%
                z-index 999
              .photos-text
                position absolute
                width px2rem(270)
                height px2rem(80)
                border-top-right-radius px2rem(100)
                border-bottom-right-radius px2rem(100)
                padding px2rem(12) px2rem(30) px2rem(12) px2rem(70)
                background-color #00b8ee
                color #fff
                z-index 99
                top px2rem(26)
                left px2rem(80)
                & p
                  text-align justify
                  font-size px2rem(18)
                  line-height px2rem(28)
          .photos-list
            position relative
            width 100%
            height 100%
            .photos-box
              padding px2rem(32)
              .box-title
                font-size px2rem(24)
                color #4c4c4c
                height px2rem(70)
                line-height px2rem(70)
                font-weight bold
                position relative
                & i
                  position absolute
                  right px2rem(20)
                  top px2rem(20)
                  color #9a0006
              .box-list
                display flex
                flex-wrap wrap
                .photos-item
                  margin px2rem(3)
                  width px2rem(204)
                  height px2rem(204)
                  border px2rem(1) solid #b2b2b2
        .btn-wrap
          position absolute
          bottom 0
          padding-bottom 0
          width 100%
          .btn-add
            background-image linear-gradient(to bottom, #c5f000, #099f1d)
            -webkit-text-stroke px2rem(1) #005600
            position relative
            box-shadow 0 px2rem(4) px2rem(4) #03692b
            .g-core-image-upload-btn
              position absolute
              top 0
              left 0
              width 100%
              height 100%
      .zone-suggestion
        position relative
        width 100%
        height 100%
        font-size px2rem(24)
        &>div
          position absolute
          overflow hidden
          background-color #fff
          border-radius px2rem(10)
          width 100%
        .suggestion-wrap
          top 0
          bottom px2rem(552)
          padding px2rem(20) px2rem(50)
          .no-data
            font-size px2rem(30)
            background-color #e3dffa
            -webkit-text-stroke px2rem(1) #115372
          .feed-list
            padding px2rem(20) px2rem(50)
            .feed-item
              font-size px2rem(26)
              border-bottom px2rem(1) solid #ccc
              & h3
                min-height px2rem(78)
                padding-top px2rem(20)
                line-height px2rem(50)
                position relative
                padding-right px2rem(30)
                text-align justify
                &.resp
                  color #17a1e5
              & i
                position absolute
                right 0
                color #15a81b
                top px2rem(30)
              .resp-wrap
                width 100%
                background-color #eee
                font-size px2rem(20)
                margin-bottom px2rem(4)
                height 0
                overflow hidden
                transition height 400ms ease
                &.open
                  height px2rem(200)
                & p
                  padding px2rem(20)
                  line-height px2rem(34)
                  text-align justify
        .suggestion-bar
          height px2rem(524)
          bottom 0
          left 0
          .bar-wrap
            padding 0 px2rem(50)
            .textarea-box
              position relative
              padding-top px2rem(62)
              & textarea
                display block
                box-sizing border-box
                width 100%
                height px2rem(250)
                outline none
                resize none
                padding px2rem(20) px2rem(20) px2rem(48) px2rem(20)
                font-size px2rem(26)
                border-color #bfbfbf
              .sgt-tip
                position absolute
                bottom px2rem(14)
                right px2rem(14)
                color #ccc
          .input-box
            margin-top px2rem(20)
            display flex
            & input
              width px2rem(410)
              border px2rem(1) solid #bfbfbf
              padding px2rem(18)
            .checkcode
              margin-left px2rem(44)
              padding px2rem(16) px2rem(32)
              line-height px2rem(32)
              font-weight bold
              color #8fbc8f
              -webkit-text-stroke px2rem(1) #152f69
              background-color #e3e0ff
          .btn-wrap
            padding 0
            margin-top px2rem(20)
            & button
              border px2rem(1) solid #ab3e02
              background-image linear-gradient(to bottom, #ffee00, #ff7f00)
              -webkit-text-stroke px2rem(1) #b33600
              box-shadow 0 px2rem(4) px2rem(4) #b0490e
  @keyframes shakeThumb {
    0% {
      transform scale(0.9) rotate(-30deg)
    }
    50% {
      transform scale(2) rotate(30deg)
    }
    100% {
      transform scale(1) transform rotate(0deg)
    }
  }
</style>
