import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        name: 'notFound',
        path: '/:path(.*)+',
        redirect: {
            name: 'jsq',
        },
    },
    {
        name: 'dy',
        path: '/dy',
        component: () => import('./view/dy'),
        meta: {
            title: 'dy',
        },
    },
    {
        name: 'jsq',
        path: '/jsq',
        component: () => import('./view/jsq'),
        meta: {
            title: '计算器',
        },
    },
    {
        name: 'caidan',
        path: '/caidan',
        component: () => import('./view/caidan'),
        meta: {
            title: '菜单',
        },
    },
    {
        name: 'weather',
        path: '/weather',
        component: () => import('./view/weather'),
        meta: {
            title: '天气',
        },
    },
    {
        name: 'camera',
        path: '/camera',
        component: () => import('./view/camera'),
        meta: {
            title: '相机',
        },
    }
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});

export { router };
