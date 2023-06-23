<template>
  <wallpaper-plus>
    <a-row>
      <a-col :span="3" >
        <a-row style="margin-top: 16px">
          <a-col :span="12">
            <div class="info-text" v-for="(info, index) in janusAudioTestService.participants" :key="index">
              {{ index === 0 ? "本地音频流" : "参与者：" + info.rtcDirec }}
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="3" v-show="janusAudioTestService.isPlay">
        <audio id="muted" autoplay class="audio-play"></audio>
        <div class="info-text" style="margin-top: 16px">混合音频</div>
      </a-col>
    </a-row>

    <a-row class="container">
      <a-col :span="24">
        <h3 class="title">Audio 测试</h3>
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            placeholder="请输入用户ID..."
            v-model:value="janusAudioTestService.userId"
            @keyup.enter.native="janusAudioTestService.connect()"
        />
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            :disabled="true"
            v-model:value="janusAudioTestService.roomId"
        />
      </a-col>
      <a-col :span="24">
        <a-button
            type="primary"
            class="primary-button"
            @click="janusAudioTestService.connect()">连接websocket</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            danger
            class="danger-button"
            @click="janusAudioTestService.disconnect()">关闭websocket</a-button>
      </a-col>
    </a-row>
  </wallpaper-plus>
</template>

<script lang="ts">
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
import {JanusAudioTestService} from "@/common/service/JanusAudioTestService";

export default defineComponent({
  name: "JanusAudioTest",
  setup() {
    const janusAudioTestService = ref(new JanusAudioTestService(getCurrentInstance()));
    onMounted(() => janusAudioTestService.value.initData());
    return {
      janusAudioTestService
    }
  },
  components: {
    WallpaperPlus
  }
});
</script>

<style scoped>

.audio-play {
  width: 16px;
  height: 16px;
}

.info-text {
  color: white;
}

.danger-button {
  width: 100%;
  color: white;
  background: rgba(45, 45, 45, 0.33);
  border: 1px solid #E74C3C;
  box-shadow: 0 0 25px rgba(236, 112, 99, .5);
  margin-bottom: 25px;
}

.primary-button {
  width: 100%;
  border: none;
  background: #4169E1;
  margin-bottom: 20px;
}

:deep(.ant-input) {
  border-radius: 4px;
}

.input {
  margin-bottom: 20px;
}

.container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 330px;
  padding: 35px 35px 15px 35px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px rgba(155, 89, 182, .5);
  position: relative;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #f3f9f1;
  user-select: none;
  font-size: 32px;
  font-weight: 500;
}

</style>