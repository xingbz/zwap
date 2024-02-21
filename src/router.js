import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
    {
        name: 'notFound',
        path: '/:path(.*)+',
        redirect: {
            name: 'dy',
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

export {router};
