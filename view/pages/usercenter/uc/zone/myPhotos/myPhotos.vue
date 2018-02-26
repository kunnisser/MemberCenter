<template>
    <div class="photo-slider-wrap">
      <swiper ref="mySwiper" :options="swiperOption" :auto="0" :defaultIndex="index" class="swiper-box" v-if="picArr && picArr.length">
        <swiperSlide class="swiper-item" v-for="item in picArr">
          <img :src="item">
        </swiperSlide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
</template>
<script type="text/ecmascript-6">
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import {showPhotos} from 'mock/getMocks';

  export default {
      name: 'myphotos',
      data () {
        return {
          swiperOption: {
            direction: 'vertical',
            slidesPerView: 1,
            spaceBetween: 1,
            mousewheel: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            }
          },
          photoId: '',
          index: 0,
          picArr: []
        };
      },
      created () {
        this.init();
      },
      computed: {
        swiper () {
          return this.$refs.mySwiper.swiper;
        }
      },
      mounted () {
        this.swiper.slideTo(this.index, 10, false);
      },
      methods: {
        init () {
          this.photoId = this.$route.query.id;
          this.index = this.$route.query.index;
          this.pathGp = this.$route.query.pathGp;
          this.getMyphotos();
          this.$store.state.myZoneIndex = 1;
          this.$store.state.zoneIndex = 1;
        },
        getMyphotos () {
          this.picArr = this.pathGp.split(',');
          this.$nextTick(() => {
            this.showPhotos();
          });
        },
        async showPhotos () {
          showPhotos({
            id: this.photoId
          });
        }
      },
      components: {
        swiper,
        swiperSlide
      }
    };
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import '../../../../../assets/stylus/mixin.styl';
  .photo-slider-wrap
    padding px2rem(1)
    width 100%
    height 100%
    .swiper-box
      width 100%
      height 100%;
      margin 0 auto
      .swiper-item
        height: 100%;
        text-align: center;
        font-size: px2rem(24);
        background: rgba(0,0,0,0.8);
        /* Center slide text vertically */
        display flex
        justify-content center
        align-items center
        & img
          display block
          width px2rem(750)
</style>
