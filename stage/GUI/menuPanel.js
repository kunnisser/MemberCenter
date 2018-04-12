const Phaser = window.Phaser;
import SimpleButton from './SimpleButton';

class menuPanel extends Phaser.Group {
    constructor (game, frame, key, value) {
        super(game, null, 'menuPanel');
        return this._itemframe = frame,
            this._itemkey = key,
            this._price = value,
            this.addFrame(),
            this.addIcon(),
            this.addWidget(),
            this.addPrice(),
            this;
    }

    addFrame () {
      this.frame = this.game.add.image(0, 0, this._itemframe, 'itemPanel.png', this);
      this.frame.anchor.set(.5);
    }

    addIcon () {
        this.icon = this.game.add.image(0, 0, this._itemframe, this._itemkey, this);
        this.icon.y = -this.icon.height * 0.6;
        this.icon.anchor.set(.5);
    }

    addWidget () {
      this.widgetGp = this.game.add.group(this, 'widgetGp');
      this.widgetGp.y = 50;
      this.plate = this.game.add.image(0, 0, this._itemframe, 'plateIcon.png', this.widgetGp);
      this.plate.anchor.set(0.5);
      this.minus = new SimpleButton(this.game, -this.plate.width * 0.5, this.plate.y, this._itemframe, 'minusIcon.png');
      this.plus = new SimpleButton(this.game, this.plate.width * 0.5, this.plate.y, this._itemframe, 'plusIcon.png');
      this.widgetGp.add(this.minus)
      this.widgetGp.add(this.plus);
      this.minus.anchor.set(0.5);
      this.plus.anchor.set(0.5);
      this.num = 0;
      let numStyle = {
        font: '18px',
        fill: '#ffffff',
        stroke : '#000000',
        strokeThickness: '2',
        fontWeight: 'bold'
      };
      this.numText = this.game.add.text(0, 4, this.num, numStyle, this.widgetGp);
      this.numText.anchor.set(0.5);
      this.minus.setCallbackDelay(0);
      this.plus.setCallbackDelay(0);
      this.plus.callback.add(() => {
        this.num++;
        this.numText.setText(this.num);
      });
      this.minus.callback.add(() => {
        this.num <= 0 ? this.num = 0 : this.num--;
        this.numText.setText(this.num);
      })
    }

    addPrice () {
      this.priceGp = this.game.add.group(this, 'priceGp');
      this.priceGp.y = this.widgetGp.y + 54
      this.coin = this.game.add.image(-50, -6, this._itemframe, 'coinIcon.png', this.priceGp);
      this.coin.anchor.set(0.5);
      let priceStyle = {
        font: '18px',
        fill: '#7a4404',
        fontWeight: 'bold'
      };
      this._price = this._price + '积分';
      this.price = this.game.add.text(10, 0, this._price, priceStyle, this.priceGp);
      this.price.anchor.set(0.5);
    }

    showWhiteFx (delay) {
        this.white && (this.white.visible = !0, this.game.add.tween(this.white).from({
            alpha: 0
        }, 66, Phaser.Easing.Linear.None, !0, delay).onComplete.addOnce(() => {
            this.game.add.tween(this.white).to({
                alpha: 0
            }, 600, Phaser.Easing.Cubic.In, !0);
            })
        );
    }
}

export default menuPanel;
