import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "ant-design-vue/dist/antd.less";
import {AntDesign} from "@/common/config/AntDesign";

router.beforeEach((to, from, next) => {
    next();
    // @ts-ignore
    document.title = to.meta.title;
});

createApp(App)
    .use(store)
    .use(router)
    .use(AntDesign)
    .mount('#app')
