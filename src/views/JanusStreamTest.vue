<template>
  <wallpaper-plus>
    <a-row>
      <a-col :span="6" v-for="(item, index) in janusStreamTestService.streams" :key="index">
        <video
            :id="item.rtcDirec"
            autoplay="autoplay"
            :style="index === 0 ? 'width: 80%;' : 'width: 90%;'"
        ></video>
        <a-row>
          <a-col :span="12">
            <div style="color: white">发起方向: {{ item.rtcDirec }}</div>
          </a-col>
          <a-col :span="12">
            <div v-if="index !== 0" class="bitrate">{{ item.bitrate.value }}</div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-row class="container">
      <a-col :span="24">
        <h3 class="title">Stream 测试</h3>
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            placeholder="请输入用户ID..."
            v-model:value="janusStreamTestService.userId"
            @keyup.enter.native="janusStreamTestService.connect()"
        />
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            :disabled="true"
            v-model:value="janusStreamTestService.roomId"
        />
      </a-col>
      <a-col :span="24">
        <a-button
            type="primary"
            class="primary-button"
            @click="janusStreamTestService.connect()">连接websocket</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            danger
            class="danger-button"
            @click="janusStreamTestService.disconnect()">关闭websocket</a-button>
      </a-col>
    </a-row>
  </wallpaper-plus>
</template>

<script>
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {defineComponent, getCurrentInstance, onMounted, ref} from "vue";
import {JanusStreamTestService} from "@/common/service/JanusStreamTestService";

export default defineComponent({
  name: "JanusStreamTest",
  setup() {
    const janusStreamTestService = ref(new JanusStreamTestService(getCurrentInstance()));
    onMounted(() => janusStreamTestService.value.initData());
    return {
      janusStreamTestService
    }
  },
  components: {
    WallpaperPlus
  }
});
</script>

<style scoped>

.bitrate {
  color: white;
  float: right;
  margin-right: 25px;
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