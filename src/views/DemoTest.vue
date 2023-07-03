<template>
  <wallpaper-plus>
    <a-button
        type="primary"
        style="z-index: 0"
        @click="demoTestService.test()">
      Primary Button
    </a-button>

    <a-row class="container">
      <a-col :span="24">
        <h3 class="title">Demo 测试</h3>
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            placeholder="请输入邮箱地址或用户名..."
            v-model:value="demoTestService.userName"
            @keyup.enter.native="demoTestService.connect()"
        />
      </a-col>
      <a-col :span="24">
        <a-input
            class="input"
            type="password"
            placeholder="请输入密码..."
            v-model:value="demoTestService.password"
        />
      </a-col>
      <a-col :span="24">
        <a-button
            type="primary"
            class="primary-button"
            @click="demoTestService.connect()">连接websocket</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            type="primary"
            class="primary-button"
            @click="demoTestService.disconnect()">关闭websocket</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            type="primary"
            class="primary-button"
            @click="demoTestService.login()">登录</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            danger
            class="blue-button"
            @click="demoTestService.register()">还没有账号？</a-button>
      </a-col>
      <a-col :span="24">
        <a-button
            danger
            class="danger-button"
            @click="demoTestService.reset()">忘记密码？</a-button>
      </a-col>
    </a-row>
  </wallpaper-plus>
</template>

<script lang="ts">
import WallpaperPlus from "@/components/WallpaperPlus.vue";
import {DemoTestService} from "@/common/service/DemoTestService";
import {defineComponent, getCurrentInstance, ref} from "vue";

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
.blue-button {
  width: 100%;
  color: white;
  border: 1px solid #40E0D0;
  background: rgba(45, 45, 45, 0.33);
  margin-bottom: 25px;
}

.blue-button:hover {
  box-shadow: 0 0 25px rgba(64, 224, 208, .5);
}

.danger-button {
  width: 100%;
  color: white;
  border: 1px solid #E74C3C;
  background: rgba(45, 45, 45, 0.33);
  margin-bottom: 25px;
}

.danger-button:hover {
  box-shadow: 0 0 25px rgba(236, 112, 99, .5);
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