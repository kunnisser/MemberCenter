/**
 * Created by kunnisser on 2017/8/2.
 * 配置game初始化参数
 */

import config from './config';

const Phaser = window.Phaser;

class configCreator {
    constructor () {};
    static createConfig () {
        let w = config.GAME_WIDTH,
            h = config.GAME_HEIGHT;
        return {
            width: w,
            height: h,
            renderer: Phaser.AUTO,
            parent: document.querySelector('#manor'),
            antialias: !0,
            enableDebug: !0
        };
    };
}

export default configCreator;
