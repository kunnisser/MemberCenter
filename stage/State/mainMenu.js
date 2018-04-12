const Phaser = window.Phaser;
import Config from '../GameConfiger/config';
import menuPanel from '../GUI/menuPanel';
import SimpleButton from '../GUI/SimpleButton';
import TouchAction from '../Action/touchAction';
import DrinkingAction from '../Action/drinkingAction';
import EatingAction from '../Action/eatingAction';
import {careForDogs, buyDogsProp, rebornDogs} from '../../view/mock/getMocks';

class mainMenu extends Phaser.State {
    constructor () {
        super();
    }

    init (params) {
        this.fromPreload = params.param.frompreloader;
        this.overlay = params.overlay;
        this.picturesIndex = 0;
        this.clickedPicture = null;
        this.inputDown = !1;
        this.updateView = !1;
        this.startDragX = 0;
        this.wasDragged = !1;
        this.eatingDelayTime = params.param.resp.next_food_time < 0 ? 0 : params.param.resp.next_food_time;
        this.waterDelayTime = params.param.resp.next_water_time < 0 ? 0 : params.param.resp.next_water_time;
        this.touchDelayTime = params.param.resp.last_touch_time < 0 ? 0 : params.param.resp.last_touch_time;
        this.foodPrice = params.param.resp.food_expend_score;
        this.waterPrice = params.param.resp.water_expend_score;
        this.alive = params.param.resp.is_alive;
        this.currentScore = window.ucObj.myscore;
        this.username = window.psObj.username;
        this.signDay = params.param.resp.continue_days;
    }

    create () {
      this.deploy();
    }

    deploy () {
      this.addGameMenu();
      this.addDistantView();
      this.addBottomNav();
      this.addTopNav();
      this.addAvatorInfo();
      this.showActionWrap();
      this.showAlive();
      this.addShopModal();
      this.initItemData();
      this.updatePicturesView();
      this.initInput();
      this.resize();
      this.hideOverlay();
    }

    /* 添加背景 */
    addGameMenu () {
        this.mainSpritebatch = this.world;
        this.gameBg = this.game.add.image(0, 0, 'manorUi', 'manorBg.png', this.mainSpritebatch);
    }

    addDistantView () {
      this.distantGp = this.game.add.group(this.world);
      this.distantGp.position.x= Config.HALF_GAME_WIDTH;
      this.sun = this.game.add.image(0, 0, 'distant', 'sun.png', this.distantGp);
      this.sun.anchor.set(0.5);
      this.game.add.tween(this.sun).to({
        angle: 360
      }, 4800, Phaser.Easing.Back.Out, !0, 0, 1e4);
      this.sun.y = 240;
      this.sun.x -= this.sun.width * 1.5;

      this.bracket = this.game.add.image(0, 0, 'distant', 'bracket.png', this.distantGp);
      this.bracket.anchor.set(0.5);
      this.bracket.position.set(140, 440);

      this.circle = this.game.add.image(this.bracket.x, this.bracket.y - 84, 'distant', 'circle.png', this.distantGp);
      this.circle.anchor.set(0.5, 0.48);
      this.distantGp.swapChildren(this.bracket, this.circle);
      this.game.add.tween(this.circle).to({
        angle: 360
      }, 2400, Phaser.Easing.Linear.None, !0, 0, 1e4);

      this.cloud = this.game.add.image(this.sun.x, this.sun.y + 100, 'distant', 'cloud.png', this.distantGp);
      this.cloud.anchor.set(0.5);
      this.game.add.tween(this.cloud).to({
        x: this.cloud.x + 180
      }, 8800, Phaser.Easing.Sinusoidal.InOut, !0, 0, 1e4, !0);
    }

    /* generate UiBtn */

    addBottomNav () {
      this.bottomNav = this.game.add.group(this.mainSpritebatch, 'bottomNav');
      this.bottomBtnArr = [
        'touchIcon.png',
        'feedingIcon.png',
        'drinkingIcon.png',
        'gameIcon.png'
      ];
      this.bottomNav.position.set(Config.HALF_GAME_WIDTH, Config.GAME_HEIGHT - 36);
      for (let key of this.bottomBtnArr) {
        let btn = new SimpleButton(this.game, 0, 0, 'manorIcon', key);
        btn.anchor.set(0.5, 1);
        this.bottomNav.add(btn);
      }
      this.bottomNav.children[0].x = -230;
      this.bottomNav.children[1].x = -75;
      this.bottomNav.children[2].x = 75;
      this.bottomNav.children[3].x = 230;

      this.bottomNav.children[0].callback.add(() => {
        if (!this.alive) {
          window.vcom.showMessage(!1, '囧囧似乎已经离家出走了呢！');
          return;
        }
        this.actionBox.removeAll();
        this.actionBox.add(this.touch);
        this.bottomNav.children[0].inputEnabled = !1;
        this.bottomNav.children[1].inputEnabled = !0;
        this.bottomNav.children[2].inputEnabled = !0;
        this.touch.armatureDisplay.visible = !0;
        !this.touchDelayTime &&
        this.careForDogs('touch').then((e) => {
          this.bottomNav.children[0].inputEnabled = !0;
          e === '1' &&
            (this.touch.armatureDisplay.animation.play('touchOne', 0),
              this.touch.timebar.visible = !0,
              this.touch.timeText.visible = !0,
              this.touch.bootTime(this.touchDelayTime));
        }, this);
      });
      this.bottomNav.children[1].callback.add(() => {
        if (!this.alive) {
          window.vcom.showMessage(!1, '囧囧似乎已经离家出走了呢！');
          return;
        }
        this.actionBox.removeAll();
        this.actionBox.add(this.eating);
        this.eating.armatureDisplay.visible = !1;
        this.eating.armatureDisplay1.visible = !1;
        this.bottomNav.children[1].inputEnabled = !1;
        this.bottomNav.children[0].inputEnabled = !0;
        this.bottomNav.children[2].inputEnabled = !0;
        if (!this.eatingDelayTime) {
          this.eating.timebar.visible = !1;
          this.eating.timeText.visible = !1;
          this.eating.armatureDisplay.visible = !0;
          this.careForDogs('food').then((e) => {
            this.bottomNav.children[1].inputEnabled = !0;
            e === '1' &&
            (this.eating.timebar.visible = !0,
              this.eating.timeText.visible = !0,
              this.eating.armatureDisplay.visible = !0,
              this.eating.armatureDisplay1.visible = !1,
              this.eating.armatureDisplay.animation.play('eatingFood', 1),
              this.game.time.events.add(3800, () => {
                this.eating.armatureDisplay.visible = !1,
                this.eating.armatureDisplay1.visible = !0,
                this.eating.armatureDisplay1.animation.play('newAnimation', 0)
              }),
              this.eating.bootTime(this.eatingDelayTime));
          }, this);
        } else {
          this.eating.timebar.visible = !0;
          this.eating.timeText.visible = !0;
          this.eating.armatureDisplay1.visible = !0;
          this.eating.bootTime(this.eatingDelayTime);
          this.eating.armatureDisplay1.animation.play('newAnimation', 0)
        }
      });
      this.bottomNav.children[2].callback.add(() => {
        if (!this.alive) {
          window.vcom.showMessage(!1, '囧囧似乎已经离家出走了呢！');
          return;
        }
        this.actionBox.removeAll();
        this.actionBox.add(this.drinking);
        this.bottomNav.children[2].inputEnabled = !1;
        this.bottomNav.children[0].inputEnabled = !0;
        this.bottomNav.children[1].inputEnabled = !0;
        if (this.waterDelayTime) {
          this.drinking.timebar.visible = !0;
          this.drinking.timeText.visible = !0;
          this.drinking.bootTime(this.waterDelayTime);
        } else {
          this.drinking.timebar.visible = !1;
          this.drinking.timeText.visible = !1;
          this.careForDogs('water').then((e) => {
            this.bottomNav.children[2].inputEnabled = !0;
            e === '1' &&
            (this.drinking.timebar.visible = !0,
              this.drinking.timeText.visible = !0,
              this.drinking.armatureDisplay.animation.play('drinkWater', 0),
              this.drinking.bootTime(this.waterDelayTime));
          }, this);
        }
      });
      this.bottomNav.children[3].callback.add(() => {
        this.game.changeState('level', {fromPreload: !1});
      });
    }

    async careForDogs (type) {
      try {
        let param = {type};
        let resp = await careForDogs(param);
        if (resp.data.code === '1') {
          this.eatingDelayTime = resp.data.data['next_food_time'] < 0 ? 0 : resp.data.data['next_food_time'];
          this.waterDelayTime = resp.data.data['next_water_time'] < 0 ? 0 : resp.data.data['next_water_time'];
          this.touchDelayTime = resp.data.data['next_touch_time'] < 0 ? 0 : resp.data.data['next_touch_time'];
          window.vcom.$store.state.ucInfo.myscore = resp.data.data.score;
          return resp.data.code;
        } else if (resp.data.code === 'not_to_time') {
          window.vcom.showMessage(!1, resp.data.msg);
        } else if (resp.data.code === 'no_enough_stroge'){
          window.vcom.showMessage(!1, resp.data.msg);
        }
      } catch (e) {
        console.log(e);
        window.vcom.showMessage(!1, '网络请求失败，请重试');
      }
    }

    addTopNav () {
      this.topNav = this.game.add.group(this.mainSpritebatch, 'topNav');
      this.topKeyArr = [
        'shopIcon.png',
        'shareIcon.png'
      ];
      for (let key of this.topKeyArr) {
        let btn = new SimpleButton(this.game, Config.GAME_WIDTH - 110, 0, 'manorIcon', key);
        btn.anchor.set(0.5);
        this.topNav.add(btn);
      }
      this.topNav.children[0].y = 120;
      this.topNav.children[1].y = this.topNav.children[0].y + 180;
      this.topNav.children[0].callback.add(() => {
        this.shopGp.visible = !0;
        this.game.add.tween(this.shopGp.scale).to({
          x: 1,
          y: 1
        }, 300, Phaser.Easing.Back.Out, !0);
      });
      this.topNav.children[1].callback.add(() => {
        window.vcom.showMessage(!0, '敬请期待！');
      });
    }

    addAvatorInfo () {
      this.avatorGp = this.game.add.group(this.mainSpritebatch, 'avatorGp');
      this.avatorGp.position.set(100, 120);
      this.infoFrame = this.game.add.graphics(0, 0 ,this.avatorGp);
      this.infoFrame.beginFill('0xa9eafd');
      this.infoFrame.drawRoundedRect(0, -42, 270, 84, 42);
      this.infoFrame.endFill();
      this.avatorFrame = this.game.add.graphics(0, 0, this.avatorGp);
      this.avatorFrame.beginFill('0x7ecef4');
      this.avatorFrame.drawCircle(0, 0, 110);
      this.avatorFrame.endFill();
      this.avatorBorder = this.game.add.graphics(0, 0, this.avatorGp);
      this.avatorBorder.beginFill('0xffffff');
      this.avatorBorder.drawCircle(0, 0, 100);
      this.avatorBorder.endFill();
      this.avator = this.game.add.image(0, 0, 'avator', null, this.avatorGp);
      this.avator.anchor.set(0.5);
      this.avator.width = 110;
      this.avator.height = 110;
      this.avator.mask = this.avatorBorder;
      this.avator.inputEnabled = !0;
      this.avator.events.onInputDown.add(() => {
        Phaser.vue.$router.push({
          path: 'uc'
        });
        this.game.time.events.add(100, () => {
          document.querySelector('#manor').style.display = 'none';
        });
      });
      let nameStyle = {
        font: '24px 微软雅黑',
        fill: '#000000',
        fontWeight: 'Bold'
      };

      let infoStyle = {
        font: '18px 微软雅黑',
        fill: '#000000'
      };

      let infoText = '已连续登陆 ' + this.signDay + ' 天';

      this.nameText = this.game.add.text(0, 0, this.username, nameStyle, this.avatorGp);
      this.infoText = this.game.add.text(0, 0, infoText, infoStyle, this.avatorGp);
      this.nameText.position.set(75, -28);
      this.infoText.position.set(75, 6);
      this.infoText.addFontWeight('Bold', 5);
      this.infoText.addFontWeight('normal', infoText.length - 1);
    }

    addShopModal () {
      this.shopGp = this.game.add.group(this.mainSpritebatch, 'shopGp');
      this.shopModal = this.game.add.image(0, 0, 'manorUi', 'shopBg.png', this.shopGp);
      this.shopModal.anchor.set(0.5);
      let titleStyle = {
        font: '42px',
        fill: '#ffffff',
        fontWeight: 'bold',
        stroke : '#b33600',
        strokeThickness: '10'
      };
      this.shopTitle = this.game.add.text(0, -308, '囧囧狗商店', titleStyle, this.shopGp);
      this.shopTitle.anchor.set(0.5);
      this.shopMask = this.game.add.graphics(0, 0, this.shopGp);
      this.shopMask.beginFill('#000000');
      this.shopMask.drawRect(-345, -260, 690, 620);
      this.shopMask.endFill();
      this.shopMask.inputEnabled = !0;
      this.shopTip = this.game.add.group(this.shopGp, 'shopTip');
      this.shopTip.position.set(-212, 150);
      this.tipWrap = this.game.add.graphics(0, 0, this.shopTip);
      this.tipWrap.lineStyle(4, '0xd5b37a', 1);
      this.tipWrap.beginFill('0xfdedd4');
      this.tipWrap.drawRoundedRect(0, 0, 424, 60, 28);
      this.tipWrap.endFill();
      let tipStyle = {
        font: '25px',
        fill: '#7a4404',
        fontWeight: 'bold'
      };
      this.tipText = this.game.add.text(0, 32, '当前可用积分 :         ' + this.currentScore, tipStyle, this.shopTip);
      this.tipText.x = this.tipWrap.width * 0.5;
      this.tipText.anchor.set(0.5);
      this.tipCoin = this.game.add.image(0, 0, 'manorIcon', 'coinIcon.png', this.shopTip);
      this.tipCoin.anchor.set(0.5);
      this.tipCoin.position.set(this.tipText.x + 56, 30);
      this.buyBtn = new SimpleButton(this.game, 0, 0, 'manorIcon', 'buyBtn.png');
      this.shopGp.add(this.buyBtn);
      this.buyBtn.anchor.set(0.5);
      this.buyBtn.y = this.shopModal.height * 0.5 - this.buyBtn.height * 0.9;
      this.closeBtn = new SimpleButton(this.game, this.shopModal.width * 0.5 + 4, 0, 'manorIcon', 'closeIcon.png');
      this.shopGp.add(this.closeBtn);
      this.closeBtn.y = -this.shopModal.height * 0.5 + this.closeBtn.height * 0.8;
      this.closeBtn.anchor.set(1);
      this.closeBtn.callback.add(() => {
        this.game.add.tween(this.shopGp.scale).to({
          x: 0,
          y: 0
        }, 300, Phaser.Easing.Back.In, !0).onComplete.add(() => {
          this.shopGp.visible = !1;
        });
      });
      this.shopGp.visible = !1;
      this.shopGp.scale.set(0);
    }

  // 注册input的onDown和onUp事件
  initInput () {
    this.shopMask.events.onInputDown.add(this.onInputDown, this);
    this.shopMask.events.onInputUp.add(this.onInputUp, this);
  }

  initItemData () {
      this.itemKeyData = [
        {
          key: 'foodIcon.png',
          value: this.foodPrice
        },
        {
          key: 'cupIcon.png',
          value: this.waterPrice
        }
      ];
      this.addItems();
      this.buyBtn.callback.add(() => {
        let goods = {
          food: this.items[0].num,
          water: this.items[1].num
        };
        if (this.items[0].num || this.items[1].num) {
          this.buyProps(goods);
        } else {
          window.vcom.showMessage(!1, '请选择道具！');
        }
      });
  }

  async buyProps (goods) {
      let resp = await buyDogsProp(goods);
      let flag = !1;
      if (resp.data.code === '1') {
        this.items[0].num = 0;
        this.items[1].num = 0;
        this.items[0].numText.setText(this.items[0].num);
        this.items[1].numText.setText(this.items[1].num);
        flag = !0;
        window.vcom.$store.state.ucInfo.myscore = resp.data.data.score;
        this.tipText.setText('当前可用积分 :         ' + resp.data.data.score);
      }
      window.vcom.showMessage(flag, resp.data.msg);
  }

  addItems () {
    this.items = [];
    this.itemsGroup = this.game.add.group(this.shopGp, 'itemsGp');
    this.itemsGroup.position.y = -50;
    this.itemsGroup.position.x = 0;
    this.itemsGroup.mask = this.shopMask;
    let originX = 0;
    for (let key of this.itemKeyData) {
      let item = new menuPanel(this.game, 'manorIcon', key.key, key.value);
      item.position.set(originX, 0);
      this.itemsGroup.add(item);
      this.items.push(item);
      originX += 345;
    }
    this.items[0].frame.frameName = 'activeItemPanel.png';
    // 设定左右滚动的边界
    this.limitLeftX = (this.items.length - 1) * 345 * -1 - 172;
    this.limitRightX = 172;
    return this.items;
  }


  onInputDown () {
    this.inputDown = !0;
    this.wasDragged = !1;
    this.updateView = !0;
    this.startDragX = this.itemsGroup.position.x;
    this.picturesIndex = Math.abs(Math.round(this.itemsGroup.position.x / 344));
    this.picturesIndex = Phaser.Math.clamp(this.picturesIndex, 0, this.items.length - 1);
  }

  onInputUp () {
    if (this.inputDown) {
      this.inputDown = !1;
      this.wasDragged === !1 && this.clickedPicture && this.onClickPicture(this.clickedPicture);
      this.onDragStop();
    }
  }

  // 根据point的当前x和落点x定位图片组
  dragItems () {
    let point = this.game.input.activePointer;
    let distance = (point.x - point.positionDown.x) / Config.WORLD_SCALE * 1.66;
    let disY = point.y - point.positionDown.y;
    let newX = this.startDragX + distance;
    newX = Phaser.Math.clamp(newX, this.limitLeftX, this.limitRightX);
    !1 === this.wasDragged && (Math.abs(distance) > 0 || Math.abs(disY)) && (this.wasDragged = !0);
    this.itemsGroup.position.x = newX;
  }

  // 滑动停止事件
  onDragStop () {
    let currentIndex = Math.abs(Math.round((this.itemsGroup.position.x) / 345));
    let currentX = -currentIndex * 345;
    for (let item of this.items) {
      item.frame.frameName = 'itemPanel.png';
    }
    this.items[currentIndex].frame.frameName = 'activeItemPanel.png';
    this.game.add.tween(this.itemsGroup.position).to({
      x: currentX
    }, 400, Phaser.Easing.Cubic.Out, !0).onComplete.addOnce(() => {
      this.inputDown || (this.updateView = !1);
    });
  }

  updatePicturesView () {
    for (let p of this.items) {
      let currentX = this.itemsGroup.position.x + p.x;
      let currentD = -currentX;
      let currentD_ABS = Math.abs(-currentX);
      if (currentD_ABS > 445) {
        p.visible = !1;
      } else {
        p.visible = !0;
        let scale = 1.2 - currentD_ABS / (645);
        p.scale.set(scale);
        p.position.y = currentD_ABS / (345 + 300) * 150;
        p.angle = currentD / (345 + 300) * 40 * -1;
      }
    }
  }

    showActionWrap () {
        if (!this.alive) {
          return;
        }
        this.actionBox = this.game.add.group(this.world, 'actionGp');
        this.actionBox.position.set(Config.HALF_GAME_WIDTH, Config.HALF_GAME_HEIGHT);
        this.touch = new TouchAction(this.game);
        if (this.touchDelayTime) {
          this.bottomNav.children[0].inputEnabled = !1;
          this.touch.timebar.visible = !0;
          this.touch.timeText.visible = !0;
          this.touch.bootTime(this.touchDelayTime);
        } else {
          this.touch.timebar.visible = !1;
          this.touch.timeText.visible = !1;
        }
        this.actionBox.add(this.touch);
        this.drinking = new DrinkingAction(this.game);
        this.eating = new EatingAction(this.game);
    }

    showAlive () {
      if (!this.alive) {
        this.rebornBtn = new SimpleButton(this.game, 0, 0, 'restart');
        this.world.add(this.rebornBtn);
        this.rebornBtn.callback.add(()=> {
          this.rebornDogs();
        });
      }
    }

    async rebornDogs () {
      try {
        let resp = await rebornDogs();
        if (resp.data.code === '1') {
          this.rebornBtn.destroy();
          this.newDog = this.game.add.image(0, 0, 'newDog', null, this.world);
          this.newDog.anchor.set(0.5);
          this.newDog.scale.set(0.1);
          this.newDog.alpha = 0.2;
          this.newDog.position.set(Config.HALF_GAME_WIDTH - 100, Config.HALF_GAME_HEIGHT);
          this.game.add.tween(this.newDog.scale).to({
            x: 0.6,
            y: 0.6
          }, 2000, Phaser.Easing.Bounce.out, !0, 0);
          this.game.add.tween(this.newDog).to({
            x: Config.HALF_GAME_WIDTH + 100
          }, 500, Phaser.Easing.Cubic.out, !0, 0, 1, !0);
          this.game.add.tween(this.newDog).to({
            alpha: 1,
            y: Config.HALF_GAME_HEIGHT + 200
          }, 2000, Phaser.Easing.Sinusoidal.out, !0, 0).onComplete.addOnce(() => {
            this.newDog.x = Config.HALF_GAME_WIDTH;
            this.game.add.tween(this.newDog).to({
              alpha: 0
            }, 500, Phaser.Easing.Cubic.out, !0, 0).onComplete.addOnce(() => {
              this.alive = !0;
              this.deploy();
            });
          });
        } else if (resp.data.code === 'dog_is_alive') {
          window.vcom.showMessage(!1, '囧囧还在哟!');
        } else {
          window.vcom.showMessage(!1, '积分不足，先去做任务吧！');
        }
      } catch (e) {
        window.vcom.showMessage(!1, '网络连接错误，请重试！');
      }
    }

    // 刷新事件
    update () {
        this.inputDown && this.dragItems();
        this.updateView && this.updatePicturesView();
        this.alive && window.DragonBones.PhaserFactory.factory.dragonBones.advanceTime(-1.0);
    }

    // 重置背景尺寸
    resizeBackground () {
        this.gameBg.width = Config.GAME_WIDTH + 1;
        this.gameBg.height = Config.GAME_HEIGHT + 1;
    }

    resizeShopModal () {
      this.shopGp.position.set(Config.HALF_GAME_WIDTH, Config.HALF_GAME_HEIGHT);
    }

    resizeReborn () {
      this.rebornBtn && this.rebornBtn.position.set(Config.HALF_GAME_WIDTH, Config.HALF_GAME_HEIGHT);
    }

    resize () {
        this.resizeBackground();
        this.resizeShopModal();
        this.resizeReborn();
    }

    shutdown () {
        this.pictures = null;
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

export default mainMenu;
