const Phaser = window.Phaser;
import initGame from '../InitGame/initGame';
import revealLine from './revealLine';
import revealLineParticles from '../Particle/revealLineParticles';

class colorPicture extends Phaser.Group {
    constructor (game, world, config) {
        super(game, world);
        return this._onRevealLineHide = new Phaser.Signal(),
            this.pictureConfig = config,
            this.initRaysOffset(),
            this.addRays(),
            this.addColorPicture(),
            this.addWhitePicture(),
            this.addRevealLine(),
            this.visible = !1,
            this.exists = !1,
            this;
    }

    get onRevealLineHide () {
        return this._onRevealLineHide;
    }

    get colorImage () {
        return this._colorPic;
    }

    // 初始光束位置
    initRaysOffset () {
        this.raysOffset = new Phaser.Point();
    }

    // 添加光束
    addRays () {
        this.backRays = this.game.add.image(this.raysOffset.x, this.raysOffset.y, this.pictureConfig.image.texture, 'Rays0000', this);
        this.backRays.anchor.set(.5);
        this.backRays.scale.set(.9);
        this.backRays.visible = !1;
        this.frontRays = this.game.add.image(this.raysOffset.x, this.raysOffset.y, this.pictureConfig.image.texture, 'Rays0000', this);
        this.frontRays.anchor.set(.5);
        this.frontRays.scale.set(.77);
        this.frontRays.angle = -43;
        this.frontRays.visible = !1;
    }

    // 添加picture
    addColorPicture () {
        let texture = this.pictureConfig.image.texture;
        let keyframe = this.pictureConfig.image.frame;
        this._colorPic = this.game.add.image(0, 0, texture, keyframe, this);
        this._colorPic.x = this._colorPic.width * .5 * -1;
        this._colorPic.y = this._colorPic.height * .5;
    }

    // 添加混合模式picture
    addWhitePicture () {
        this.whitePic = this.game.add.image(0, 0, this._colorPic.key, this._colorPic.frameName, this);
        this.whitePic.blendMode = PIXI.blendModes.ADD;
        this.whitePic.x = this.whitePic.width * -.5;
        this.whitePic.y = this.whitePic.height * -.5;
        this.whitePic.visible = !1;
    }

    // 添加展示线
    addRevealLine () {
        initGame.isWeakDevice || (this.revealLineParticles = new revealLineParticles(this.game, this)),
        this.revealLine = new revealLine(this.game, 'link_the_dots', 'Reveal_Line0000'),
        this.revealLine.x = 0,
        this.revealLine.y = this.whitePic.height * .5,
        this.revealLine.width = 1.2 * this.whitePic.width,
        this.revealLine.visible = !1,
        this.add(this.revealLine);
    }

    onLevelComplete () {
        this.exists = !0;
        this.visible = !0;
        this._colorPic.visible = !0;
        this._colorPic.anchor.set(0, 1);
        this._colorPic.crop(new Phaser.Rectangle(0, this.whitePic.bottom, this.whitePic.width, 0), !1);
        this.revealLine.visible = !0;
        this.revealLine.y = this.whitePic.bottom + 10;
        this.game.add.tween(this.revealLine.scale).from({
            x: 0,
            y: 0
        }, 300, Phaser.Easing.Back.Out, !0).onComplete.addOnce(() => {
            this.game.add.tween(this.revealLine.scale).to({
                x: 0,
                y: 0
            }, 300, Phaser.Easing.Back.In, !0, 1200);

            this.game.add.tween(this.revealLine).to({
                y: this.whitePic.top - 10
            }, 1500, Phaser.Easing.Cubic.Out, !0).onUpdateCallback((tween, progress) => {
                progress < 0.9 && this.emitParticles(), // 缓动进行到90，停止发生粒子
                this._colorPic.cropRect.height = this.whitePic.bottom - this.revealLine.y,
                this._colorPic.cropRect.y = .5 * this.whitePic.height + this.revealLine.y,
                this._colorPic.updateCrop();
            }).onComplete.addOnce(() => {
                this.revealLine.visible = !1;
                this.revealLine.exists = !1;
                this.onLevelCompleteNext();
            });
        });
    }

    onLevelCompleteNext () {
        let angle = 3;
        this._colorPic.anchor.set(.5);
        this._colorPic.position.set(0, 0);
        this.game.add.tween(this._colorPic).to({
            angle: -angle
        }, 50, Phaser.Easing.Linear.None, !0).onComplete.addOnce(() => {
            this.game.add.tween(this._colorPic).to({
                angle: angle
            }, 75, Phaser.Easing.Sinusoidal.InOut, !0, 0, 7, !0);
        });

        this.game.add.tween(this._colorPic.scale).to({
            x: .66,
            y: .66
        }, 1200, Phaser.Easing.Linear.None, !0).onComplete.addOnce(() => {
            this.showRays();
            this.showWhiteFX();
            this.game.add.tween(this._colorPic).to({
                angle: 0
            }, 200, Phaser.Easing.Back.Out, !0);

            this.game.add.tween(this._colorPic.scale).to({
                x: 1.22,
                y: 1.22
            }, 350, Phaser.Easing.Back.Out, !0).onComplete.addOnce(() => {
                this.game.add.tween(this._colorPic.scale).to({
                    x: 1,
                    y: 1
                }, 166, Phaser.Easing.Linear.None, !0).onComplete.addOnce(() => {
                    this.playFinishedAnimation();
                });
            });

        });
    }

    // 发生粒子
    emitParticles () {
        if (this.revealLineParticles) {
            let offset = 10,
                leftBound = this.revealLine.left + offset,
                rightBound = this.revealLine.right - offset;
            this.revealLineParticles.emitParticle(2, leftBound, rightBound, this.revealLine.y);
        }
    }

    // 显示光束动画
    showRays () {
        this.backRays.visible = !0;
        this.frontRays.visible = !0;
        this.backRays.alpha = 0;
        this.frontRays.alpha = 0;
        this.game.add.tween(this.backRays).to({
            alpha: 0.1
        }, 100, Phaser.Easing.Linear.None, !0).onComplete.addOnce(() => {
            this.game.add.tween(this.backRays).to({
                alpha: 0.2
            }, 400, Phaser.Easing.Linear.None, !0, 0, 1e4, !0);
        });
        this.frontRays.angle += 2;
        this.game.add.tween(this.frontRays).to({
            alpha: 0.1
        }, 100, Phaser.Easing.Linear.None, !0).onComplete.addOnce(() => {
           this.game.add.tween(this.frontRays).to({
               angle: this.frontRays.angle - 4
           }, 800, Phaser.Easing.Sinusoidal.InOut, !0, 0, -1, !0);
           this.game.add.tween(this.frontRays).to({
               alpha: 0.66
           }, 800, Phaser.Easing.Linear.None, !0, 0, 1e4, !0);
        });
    }

    // 显示混合模式图片动画
    showWhiteFX (delay) {
        void 0 === delay && (delay = 500);
        this.whitePic.visible = !0;
        this.whitePic.scale.set(0.66);
        this.whitePic.anchor.set(.5);
        this.whitePic.position.set(0, 0);
        this.whitePic.alpha = 0;

        this.game.add.tween(this.whitePic.scale).to({
            x: 1.22,
            y: 1.22
        }, 350, Phaser.Easing.Back.Out, !0).onComplete.addOnce(() => {
            this.game.add.tween(this.whitePic.scale).to({
                x: 1,
                y: 1
            }, 166, Phaser.Easing.Linear.None, !0);
        });

        this.game.add.tween(this.whitePic).to({
            alpha: 1
        }, 60, Phaser.Easing.Linear.None, !0, 100).onComplete.addOnce(() => {
            this.game.add.tween(this.whitePic).to({
                alpha: 0
            }, delay, Phaser.Easing.Cubic.In, !0, 100).onComplete.addOnce(() => {
                this.whitePic.visible = !1;
                this.whitePic.exists = !1;
            })
        })
    }

    // 播放完成动画
    playFinishedAnimation () {
        this.game.add.tween(this._colorPic.scale).to({
            x: 1.05,
            y: 0.97
        }, 500, Phaser.Easing.Sinusoidal.InOut, !0, 0, 1e3, !0);
        this.game.add.tween(this._colorPic).to({
            angle: -2
        }, 1e3, Phaser.Easing.Sinusoidal.InOut, !0, 0, 1e3, !0);
    }
}

export default colorPicture;
