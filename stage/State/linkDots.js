import initGame from '../InitGame/initGame';
import config from '../GameConfiger/config';
import colorPicture from '../GUI/colorPicture';
const Phaser = window.Phaser;
class linkDots extends Phaser.State {
    constructor () {
        super();
    }

    init (key) {
        this.overlay = key.overlay;
        this.pictureConfig = initGame.picturesConfig.getPictureConfig(key.param);
        this.addBackground();
        this.addPictures();
        this.test();
        this.resize();
        this.hideOverlay();
    }

    create () {

    }

    test () {
        this.grp = this.game.add.group(0, 0, this.world);
        for (let i = 0, j = 20; i < j; i++) {
            this.txt = this.game.add.text(0, i * 30, '123123132');
            this.grp.addChild(this.txt);
        }
        this.mask = this.game.add.graphics(0, 0, this.world);
        this.mask.beginFill(0xff0000).drawRect(0, 0, 200, 200);
        this.grp.mask = this.mask;
        this.mask.inputEnabled = !0;
        this.mask.events.onInputDown.add(() => {
            this.tapflag = !0;
            this.startDragY = this.grp.position.y;
        });
        this.mask.events.onInputUp.add(() => {
            if (this.tapflag) {
                this.tapflag = !1;
                this.dragStop();
            }
        });
        this.world.bringToTop(this.mask);
    }

    update () {
        this.tapflag && this.scroll();
    }

    dragStop () {
        this.grp.position.y > 0 && this.game.add.tween(this.grp).to({
            y: 0
        }, 400, Phaser.Easing.Cubic.Out, !0);
        this.grp.position.y < -480 && this.game.add.tween(this.grp).to({
            y: -480
        }, 400, Phaser.Easing.Cubic.Out, !0);
    }

    scroll () {
        let point = this.game.input.activePointer;
        let distanceY = (point.y - point.positionDown.y) / config.WORLD_SCALE * 1.66;
        let NewY = this.startDragY + distanceY;
        NewY = Phaser.Math.clamp(NewY, -500, 20);
        this.grp.position.y = NewY;
    }

    addBackground () {
        this.background = this.game.add.image(0, 0, 'backgrounds_1', 'BG_10000', this.world);
        this.backitem = this.game.add.image(0, 0, 'backgrounds_1', '_Items0000', this.world);
        this.backitem.anchor.set(.5);
        this.vignet = this.game.add.image(0, 0, 'backgrounds_1', '_Vignette0000', this.world);
        this.vignet.anchor.set(.5);
    }

    // 添加图片
    addPictures () {
        this.addColorPicture();
        this.addPlainPicture();
        this.world.bringToTop(this.colorPic); // 将colorPic组置顶
    }

    // 添加彩色物体
    addColorPicture () {
        this.colorPic = new colorPicture(this.game, this.world, this.pictureConfig);
        this.colorPic.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
    }

    //添加单色物体
    addPlainPicture () {
        let index = this.world.getIndex(this.colorPic);
        this.plainPic = this.game.add.image(0, 0, this.getPlainTexture());
        this.plainPic.position.set(config.HALF_GAME_WIDTH - .5 * this.plainPic.width, config.HALF_GAME_HEIGHT -.5 * this.plainPic.height);
        this.game.world.addAt(this.plainPic, index);
        this.colorPic.onLevelComplete();
        this.onPlainPictureHide();
    }

    onPlainPictureHide () {
        this.game.add.tween(this.plainPic).to({
            alpha: 0
        }, 2300, Phaser.Easing.Linear.None, !0).onComplete.addOnce(() => {
            this.plainPic.visible = !1;
            this.plainPic.exists = !1;
        });
    }

    // 获取单色纹理
    getPlainTexture () {
        // 定义单色的frame
        let plainKey = '__plain_' + this.pictureConfig.image.frame;
        let plainTexture = null;
        // 内存中获取texture
        if (this.cache.checkBitmapDataKey(plainKey)) {
            plainTexture = this.cache.getBitmapData(plainKey);
        } else {
            // 内存中没有则通过插件生成一个texture
            let plugin = this.game.plugins.plugins[1];
            plainTexture = plugin.makeColorTexture(this.colorPic.colorImage, this.pictureConfig.pictureColor);
            this.cache.addBitmapData(plainKey, plainTexture); // 添加进内存
        }
        return plainTexture;
    }

    backgroundResize () {
        this.background.width = config.GAME_WIDTH + 1;
        this.background.height = config.GAME_HEIGHT + 1;
        this.backitem.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.backitem.width = 0.9 * config.GAME_WIDTH;
        this.backitem.height = 0.9 * config.GAME_HEIGHT;
        this.vignet.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.vignet.width = 1.4 * config.GAME_WIDTH;
        this.vignet.height = 1.4 * config.GAME_HEIGHT;
    }

    resize () {
        this.backgroundResize();
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

export default linkDots;
