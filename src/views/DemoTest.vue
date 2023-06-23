<template>
  <wallpaper-plus>
    <a-button
        type="primary"
        style="z-index: 0"
        @click="demoTestService.test()">
      Primary Button
    </a-button>
  </wallpaper-plus>
</template>

<script lang="ts">
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {DemoTestService} from "@/common/service/DemoTestService";
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";

export default defineComponent({
  name: "Test",
  props: {
    routerName: {
      type: String,
      default: "test"
    }
  },
  setup() {
    return {
      demoTestService: ref(new DemoTestService(getCurrentInstance())),
    }
  },
  components: {
    WallpaperPlus,
  },
});
</script>

<style scoped>

</style>