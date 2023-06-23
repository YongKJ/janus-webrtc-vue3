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
    },
    {
        path: '/webrtc',
        name: 'webrtc',
        meta: {
            title: 'Webrtc Peer Test'
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/WebrtcPeerTest.vue')
    },
    {
        path: '/audio',
        name: 'audio',
        meta: {
            title: 'Janus Audio Test'
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/JanusAudioTest.vue')
    },
    {
        path: '/janus',
        name: 'janus',
        meta: {
            title: 'Janus Webrtc Test'
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/JanusWebrtcTest.vue')
    },
    {
        path: '/stream',
        name: 'stream',
        meta: {
            title: 'Janus Stream Test'
        },
        component: () => import(/* webpackChunkName: "about" */ '@/views/JanusStreamTest.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
