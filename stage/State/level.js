import config from '../GameConfiger/config';
import simpleButton from '../GUI/SimpleButton';
import popModal from '../GUI/popModal';
import {buyPlayTimes, sharePlayTimes, initGame, playSuccess, shareApi} from '../../view/mock/getMocks';

class Level extends Phaser.State {
  constructor () {
    super();
  }

  init (params) {
    this.fromPreload = params.param.frompreloader;
    this.overlay = params.overlay;
    this.gameBg = this.game.add.bitmapData(config.GAME_WIDTH, config.GAME_HEIGHT);
    this.gameBg.addToWorld();
    this.initArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.picArr = [1, 2, 3, 4, 5, 6];
    this.wasDrag = !1;
    this.currentBlock = null;
    this.resetData();
    this.isOver = !0;
    this.alive = null;
    this.msg = null;
    this.playStatus = null;
  }

  resetData () {
    this.scsok = !1;
    this.timestamp = 0;
    this.totalTime = 40 * 1000;
    this.surplusTime = this.totalTime;
    this.isOver = !1;
  }

  create () {
    this.initShare();
    this.gradientColor();
    this.addModal();
    this.addRule();
    this.generateBtn();
    this.addTimebar();
    this.addJsBg();
    this.addJigsaw();
    this.addPop();
    this.hideOverlay();
  }

  async initShare () {
    try {
      let resp = await shareApi(
        {
          url: window.location.href
        }
      );
      resp.data.code === '1' && this.gameShare(resp.data.data);
    } catch (e) {
      window.vcom.showMessage(!1, '分享请求失败，请重试！');
    }
  }

  gameShare (data) {
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
        window.vcom.showMessage(!1, '验证失败' + res);
      });
      wx.onMenuShareTimeline({
        title: '拼图游戏',
        link: 'http://www.me2u.com.cn/MemberCenter/#/manor',
        imgUrl: '',
        success: () => {
          this.shareGameTime();
        },
        cancel: function () {
        }
      });

      wx.onMenuShareAppMessage({
        title: '拼图游戏', // 分享标题
        desc: '囧囧拼图', // 分享描述
        link: 'http://www.me2u.com.cn/MemberCenter/#/manor',
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          this.shareGameTime();
        },
        cancel: () => {
          // 用户取消分享后执行的回调函数
        }
      });
    });
  }

  async shareGameTime () {
    try {
      let resp = await sharePlayTimes();
      if (resp.data.code === '1') {
        this.playStatus = JSON.parse(resp.data.data)
        this.startBtn.visible = !1;
        this.startText.visible = !1;
        this.resetData();
        this.translateTime(this.totalTime);
        this.dispatchJigsaw();
      };
      resp.data.code === '0' && window.vcom.showMessage(!1, resp.data.msg);
    } catch (e) {
      window.vcom.showMessage(!1, '分享响应失败，请重新分享');
    }
  }

  addRule () {
    this.ruleGp = this.game.add.group(this.world);
    let titleStyle = {
      font: '32px GrilledCheeseBTNToasted',
      fill: '#ffffff',
      fontWeight: 'bold'
    };
    this.ruleTitle = this.game.add.text(config.HALF_GAME_WIDTH, this.modalGp.height + 80, '拼图规则', titleStyle, this.ruleGp);
    this.ruleTitle.anchor.set(0.5);
    let ruleContent = [
      {
        index: 1,
        text: '游戏一轮时间为3分钟'
      },
      {
        index: 2,
        text: '每天每个账号有一次免费挑战的机会，分享成功可再获得一\n次体验机会，或会员可消耗50积分购买一次体验机会，每个账\n号每天最多可购买3次。'
      },
      {
        index: 3,
        text: '完成挑战可获得80个积分。'
      }
    ];

    let ruleStyle = {
      font: '24px GrilledCheeseBTNToasted',
      fill: '#ffffff',
      lineSpacing: 4
    };

    for (let item of ruleContent) {
      let rule = this.game.add.text(40, 0, item.index + '、' + item.text, ruleStyle, this.ruleGp);
      item.index === 1 && (rule.y = 40 + this.ruleTitle.y);
      item.index === 2 && (rule.y = 90 + this.ruleTitle.y);
      item.index === 3 && (rule.y = 210 + this.ruleTitle.y);
    }

  }

  async initData () {
    try {
      let resp = await initGame();
      this.alive = resp.data.code;
      this.msg = resp.data.msg;
      this.playStatus = resp.data.data;
      this.playStatus = JSON.parse(this.playStatus);
    } catch (e) {
      window.vcom.showMessage(!1, '服务器请求失败，请重试');
    }
  }

  async buyPlayTimes () {
    try {
      let resp = await buyPlayTimes();
      if (resp.data.code === '1') {
        this.startBtn.visible = !1;
        this.startText.visible = !1;
        this.playStatus = JSON.parse(resp.data.data);
        this.resetData();
        this.translateTime(this.totalTime);
        this.dispatchJigsaw();
      } else {
        window.vcom.showMessage(!1, resp.data.msg);
      }
    } catch (e) {
      console.log(e);
      window.vcom.showMessage(!1, '购买失败，请重试');
    }
  }

  gradientColor () {
    let y = 0;
    let l = 30;
    const lineH = Math.floor(config.GAME_HEIGHT / l);
    const endH = config.GAME_HEIGHT % l;
    for (let i = 0; i < l; i++) {
      let color = Phaser.Color.interpolateColor(0xfcb621, 0xff9701, 30, i);
      this.gameBg.rect(0, y, config.GAME_WIDTH, y + lineH, Phaser.Color.getWebRGB(color));
      y += lineH;
    }
    let endColor = Phaser.Color.interpolateColor(0xfcb621, 0xff9701, 30, 30);
    this.gameBg.rect(0, y, config.GAME_WIDTH, y + endH, endColor);
  }

  addModal () {
    this.modalGp = this.game.add.group(this.world);
    this.modalGp.position.set(0, 40);
    this.modal = this.game.add.graphics(0, 0, this.modalGp);
    this.modal.beginFill(0xcd7400);
    this.modal.drawRoundedRect(0, 0, 674, 890, 24);
    this.modal.endFill();
    this.modal.x = config.HALF_GAME_WIDTH - this.modal.width * 0.5;
    this.innerModal = this.game.add.image(config.HALF_GAME_WIDTH, 16, 'gameBg', null, this.modalGp);
    this.innerModal.anchor.set(0.5, 0);
  }

  shuffleArr () {
    let l = this.initArr.length;
    const rdArr = [...this.initArr];
    for (let i = 0; i < l; i++) {
      let rdx = Math.floor(Math.random() * (l - i - 1));
      let tmp = rdArr[rdx];
      rdArr[rdx] = rdArr[l - i - 1];
      rdArr[l - i - 1] = tmp;
    }
    return rdArr;
  }

  addTimebar () {
    let style = {
      font: '30px GrilledCheeseBTNToasted',
      fill: '#7a4404',
      fontWeight: 'bold'
    };
    this.timerbarGp = this.game.add.group(this.modalGp);
    this.timerbarGp.position.set(config.HALF_GAME_WIDTH, 44);
    this.timeName = this.game.add.text(-180, 0, '时间:', style, this.timerbarGp);
    this.timeName.anchor.set(1, 0);
    this.outTimebar = this.game.add.graphics(-150, 0);
    this.timerbarGp.add(this.outTimebar);
    this.outTimebar.beginFill(0x7a4404);
    this.outTimebar.drawRoundedRect(0, 0, 400, 36, 18);
    this.outTimebar.endFill();
    this.innerTimebar = this.game.add.graphics(-150, 0);
    this.timerbarGp.add(this.innerTimebar);
    this.innerTimebar.beginFill(0xf8b551);
    this.innerTimebar.drawRect(0, 0, 400, 36);
    this.innerTimebar.endFill();
    this.maskbar = this.game.add.graphics(-150, 0);
    this.timerbarGp.add(this.maskbar);
    this.maskbar.beginFill(0x7a4404);
    this.maskbar.drawRoundedRect(0, 0, 400, 36, 18);
    this.maskbar.endFill();
    this.innerTimebar.mask = this.maskbar;
    this.timerText = this.game.add.text(0, 0, '00:00', style, this.timerbarGp);
    this.timerText.fill = '#ffffff';
    this.timerText.position.set(10, 0);
    this.translateTime(this.totalTime);
  }

  update () {
    if (!this.isOver) {
      this.timestamp += this.game.time.elapsedMS;
      this.timestamp > 200 && (this.timestamp = 0, this.countTimer());
    }
  }

  countTimer () {
    if (this.surplusTime <= 0) {
      this.isOver = !0;
      this.showFail();
      this.generateAgainBtn();
      return;
    }
    this.surplusTime -= 200;
    let r = this.surplusTime / this.totalTime;
    this.innerTimebar.width = 400 * r;
    this.translateTime(this.surplusTime);
  }

  translateTime (t) {
    let minute = Math.floor(t / 6e4).length > 1 ? Math.floor(t / 6e4) : '0' + Math.floor(t / 6e4);
    let second = Math.floor((t % 6e4) / 1000).toString().length > 1 ? Math.floor((t % 6e4) / 1000) : '0' + Math.floor((t % 6e4) / 1000);
    this.timerText.setText(minute + ':' + second);
  }

  addJsBg () {
    this.jsGp = this.game.add.group(this.modalGp);
    this.jsGp.x = config.HALF_GAME_WIDTH;
    this.jsGp.y = 114;
    this.jsbg = this.game.add.graphics(0, 0);
    this.jsbg.beginFill(0x633703);
    this.jsbg.drawRect(0, 0, 600, 600);
    this.jsbg.endFill();
    this.jsGp.x -= this.jsbg.width * 0.5;
  }

  addJigsaw () {
    let block;
    this.jsGp.removeAll();
    this.jsGp.add(this.jsbg);
    let key = 'res' + this.game.rnd.pick(this.picArr);
    this.blockArr = [];
    for (let [index, item] of new Map(this.shuffleArr().map((item, index) => [index, item]))) {
      block = this.jsGp.create(10 + 195 * (index % 3), 10 + 195 * Math.floor(index / 3), key, item);
      block.nowSort = index;
      block.sort = item;
      block.inputEnabled = !0;
      this.blockArr.push(block);
    }
  }

  dispatchJigsaw () {
    for (let block of this.blockArr) {
      block.input.enableDrag();
      block.input.bringToTop = !0;
      // 拖动自由，松手按尺寸定位
      block.input.enableSnap(195, 195, false, true, 10, 10);
      block.events.onDragStart.add(this.dragStart, this);
      block.events.onDragStop.add(this.dragStop, this);
    }
  }

  dragStart (sprite, event) {
    if (this.isOver === !0) {
      sprite.input.disableDrag();
      return;
    }
    this.wasDrag = !0;
    this.originX = sprite.position.x;
    this.originY = sprite.position.y;
    this.currentBlock = sprite;
    this.currentBlock.blendMode = PIXI.blendModes.ADD;
    this.dragTween = this.game.add.tween(sprite.scale).to({
      x: 0.95,
      y: 1.05
    }, 200, Phaser.Easing.Back.Out, !0, 0, 1e4, !0);
  }

  dragStop () {
    if (this.wasDrag = !0) {
      this.dragTween.pause();
      this.currentBlock.scale.set(1, 1);
      this.wasDrag = !1;
      this.currentBlock.blendMode = PIXI.blendModes.COLOR;
      this.checkBounds();
      this.exchangeBlock();
    }
  }

  checkBounds () {
    let _tmpX = (this.currentBlock.x - 10) / 195;
    let _tmpY = (this.currentBlock.y - 10) / 195;
    if (_tmpX < 0 || _tmpX > 2 || _tmpY < 0 || _tmpY > 2) {
      this.game.add.tween(this.currentBlock).to({
        x: this.originX,
        y: this.originY
      }, 300, Phaser.Easing.Cubic.Out, !0, 0);
    }
  }

  exchangeBlock () {
    this.scsok = !0;
    let movedIndex = (this.currentBlock.x - 10) / 195 + (this.currentBlock.y - 10) / 195 * 3;
    if (movedIndex === this.currentBlock.nowSort) {
      return;
    }
    this.exchanged = !1;
    let exchangeTween = null;
    this.jsGp.forEach((sprite) => {
      if (sprite.nowSort === movedIndex && !this.exchanged) {
        sprite.nowSort = this.currentBlock.nowSort;
        this.currentBlock.nowSort = movedIndex;
        this.exchanged = !0;
        exchangeTween = this.game.add.tween(sprite).to({
          x: this.originX,
          y: this.originY
        }, 200, Phaser.Easing.Quartic.Out, !0);
      }
      if (sprite.nowSort !== sprite.sort) {
          this.scsok = !1;
      };
    });

    this.scsok && exchangeTween.onComplete.addOnce(() => {
      this.playSuccess();
    });

    exchangeTween = null;
  }

  async playSuccess () {
    try {
      let resp = await playSuccess({type: this.playStatus.type});
      if (resp.data.code === '1') {
        this.showSuccess();
      } else {
        window.vcom.showMessage(!1, '提交不合法！');
      }
    } catch (e) {
      console.log(e);
      window.vcom.showMessage(!1, '提交失败');
    }
    this.generateAgainBtn();
    this.isOver = !0;
  }

  generateBtn () {
    this.btnGp = this.game.add.group(this.modalGp);
    this.startBtn = new simpleButton(this.game, 0, 0, 'gameUi', 'gameBtn1.png');
    this.btnGp.position.set(config.HALF_GAME_WIDTH, this.modalGp.height - this.startBtn.height - 10);
    this.btnGp.add(this.startBtn);
    this.startText = this.game.add.text(0, 0, '开始游戏', {
      font: '32px GrilledCheeseBTNToasted',
      fill: '#ffffff',
      fontWeight: 'bold',
      stroke: '#005600',
      strokeThickness: 8
    }, this.btnGp);
    this.startText.anchor.set(0.5);
    this.startBtn.callback.add(() => {
        this.beginGame();
    });
  }

  beginGame () {
    this.initData().then(() => {
      if (this.msg) {
        if (this.alive === '1') {
          this.startBtn.visible = !1;
          this.startText.visible = !1;
          this.resetData();
          this.translateTime(this.totalTime);
          this.dispatchJigsaw();
        } else {
          if (this.playStatus.buyCount > 0) {
            window.vcom.showConfirm('花费50积分再来一次？');
            window.vcom.buyAction = this.buyPlayTimes;
            window.vcom.buyAction = window.vcom.buyAction.bind(this);
          } else {
            window.vcom.showMessage(!1, '购买次数已用完');
          }
        }
      }
    });
  }

  tryAgain () {
    this.addJigsaw();
    this.beginGame();
  }

  addPop () {
    this.popModal = new popModal(this.game, this.game.world);
  }

  showSuccess () {
    this.popModal.exists = !0;
    this.popModal.visible = !0;
    this.popModal.makeSuccess();
    this.generateAgainBtn();
  }

  generateAgainBtn () {
    this.startBtn.visible = !0;
    this.startText.visible = !0;
    this.startText.setText('再玩一次');
    this.startBtn.callback.add(() => {
      this.tryAgain();
    });
  }

  showFail () {
    this.popModal.exists = !0;
    this.popModal.visible = !0;
    let fail = this.popModal.makeFail();
    fail.add(() => {
      this.popModal.visible = !1;
      this.tryAgain();
    });
  }

  // 隐藏转场遮罩层
  hideOverlay () {
    this.hideLayTween = this.game.add.tween(this.overlay).to({
      alpha: 0
    }, 400, Phaser.Easing.Cubic.Out, !0);
    this.hideLayTween.onComplete.addOnce(() => {
      this.overlay.visible = !1;
    });
  }
}

export default Level;
