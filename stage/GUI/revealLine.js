const Phaser = window.Phaser;
class revealLine extends Phaser.Image {
    constructor (game, key, frame) {
        super(game, 0, 0, key, frame);
        return this.anchor.set(.5),
            this;
    }
}

export default revealLine;
