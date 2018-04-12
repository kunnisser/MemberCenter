const Phaser = window.Phaser;

class eatingAction extends Phaser.Group {
  constructor (game) {
    super(game, null, 'eating');
    this.game = game;
    this.addAction();
    this.addTimeLine();
    return this;
  };

  addAction () {
    window.DragonBones.PhaserFactory.init(this.game);
    const factory = window.DragonBones.PhaserFactory.factory;
    factory.parseDragonBonesData(this.game.cache.getItem('eatingSke', Phaser.Cache.JSON).data);
    factory.parseTextureAtlasData(
      this.game.cache.getItem('eating', Phaser.Cache.JSON).data,
      this.game.cache.getImage('eatingTex', true).base
    );
    this.armatureDisplay = factory.buildArmatureDisplay('eating');
    this.armatureDisplay.x = 0.0;
    this.armatureDisplay.y = 200.0;
    this.addChild(this.armatureDisplay);

    factory.parseDragonBonesData(this.game.cache.getItem('enoughSke', Phaser.Cache.JSON).data);
    factory.parseTextureAtlasData(
      this.game.cache.getItem('enough', Phaser.Cache.JSON).data,
      this.game.cache.getImage('enoughTex', true).base
    );
    this.armatureDisplay1 = factory.buildArmatureDisplay('Armature');
    this.armatureDisplay1.x = 0.0;
    this.armatureDisplay1.y = 200.0;
    this.addChild(this.armatureDisplay1);
  }

  addTimeLine () {
    this.timebar = this.game.add.graphics(0, 0, this);
    this.timebar.lineStyle(4, '0x3d2202');
    this.timebar.beginFill('0xeb6100');
    this.timebar.drawRoundedRect(-170, -50, 340, 20, 10);
    this.timebar.endFill();

    let timeStyle = {
      font: '28px',
      fill: '#7a4404',
      fontWeight: 'bold',
      stroke : '#ffffff',
      strokeThickness: '20'
    }
    this.timeText = this.game.add.text(0, -80, '', timeStyle, this);
    this.timeText.anchor.set(0.5);
  }

  bootTime (time) {
    this.game.time.events.remove(this.loop);
    this.setTime(time);
    this.loop = this.game.time.events.loop(1000, () => {
      if (time <= 1000) {
        this.game.time.events.remove(this.loop);
        this.timebar.visible = !1;
        this.timeText.visible = !1;
        this.armatureDisplay1.visible = !1;
        this.armatureDisplay.visible = !0;
        this.game.state.getCurrentState().eatingDelayTime = 0;
        this.game.state.getCurrentState().bottomNav.children[1].inputEnabled = !0;
      }
      time = time - 1000;
      this.setTime(time);
    }, this);
  }

  setTime (time) {
    let timehour = parseInt(time / 3.6e6);
    this.timehour = timehour > 9 ? timehour : '0' + timehour;
    let timeminute = parseInt((time % 3.6e6) / 6e4);
    this.timeminute = timeminute > 9 ? timeminute : '0' + timeminute;
    let timesecond = parseInt((time % 6e4) / 1000);
    this.timesecond = timesecond > 9 ? timesecond : '0' + timesecond;
    this.timeFm = this.timehour + ':' + this.timeminute + ':' + this.timesecond;
    this.timeText.setText('距离下次喂食还需' + this.timeFm);
  }

}

export default eatingAction;
