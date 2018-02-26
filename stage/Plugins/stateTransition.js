/**
 * Created by kunnisser on 2017/1/20.
 * 场景stage切换
 */
const Phaser = window.Phaser;
 import graphics from '../Util/graphics';
 import config from '../GameConfiger/config';
class stateTransition extends Phaser.Plugin{
    constructor (game) {
        super(game, game.stage);
        let blackRect = graphics.createRectTexture(game, 1, 1, '#000000', 'black_rect');
        this.overlay = this.game.add.image(0, 0, blackRect);
        this.overlay.visible = !1;
        this.overlayDuration = 400;
        game.stage.addChild(this.overlay);
    };

    fillStage () {
        this.overlay.scale.set(config.GAME_WIDTH, config.GAME_HEIGHT);
    }

    changeState (nextLevel, bool) {
        this.fillStage();
        this.overlay.visible = !0;
        this.overlay.alpha = 0;
        this.showLay = this.game.add.tween(this.overlay).to({
            alpha: 1
        }, this.overlayDuration, Phaser.Easing.Cubic.Out, !0);
        this.showLay.onComplete.addOnce(() => {
           this.doChangeState(nextLevel, bool);
        });
    }

    doChangeState (n, b) {
        this.game.state.start(n, !0, !1, {overlay: this.overlay, param: b});
    }
};

export default stateTransition;
