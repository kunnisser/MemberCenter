const Phaser = window.Phaser;
class monobg extends Phaser.Plugin {
    constructor (game) {
        super(game);
    }

    makeColorTexture (source, color, cachekey) {
        color === void 0 && (color = '#ffffff');
        let texture = this.makeRectTexture(source.width, source.height, color, cachekey);
        texture.blendDestinationAtop();
        texture.draw(source, 0, 0, source.width, source.height);
        return texture;
    }

    makeRectTexture (width, height, color, cachekey) {
        let isAddCache = !!cachekey;
        let rectTexture = this.game.add.bitmapData(width, height, cachekey, isAddCache);
        rectTexture.rect(0, 0, width, height, color);
        return rectTexture;
    }
}

export default monobg;
