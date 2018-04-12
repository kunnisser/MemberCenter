<template>
    <div class="slide" ref="slide">
      <div class="slide-group" ref="slideGroup">
        <slot></slot>
      </div>
      <div v-if="showDot" class="dots">
        <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
      </div>
    </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
    export default {
      name: 'swiper',
      data () {
        return {
          currentPageIndex: 0,
          dots: []
        };
      },
      props: {
        loaded: {
          type: Boolean,
          default: false
        },
        loop: {
          type: Boolean,
          default: true
        },
        autoPlay: {
          type: Boolean,
          default: true
        },
        interval: {
          type: Number,
          default: 4000
        },
        showDot: {
          type: Boolean,
          default: true
        },
        click: {
          type: Boolean,
          default: true
        },
        threshold: {
          type: Number,
          default: 0.3
        },
        speed: {
          type: Number,
          default: 400
        }
      },
      mounted () {
        window.addEventListener('resize', () => {
          if (!this.slide || !this.slide.enabled || !this.$refs.slideGroup) {
            return;
          };
          this.freshTimer && clearTimeout(this.freshTimer);
          this.freshTimer = setTimeout(() => {
            if (this.slide.isInTransition) {
              this._onScrollEnd();
            } else {
              if (this.autoPlay) {
                this._play();
              }
            }
            this.refresh();
          }, 100);
        });
        this.$refs.slideGroup.children.length && this.update();
      },
      methods: {
        update () {
          this.slide && this.slide.destroy();
          this.$nextTick(() => {
            this.init();
          });
        },
        init () {
          this.timer && clearTimeout(this.timer);
          this.currentPageIndex = 0;
          this._setSlideWidth();
          this._initSlide();
          this.autoPlay && this._play();
        },
        refresh () {
          this._setSlideWidth(true);
          this.slide.refresh();
        },
        _setSlideWidth (isResize) {
          let _child = this.$refs.slideGroup.children;
          let width = 0;
          let slideWidth = this.$refs.slide.clientWidth;
          let l = _child.length;
            for (let i = 0; i < l; i++) {
              width += slideWidth;
            };
          this.loop && !isResize && (width += 2 * slideWidth);
          this.$refs.slideGroup.style.width = width + 'px';
        },
        _initSlide () {
          this.slide = new BScroll(this.$refs.slide, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
              loop: this.loop,
              threshold: this.threshold,
              speed: this.speed
            },
            bounce: false,
            stopPropagation: true,
            click: this.click
          });
          this.slide.on('scrollEnd', this._onScrollEnd);
          this.slide.on('touchEnd', () => {
            if (this.autoPlay) {
              this._play();
            }
          });
          this.slide.on('beforeScrollStart', () => {
            if (this.autoPlay) {
              clearTimeout(this.timer);
            }
          });
        },
        _play () {
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.slide.next();
          }, this.interval);
        },
        _onScrollEnd () {
          let pageIndex = this.slide.getCurrentPage().pageX;
          this.currentPageIndex = pageIndex;
          if (this.autoPlay) {
            this._play();
          }
        }
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../assets/stylus/mixin.styl';
  .slide
    width 100%
    overflow hidden
    .slide-group
      display flex
      overflow hidden
      position relative
</style>
