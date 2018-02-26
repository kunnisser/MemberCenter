/**
 * Created by kunnisser on 2017/1/21 0021.
 * 定义普通按钮
 */

class SimpleButton extends Phaser.Image{
    constructor(game, x, y, key, frame) {
        super(game, x, y, key, frame);
        this.callbackDelay = 0;
        this.callbackTimer = 0;
        this.clicked = !1;
        this.disabledInput = !1;
        this._callback = new Phaser.Signal;
        this.anchor.set(.5);
        this.inputEnabled = !0;
        this.events.onInputDown.add(this.onInputDown, this);
        this.game.device.desktop && (this.input.useHandCursor = !0);
    };

    onInputDown() {
        this.inputEnabled && (this.input.enabled = !1,
                this.blendMode = PIXI.blendModes.HARD_LIGHT,
                this.game.add.tween(this.scale).to({
                    x : 1.05,
                    y : .95
                }, 100, Phaser.Easing.Cubic.Out, !0)
                    .onComplete
                    .add(
                        ()=>{
                            this.clicked = !0;
                            this.callbackTimer = 0;
                            this.game.add.tween(this.scale).to({
                                x : 1,
                                y : 1
                            }, 100, Phaser.Easing.Cubic.Out, !0).onComplete.add(
                                ()=>{
                                    this.input.enabled = !0;
                                    this.blendMode = PIXI.blendModes.COLOR;
                                    this._callback.dispatch();
                                }
                            );
                        }
                    )
        );
    };

    setCallbackDelay(t) {
        this.callbackDelay = t;
    };

    destroy() {
        Phaser.Image.prototype.destroy.call(this);
        this._callback.dispose();
        this._callback = null;
    };

    get callback() {
        return this._callback;
    };
}

export default SimpleButton;
