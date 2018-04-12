import config from '../GameConfiger/config';
import simpleButton from '../GUI/SimpleButton';

class popModal extends Phaser.Group{
  constructor (game, parent) {
    super(game, parent, 'popUi');
    this.visible = !1;
    this.exists = !1;
    this.game = game;
    this.position.set(0, 0);
    this.createMask();
    this.createModal();
    this.createMes();
  }

  createMask () {
    let bg = this.game.add.graphics(0, 0, this);
    bg.beginFill(0x000000, 0.5);
    bg.drawRect(0, 0, config.GAME_WIDTH, config.GAME_HEIGHT);
    bg.endFill();
    bg.inputEnabled = !0;
    bg.events.onInputDown.add(() => {
      this.visible = !1;
    });
  }

  createModal () {
    this.modal = this.game.add.graphics(config.HALF_GAME_WIDTH - 280, config.HALF_GAME_HEIGHT - 210, this);
    this.modal.beginFill(0xffffff);
    this.modal.drawRoundedRect(0, 0, 560, 420, 20);
    this.modal.endFill();
    let mask = this.game.add.graphics(this.modal.x, this.modal.y, this);
    mask.beginFill(0xffffff);
    mask.drawRoundedRect(0, 0, 560, 420, 20);
    mask.endFill();
    let title = this.game.add.graphics(this.modal.x, this.modal.y, this);
    title.beginFill(0x00a0e9);
    title.drawRect(0, 0, 560, 76);
    title.endFill();
    title.mask = mask;
  }

  createMes () {
    this.MesGp = this.game.add.group(this);
    this.MesGp.visible = !0;
    let avatorBg = this.game.add.graphics(config.HALF_GAME_WIDTH, this.modal.y + 40, this.MesGp);
    avatorBg.beginFill(0xffffff);
    avatorBg.drawCircle(0, 0, 144);
    avatorBg.endFill();
    this.avator = this.game.add.image(0, 0, 'gameUi', '', this.MesGp);
    this.avator.position.set(config.HALF_GAME_WIDTH, this.modal.y + 40);
    this.avator.anchor.set(0.5);
    this.text = this.game.add.text(config.HALF_GAME_WIDTH, this.modal.y + 200, '', {
      font: '42px GrilledCheeseBTNToasted',
      fill: 0x000000
    }, this.MesGp);
    this.text.anchor.set(0.5);
    this.confirmBtn = new simpleButton(this.game, this.text.x, this.text.y, 'gameUi', 'gameBtn.png');
    this.MesGp.add(this.confirmBtn);
    this.confirmBtn.y += this.confirmBtn.height + 40;
    this.confirmText = this.game.add.text(config.HALF_GAME_WIDTH, this.confirmBtn.y, '', {
      font: '34px GrilledCheeseBTNToasted',
      fill: '#ffffff',
      fontWeight: 'bold',
      stroke: '#b33600',
      strokeThickness: 8
    }, this.MesGp);
    this.confirmText.anchor.set(0.5);
  }

  makeSuccess () {
    this.avator.frameName = 'happy.png';
    this.text.setText('挑战成功');
    this.confirmText.setText('确定');
    this.confirmBtn.callback.add(() => {
      this.visible = !1;
    })
  }

  makeFail () {
    this.avator.frameName = 'cry.png';
    this.text.setText('挑战失败');
    this.confirmText.setText('再来一次');
    return this.confirmBtn.callback;
  }

}

export default popModal;
