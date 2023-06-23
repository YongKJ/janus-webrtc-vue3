<template>
  <div class="main" :style="wallpaperPlusService.getBgImgStyle(bgImg)">
    <custom-scrollbar :style="wallpaperPlusService.getScrollbarHeightStyle()">
      <div :style="wallpaperPlusService.getMainWidthStyle()">
        <div style="position: relative; margin: 0 auto">
          <particles
              id="tsparticles"
              :particlesInit="wallpaperPlusService.particlesInit"
              :particlesLoaded="wallpaperPlusService.particlesLoaded"
              :options="wallpaperPlusService.getParticlesConfig()"/>
          <slot></slot>
        </div>
      </div>
    </custom-scrollbar>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, ref} from "vue";
import {WallpaperPlusService} from "@/common/service/WallpaperPlusService";
import Particles from "@/components/Particles.vue";
import CustomScrollbar from 'custom-vue-scrollbar';
import 'custom-vue-scrollbar/dist/style.css';
import {WallpaperPlusImage} from "@/common/pojo/po/WallpaperPlusImage";

export default defineComponent({
  name: "WallpaperPlus",
  props: {
    speed: {
      type: Number,
      default: 6 // 8
    },
    number: {
      type: Number,
      default: 50 // 100
    },
    linked: {
      type: Boolean,
      default: true // false
    },
    mode: {
      type: String,
      default: "push" // repulse
    },
    bgImg: {
      type: String,
      default: WallpaperPlusImage.BACKGROUND
    }
  },
  setup() {
    return {
      WallpaperPlusImage: WallpaperPlusImage,
      wallpaperPlusService: ref(new WallpaperPlusService(getCurrentInstance()))
    }
  },
  components: {
    Particles,
    CustomScrollbar
  }
});
</script>

<style scoped>
.main {
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  scroll-bar-width: none;
  position: fixed;
  transition: unset;
  overflow: scroll;
  height: 100%;
  width: 100%;
  inset: 0;
}

.main::-webkit-scrollbar {
  display: none;
}
</style>