const Phaser = window.Phaser;
class revealLineParticles extends Phaser.Group{
    constructor (game, parent) {
        super(game, parent);
        this.game = game;
        this.parent = parent;
        this.addParticles();
        this.getParticle();
    }

    // 批量创建粒子
    addParticles () {
        this.createMultiple(50, 'link_the_dots', 'Star_Particle0000');
    }

    // 生成粒子
    emitParticle (num, leftBound, rightBound, y) {
        for (let i = 0; i < num; i++) {
            let currentPtc = this.getParticle();
            currentPtc.x = this.game.rnd.realInRange(leftBound, rightBound);
            currentPtc.y = y;
            currentPtc.exists = !0;
            currentPtc.scale.set(this.game.rnd.realInRange(0.5, 0.8));
            currentPtc.alpha = 1;
            currentPtc.angle = this.game.rnd.realInRange(0, 180);
            this.tweenParticle(currentPtc);
        }
    }

    // 粒子动画
    tweenParticle (cptc) {
        let duration = this.game.rnd.realInRange(2e3, 2500), //随机补间时间
            direct = Phaser.Utils.randomChoice(1, -1), // 方向
            angle = this.game.rnd.realInRange(50, 80), // 旋转区间
            deepY = this.game.rnd.realInRange(90, 120); // 下落区间
        this.game.add.tween(cptc).to({
            y: '' + deepY,
            angle: '' + direct + angle
        }, duration, Phaser.Easing.Linear.None, !0);
        this.game.add.tween(cptc.scale).to({
            x: 0.1,
            y: 0.1
        }, duration, Phaser.Easing.Cubic.Out, !0);
        this.game.add.tween(cptc).to({
            alpha: 0
        }, duration, Phaser.Easing.Cubic.Out, !0).onComplete.addOnce(() => {
           cptc.exists = !1;
        });
    }

    getParticle () {
        let particle = this.getFirstExists(!1);
        return particle || this.create(0, 0, 'link_the_dots', 'Star_Particle0000');
    }

    destroy () {
        this.game = null;
        this.parent = null;
        this.children = null;
    }
}

export default revealLineParticles;
