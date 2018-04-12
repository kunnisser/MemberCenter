/**
 * Created by kunnisser on 2017/1/20.
 * 绘制图形
 * */
const Phaser = window.Phaser;
class graphics {
    constructor () {};
    // 方形纹理
    static createRectTexture (game, width, height, color, key) {
        void 0 === color && (color = '#000000');
        let rgbColor = Phaser.Color.hexToColor(color);
        let bmt = game.add.bitmapData(width, height, key, !!key);
        bmt.fill(rgbColor.r, rgbColor.g, rgbColor.b);
        return bmt;
    };
    // 圆形纹理
    static createCircleTexture (game, radius, color, key) {
        void 0 === color && (color = '#000000');
        let bmt = game.add.bitmapData(2 * radius, 2 * radius, key, !!key);
        bmt.circle(radius, radius, radius, color);
        return bmt;
    }
}

export default graphics;
