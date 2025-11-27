import { createRouter, createWebHashHistory } from 'vue-router';

// 路由規則陣列
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/home.js'),
        meta: {
            titleKey: 'pageTitle.home'
        }
    },
    {
        path: '/About',
        name: 'About',
        component: () => import('../pages/about.js'),
        meta: {
            titleKey: 'pageTitle.about'
        }
    },
    {
        path: '/HW',
        name: 'HW',
        component: () => import('../pages/homework.js'),
        meta: {
            titleKey: 'pageTitle.hw'
        }
    },
    {
        path: '/HW/html.cafe',
        name: 'HW/html.cafe',
        component: () => import('../pages/HW/html.cafe/html.cafe.js'),
        meta: {
            titleKey: 'pageTitle.hwhtmlcafe02'
        }
    },
    {
        path: '/HW/html.cafe/02',
        name: 'HW/html.cafe/02',
        component: () => import('../pages/HW/html.cafe/02.js'),
        meta: {
            titleKey: 'pageTitle.hwhtmlcafe02'
        }
    },
    {
        path: '/HW/html.cafe/03',
        name: 'HW/html.cafe/03',
        component: () => import('../pages/HW/html.cafe/03.js'),
        meta: {
            titleKey: 'pageTitle.hwhtmlcafe03'
        }
    },
    {
        path: '/HW/html.cafe/04',
        name: 'HW/html.cafe/04',
        component: () => import('../pages/HW/html.cafe/04.js'),
        meta: {
            titleKey: 'pageTitle.hwhtmlcafe04'
        }
    },
    {
        path: '/HW/html.cafe/05',
        name: 'HW/html.cafe/05',
        component: () => import('../pages/HW/html.cafe/05.js'),
        meta: {
            titleKey: 'pageTitle.hwhtmlcafe05'
        }
    },
    {
        path: '/HW/100218340',
        name: 'HW/100218340',
        component: () => import('../pages/HW/100218340.js'),
        meta: {
            titleKey: 'pageTitle.hw100218340'
        }
    },
    {
        path: '/HW/100218340/p24',
        name: 'HW/100218340/p24',
        component: () => import('../pages/HW/100218340/p24.js'),
        meta: {
            titleKey: 'pageTitle.hwp24'
        }
    },
    {
        path: '/HW/100218340/p27',
        name: 'HW/100218340/p27',
        component: () => import('../pages/HW/100218340/p27.js'),
        meta: {
            titleKey: 'pageTitle.hwp27'
        }
    },
    {
        path: '/HW/100218340/p28',
        name: 'HW/100218340/p28',
        component: () => import('../pages/HW/100218340/p28.js'),
        meta: {
            titleKey: 'pageTitle.hwp28'
        }
    },
    {
        path: '/HW/100218476',
        name: 'HW/100218476',
        component: () => import('../pages/HW/100218476.js'),
        meta: {
            titleKey: 'pageTitle.hw100218476'
        }
    },
    {
        path: '/HW/100219151',
        name: 'HW/100219151',
        component: () => import('../pages/HW/100219151.js'),
        meta: {
            titleKey: 'pageTitle.hw100219151.index'
        }
    },
    {
        path: '/HW/100219151/chatGPT',
        name: 'HW/100219151/chatGPT',
        component: () => import('../pages/HW/100219151/chatGPT.js'),
        meta: {
            titleKey: 'pageTitle.hw100219151.chatgpt'
        }
    },
    {
        path: '/HW/100219151/gemini',
        name: 'HW/100219151/gemini',
        component: () => import('../pages/HW/100219151/gemini.js'),
        meta: {
            titleKey: 'pageTitle.hw100219151.gemini'
        }
    },
    {
        path: '/HW/100219151/grok',
        name: 'HW/100219151/grok',
        component: () => import('../pages/HW/100219151/grok.js'),
        meta: {
            titleKey: 'pageTitle.hw100219151.grok'
        }
    },
    {
        path: '/HW/100219151/perplexity',
        name: 'HW/100219151/perplexity',
        component: () => import('../pages/HW/100219151/perplexity.js'),
        meta: {
            titleKey: 'pageTitle.hw100219151.perplexity'
        }
    },
    {
        path: '/HW/100219359',
        name: 'HW/100219359',
        component: () => import('../pages/HW/100219359.js'),
        meta: {
            titleKey: 'pageTitle.hw100219359'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../pages/error.js'),
        meta: {
            titleKey: 'pageTitle.fallback'
        }
    }
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
    }
});

export default router;