<template>
    <div class="into-manor" v-show="watchVis">
      <div v-show="!tipvisible">
        正在进入囧囧庄园...
      </div>
      <v-tips :popType="popType" :delay="!1" :open="tipvisible" @close="closetips">
        <div slot="tipmes" :class="'default' + (commitFlag ? '' : ' warning')">{{tiptext}}</div>
      </v-tips>
      <v-confirm :open="confirmVisible" @close="closeConfirm">
        <div slot="tipscf">{{confirmText}}</div>
      </v-confirm>
    </div>
</template>
<script type="text/ecmascript-6">
  import PIXI from 'phaser-ce/build/custom/pixi';
  import Phaser from 'phaser-ce/build/custom/phaser-no-physics';
  import DragonBones from 'phaser-ce/build/custom/dragonbones';
  import Game from './InitGame/initGame';
  import {mapState} from 'vuex';
  import Tips from 'components/pop/poptips';
  import Confirm from 'components/pop/popcomfirm';
    export default {
      name: 'jjg-manor',
      data () {
        return {
          popType: 'center',
          tipvisible: !1,
          confirmVisible: !1,
          commitFlag: !1,
          tiptext: '',
          confirmText: '',
          watchVis: !0
        }
      },
      computed: {
        ...mapState(['personInfo', 'ucInfo'])
      },
      watch: {
        personInfo: {
          handler (v) {
            this.init();
          },
          deep: true
        }
      },
      mounted () {
        this.init();
      },
      methods: {
        init () {
          window.PIXI = PIXI;
          window.Phaser = Phaser;
          Phaser.vue = this;
          window.psObj = this.personInfo;
          window.ucObj = this.ucInfo;
          window.DragonBones = DragonBones;
          window.game ? (document.querySelector('#manor').style.display = 'block' , this.watchVis = !1) : window.game = new Game();
          window.vcom = this;
          },
        showMessage (b, m) {
          this.commitFlag = b;
          this.tipvisible = !0;
          this.tiptext = m;
          this.watchVis = !0;
        },
        closetips (v) {
          this.watchVis = v;
          this.tipvisible = v;
        },
        showConfirm (m) {
          this.confirmVisible = !0;
          this.watchVis = !0;
          this.confirmText = m;
        },
        closeConfirm (f) {
          this.confirmVisible = !1;
          this.watchVis = !1;
          f && this.buyAction();
        },
        buyAction () {

        }
      },
      components: {
        'v-tips': Tips,
        'v-confirm': Confirm
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../view/assets/stylus/mixin.styl';
  .into-manor
    position absolute
    z-index 999
    left 0
    top 0
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    font-size px2rem(24)
    color #fff
</style>
