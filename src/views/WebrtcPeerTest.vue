<template>
  <wallpaper-plus>
    <a-row>
      <a-col :span="6" v-for="(info, index) in webrtcPeerTestService.streams" :key="index">
        <video
            :id="info.rtcDirec"
            autoplay="autoplay"
            class="webrtc-video"
            :style="index === 0 ? 'width: 80%;' : 'width: 60%;'"
        ></video>
        <div v-if="index === 0" style="color: white">本地视频流</div>
        <div v-else style="color: white">发布者: {{ info.rtcDirec }}</div>
      </a-col>
    </a-row>

    <a-row class="container">
      <a-col :span="24">
        <h3 class="title">Webrtc 测试</h3>
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            placeholder="请输入用户ID..."
            v-model:value="webrtcPeerTestService.userId"
            @keyup.enter.native="webrtcPeerTestService.connect()"
        />
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            :disabled="true"
            v-model:value="webrtcPeerTestService.roomId"
        />
      </a-col>
      <a-col :span="24">
        <a-button
            type="primary"
            class="primary-button"
            @click="webrtcPeerTestService.connect()">连接websocket</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            danger
            class="danger-button"
            @click="webrtcPeerTestService.disconnect()">关闭websocket</a-button>
      </a-col>
    </a-row>
  </wallpaper-plus>
</template>

<script lang="ts">
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {defineComponent, getCurrentInstance, ref} from "vue";
import {WebrtcPeerTestService} from "@/common/service/WebrtcPeerTestService";

export default defineComponent({
  name: "WebrtcPeerTest",
  setup() {
    return {
      webrtcPeerTestService: ref(new WebrtcPeerTestService(getCurrentInstance()))
    }
  },
  components: {
    WallpaperPlus
  }
});
</script>

<style scoped>

.webrtc-video {
  height: auto;
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