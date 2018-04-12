import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import routes from 'view/boot/router/getRoute';
import state from 'view/boot/store/stateBus';
import device from 'current-device';

Vue.use(VueRouter);
Vue.use(Vuex);

const docEl = document.documentElement;
const metaEl = docEl.querySelector('meta[name = "viewport"]');
let dpr, rem, scale;
let deviceWidth = docEl.clientWidth;
dpr = window.devicePixelRatio || 1;
device.desktop() && deviceWidth >= 540 && (deviceWidth = 540);
dpr === 1.5 && (dpr = 1); // 兼容低端安卓机型缩放的问题
scale = 1 / dpr;
rem = device.desktop() ? 54 : deviceWidth * dpr / 10;
docEl.setAttribute('data-dpr', dpr);
metaEl.setAttribute('content', 'initial-scale = ' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable = no');
let resizeRem = device.desktop() ? 54 : deviceWidth * dpr / 10;
docEl.style.fontSize = resizeRem + 'px';

window.onresize = () => {
  // resize后设备宽度会为 deviceWidth * dpr;
  setTimeout(() => {
    let resizeRem = document.documentElement.clientWidth / 10;
    docEl.style.fontSize = resizeRem + 'px';
  }, 100);
};

window.rem2px = function (v) {
  v = parseFloat(v);
  return v * rem;
};

window.px2rem = function (v) {
  v = parseFloat(v);
  return v / rem;
};

/*
* vue-router basic setting
* */
const router = new VueRouter({
  routes
});

/*init store*/

const store = new Vuex.Store(state);

window.CurrentVue = new Vue({
  router,
  store
}).$mount('#app');

