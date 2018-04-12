<template>
    <div class="ed-wrap">
      <div class="ed-panel">
        <div class="ed-item" v-for="(item, index) in infoList" @click.prevent.stop="openEditModal(index)">
          <div class="ed-title">{{item.title}}</div>
          <div class="ed-info">
            <div class="info-text" v-if="item.avator">
              <img :src="item.value">
            </div>
            <div class="info-text" v-else>
              {{item.value}}
            </div>
            <div class="nextPage"></div>
          </div>
        </div>
      </div>
      <div class="ed-panel">
        <div class="ed-item">
          <div class="ed-title">账号绑定</div>
          <div class="ed-info">
            <div class="info-text">
              <i class="icon-qq"></i>
              <i class="icon-weixin"></i>
              <i class="icon-weibo"></i>
            </div>
            <div class="nextPage"></div>
          </div>
        </div>
        <div class="ed-item">
          <div class="ed-title">登录密码</div>
          <div class="ed-info">
            <div class="nextPage"></div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="edit-btn" @click.prevent.stop="savePersonInfo">保存修改并退出</button>
      </div>
      <v-tips :popType="popType" :delay="!1" :opacity="mask" :open="tipvisible" @close="closetips">
        <div slot="tipmes" class="avator">
          <div v-show="editIndex === 0">
            <vueCropper
                        ref="crop"
                        :img="avatorConfig.uploadAst"
                        :outputSize="0.1"
                        :info="avatorConfig.info"
                        :outputType="avatorConfig.outputType"
                        :canScale="avatorConfig.canScale"
                        :autoCrop="avatorConfig.autoCrop"
                        :autoCropWidth="avatorConfig.autoCropWidth"
                        :autoCropHeight="avatorConfig.autoCropHeight"
                        :fixed="avatorConfig.fixed"
            ></vueCropper>
            <div class="btn-group">
              <div class="btn-half-wrap">
                <div class="uploadwrap">
                  <button class="btn-upload" type="button">上传头像</button>
                  <input type="file" accept="image/jpg, image/png, image/jpeg" v-on:change="changeFile">
                </div>
              </div>
              <div class="btn-half-wrap"><button class="btn-confirm" type="button" @click.prevent.stop="subAvator">确认替换</button></div>
            </div>
          </div>
          <div v-show="editIndex === 1">
            <input class="inputStyle" type="text" maxlength="8" v-model="editObj.username">
            <div class="btn-wrap">
              <button type="button" class="btn-confirm" @click.prevent.stop="closeAndSave(editIndex)">确定</button>
            </div>
          </div>
          <div v-show="editIndex === 2">
            <div class="checkbox">
              <div class="checkwrap">
                <div class="checkitem" v-for="(item, index) in resetGender" @click.prevent.stop="checkGender(index)">
                  <i :class="item.flag ? 'icon-check-circle' : 'icon-circle-o'"></i>
                  <span>{{item.name}}</span>
                </div>
              </div>
            </div>
            <div class="btn-wrap">
              <button type="button" class="btn-confirm" @click.prevent.stop="closeAndSave(editIndex)">确定</button>
            </div>
          </div>
          <div v-show="editIndex === 3">
            <input class="inputStyle" type="tel" maxlength="11" v-model="editObj.tel">
            <div class="btn-wrap">
              <button type="button" class="btn-confirm" @click.prevent.stop="closeAndSave(editIndex)">确定</button>
            </div>
          </div>
          <div v-show="editIndex === 4">
          </div>
          <div v-show="editIndex === -1" class="default">{{tiptext}}</div>
        </div>
      </v-tips>
    </div>
</template>
<script type="text/ecmascript-6">
  import Tips from '../../../components/pop/poptips';
  import {editUserData} from '../../../mock/getMocks';
  import {mapState} from 'vuex';
  import VueCropper from 'vue-cropper';
  import xss from 'xss';
    export default {
      name: 'ed',
      data () {
        return {
          pageInfo: {},
          infoList: [
            {
              title: '头像',
              avator: true
            },
            {
              title: '用户名'
            },
            {
              title: '性别'
            },
            {
              title: '手机号'
            }
          ],
          tipvisible: !1,
          popType: 'center',
          mask: 0,
          tipType: '',
          tiptext: '',
          avatorConfig: {
            uploadAst: '',
            info: false,
            outputType: 'jpg',
            canScale: true,
            autoCrop: true,
            autoCropWidth: 0,
            autoCropHeight: 0,
            fixed: true
          },
          editIndex: 0,
          editObj: {
          },
          checkObj: [
            {
              name: '男',
              value: 0
            },
            {
              name: '女',
              value: 1
            }
          ]
        };
      },
      mounted () {
        this.pageInfo = this.$store.state.personInfo;
        this.init();
      },
      computed: {
        ...mapState(['personInfo']),
        resetGender () {
          this.pageInfo.sex ? (this.checkObj[0]['flag'] = !1, this.checkObj[1]['flag'] = !0)
            : (this.checkObj[0]['flag'] = !0, this.checkObj[1]['flag'] = !1);
          return this.checkObj;
        }
      },
      watch: {
        personInfo: {
          handler (val) {
            this.pageInfo = val;
            this.init();
          },
          deep: true
        }
      },
      methods: {
        init () {
          this.infoList[0]['value'] = this.pageInfo.headimgurl;
          this.infoList[1]['value'] = this.pageInfo.username;
          this.infoList[2]['value'] = this.pageInfo.sex ? '女' : '男';
          this.infoList[3]['value'] = this.pageInfo.tel;
          this.avatorConfig.uploadAst = this.pageInfo.headimgurl;
          this.editObj.username = xss(this.pageInfo.username);
          this.editObj.tel = xss(this.pageInfo.tel);
        },
        openEditModal (index) {
          this.mask = 0.9;
          this.tipvisible = !0;
          this.editIndex = index;
        },
        closetips (v) {
          this.tipvisible = v;
        },
        closeAndSave (i) {
          this.tipvisible = !1;
          i === 1 && (this.infoList[i]['value'] = xss(this.editObj.username));
          i === 2 && (this.editObj.sex = this.pageInfo.sex,
            this.infoList[i]['value'] = this.pageInfo.sex ? '女' : '男');
          i === 3 && (this.infoList[i]['value'] = xss(this.editObj.tel));
        },
        checkGender (index) {
          this.pageInfo.sex = index;
        },
        setTipsText (text) {
          this.editIndex = -1;
          this.mask = 0.5;
          this.tiptext = text;
        },
        changeFile (e) {
          let reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onload = () => {
            this.avatorConfig.uploadAst = reader.result;
          };
        },
        subAvator () {
          this.$refs.crop.getCropData((data) => {
            let mes = '头像修改成功';
            this.editBaseInfo({
              'headimgurl': data
            }, !1, mes);
          });
        },
        async editBaseInfo (params, goback, mes) {
          try {
            let resp = await editUserData(params);
            if (resp.data.code === '1') {
              this.$store.state.personInfo = JSON.parse(resp.data.data);
              mes && this.setTipsText(mes);
              goback && this.$router.go(-1);
            } else {
              this.setTipsText('修改失败！');
            }
            // this.refreshUserData(goback, mes);
          } catch (e) {
            this.setTipsText('请求错误请重试！');
            console.log(e);
          }
        },
        // // 更新local userinfo
        // async refreshUserData (goback, mes) {
        //     try {
        //       let res = await getUserData({id: this.pageInfo.id});
        //       let userInfo = JSON.stringify(res.data[0]);
        //       window.localStorage.setItem('userinfo', userInfo);
        //     } catch (e) {
        //       this.setTipsText('请求错误请重试！');
        //       console.log(e);
        //     }
        // },
        savePersonInfo () {
            this.editBaseInfo(this.editObj, !0, '信息修改成功！');
        }
      },
      components: {
        'v-tips': Tips,
        'VueCropper': VueCropper
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../assets/stylus/mixin.styl';
  .ed-wrap
    padding px2rem(18)
    .ed-panel
      width 100%
      min-height px2rem(200)
      box-sizing border-box
      background-color #6bc4eb
      border px2rem(10) solid #fff
      border-radius px2rem(40)
      overflow hidden
      padding px2rem(10) px2rem(30)
      font-size px2rem(30)
      margin-bottom px2rem(30)
      .ed-item
        display flex
        align-items center
        padding px2rem(20) 0
        .ed-title
          padding 0 px2rem(16)
          font-weight bold
        .ed-info
          display flex
          flex 1
          justify-content flex-end
          align-items center
          & i
            display inline-block
            width px2rem(54)
            height px2rem(54)
            line-height px2rem(54)
            text-align center
            border-radius 50%
            overflow hidden
            color #fff
            font-size px2rem(30)
          & i:nth-child(1)
            background-color #00a0e9
          & i:nth-child(2)
            background-color #22ac38
          & i:nth-child(3)
            background-color #ed492d
          & img
            display block
            width px2rem(156)
            height px2rem(156)
            border-radius 50%
            overflow hidden
        .nextPage
          width px2rem(34)
          height px2rem(50)
          background url("../../../assets/image/enter.png") no-repeat
          background-size 100% 100%
          margin-left px2rem(32)
    .edit-btn
       background-color #ff9e00
       -webkit-text-stroke px2rem(2) #b33600
       box-shadow 0 px2rem(4) px2rem(8) #af3f03
    .avator
      .inputStyle
        display block
        width px2rem(400)
        height px2rem(80)
        padding-left px2rem(20)
        margin 0 auto
        border-radius px2rem(20)
        overflow hidden
        border px2rem(4) solid #999
      .vue-cropper
        width px2rem(600)
        height px2rem(600)
        border px2rem(4) solid #fff
        border-radius px2rem(8)
        .crop-point
          width px2rem(12)
          height px2rem(12)
      .btn-confirm
        background-color #00ff9b
        -webkit-text-stroke px2rem(2) #6fb365
        box-shadow 0 px2rem(4) px2rem(8) #17af98
      .uploadwrap
        position relative
        .btn-upload
          background-color #1552ff
          -webkit-text-stroke px2rem(2) #4587b3
          box-shadow 0 px2rem(4) px2rem(8) #7faf9c
        & input
          width px2rem(180)
          height px2rem(50)
          position absolute
          left 0
          top 0
          opacity 0
      .checkbox
        margin 0 auto
        width px2rem(500)
        height px2rem(200)
        background-color #8fbc8f
        font-size px2rem(30)
        border-radius px2rem(40)
        border px2rem(4) solid #fff
        padding px2rem(30)
        display flex
        align-items center
        .checkitem
          padding px2rem(20) 0
          & i
            color #fff
          & span
            margin-left px2rem(20)
</style>
