import { createRouter, createWebHashHistory, RouterView } from 'vue-router';
import { h } from 'vue';

// 路由規則陣列
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/home.js'),
        meta: {
            titleKey: 'pageTitle.home',
        },
    },
    {
        path: '/About',
        name: 'About',
        component: () => import('../pages/about.js'),
        meta: {
            titleKey: 'pageTitle.about',
        },
    },
    {
        path: '/Projects',
        name: 'Projects',
        component: { render: () => h(RouterView) },
        meta: {
            titleKey: 'pageTitle.projects',
        },
        children: [
            {
                path: '',
                name: '',
                component: () => import('../pages/projects.js'),
            },
            {
                path: ':id',
                name: 'project_detail',
                component: () => import('../pages/projectDetail.js'),
                meta: { title: 'pageTitle.projects' },
            },
        ],
    },
    {
        path: '/HW',
        name: 'HW',
        component: { render: () => h(RouterView) },
        meta: { titleKey: 'pageTitle.hw' },
        children: [
            {
                path: '',
                name: '',
                component: () => import('../pages/homework.js'),
            },
            {
                path: 'html.cafe',
                name: 'htmlcafe',
                component: { render: () => h(RouterView) },
                meta: { titleKey: 'pageTitle.hwhtmlcafe' },
                children: [
                    {
                        path: '',
                        name: '',
                        component: () =>
                            import('../pages/HW/html.cafe/html.cafe.js'),
                    },
                    {
                        path: '02',
                        name: 'htmlcafe02',
                        component: () => import('../pages/HW/html.cafe/02.js'),
                        meta: { titleKey: 'pageTitle.hwhtmlcafe02' },
                    },
                    {
                        path: '03',
                        name: 'htmlcafe03',
                        component: () => import('../pages/HW/html.cafe/03.js'),
                        meta: { titleKey: 'pageTitle.hwhtmlcafe03' },
                    },
                    {
                        path: '04',
                        name: 'htmlcafe04',
                        component: () => import('../pages/HW/html.cafe/04.js'),
                        meta: { titleKey: 'pageTitle.hwhtmlcafe04' },
                    },
                    {
                        path: '05',
                        name: 'htmlcafe05',
                        component: () => import('../pages/HW/html.cafe/05.js'),
                        meta: { titleKey: 'pageTitle.hwhtmlcafe05' },
                    },
                ],
            },
            {
                path: '100218340',
                name: '100218340',
                component: { render: () => h(RouterView) },
                meta: { titleKey: 'pageTitle.100218340' },
                children: [
                    {
                        path: '',
                        name: '',
                        component: () => import('../pages/HW/100218340.js'),
                    },
                    {
                        path: 'p24',
                        name: '100218340p24',
                        component: () => import('../pages/HW/100218340/p24.js'),
                        meta: { titleKey: 'pageTitle.100218340p24' },
                    },
                    {
                        path: 'p27',
                        name: '100218340p27',
                        component: () => import('../pages/HW/100218340/p27.js'),
                        meta: { titleKey: 'pageTitle.100218340p27' },
                    },
                    {
                        path: 'p28',
                        name: '100218340p28',
                        component: () => import('../pages/HW/100218340/p28.js'),
                        meta: { titleKey: 'pageTitle.100218340p28' },
                    },
                ],
            },
            {
                path: '100218476',
                name: '100218476',
                component: () => import('../pages/HW/100218476.js'),
                meta: { titleKey: 'pageTitle.100218476' },
            },
            {
                path: '100219151',
                name: '100219151',
                component: { render: () => h(RouterView) },
                meta: { titleKey: 'pageTitle.100219151' },
                children: [
                    {
                        path: '',
                        name: '',
                        component: () => import('../pages/HW/100219151.js'),
                    },
                    {
                        path: 'chatGPT',
                        name: '100219151_chatGPT',
                        component: () =>
                            import('../pages/HW/100219151/chatGPT.js'),
                        meta: { titleKey: 'pageTitle.100219151_chatGPT' },
                    },
                    {
                        path: 'gemini',
                        name: '100219151_gemini',
                        component: () =>
                            import('../pages/HW/100219151/gemini.js'),
                        meta: { titleKey: 'pageTitle.100219151_gemini' },
                    },
                    {
                        path: 'grok',
                        name: '100219151_grok',
                        component: () =>
                            import('../pages/HW/100219151/grok.js'),
                        meta: { titleKey: 'pageTitle.100219151_grok' },
                    },
                    {
                        path: 'perplexity',
                        name: '100219151_perplexity',
                        component: () =>
                            import('../pages/HW/100219151/perplexity.js'),
                        meta: { titleKey: 'pageTitle.100219151_perplexity' },
                    },
                ],
            },
            {
                path: '100219359',
                name: '100219359',
                component: () => import('../pages/HW/100219359.js'),
                meta: { titleKey: 'pageTitle.hw100219359' },
            },
            {
                path: '100220208',
                name: '100220208',
                component: () => import('../pages/HW/100220208.js'),
                meta: { titleKey: 'pageTitle.hw100220208' },
            },
            {
                path: '100220477',
                name: '100220477',
                component: { render: () => h(RouterView) },
                meta: { titleKey: 'pageTitle.hw100220477' },
                children: [
                    {
                        path: '',
                        name: '',
                        component: () => import('../pages/HW/100220477.js'),
                    },
                    {
                        path: 'panorama',
                        name: '100220477_panorama',
                        component: () =>
                            import('../pages/HW/100220477/panorama.js'),
                        meta: { titleKey: 'pageTitle.100220477_panorama' },
                    },
                    {
                        path: 'googleEarthStudio',
                        name: '100220477_googleEarthStudio',
                        component: () =>
                            import(
                                '../pages/HW/100220477/googleEarthStudio.js'
                            ),
                        meta: {
                            titleKey: 'pageTitle.100220477_googleEarthStudio',
                        },
                    },
                ],
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/error.js'),
        meta: {
            titleKey: 'pageTitle.fallback',
        },
    },
];

// 建立並匯出 Router 實例
const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, left: 0 };
        }
    },
});

export default router;
