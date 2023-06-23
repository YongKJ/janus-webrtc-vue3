import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: {
            name: "test"
        }
    },
    {
        path: "/test",
        name: "test",
        meta: {
            title: "DemoTest"
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/DemoTest.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
