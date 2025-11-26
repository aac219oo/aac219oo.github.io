import { createApp, ref, computed, watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import router from './router/router.js';

import Animation from './components/animation.js';
import Header, { THEMES } from './layout/header.js';
import Footer from './layout/footer.js';
import ProgressBar from './components/ProgressBar.js';

const DEFAULT_LOCALE = 'zh-Hant';
const FALLBACK_LOCALE = 'en';

const DEFAULT_THEME = 'orange';

async function loadLanguageMessages(locale) {
    const response = await fetch(`./assets/i18n/${locale}.json`);
    if (!response.ok) {
        console.error(`Failed to load language file for ${locale}`);
        return {};
    }
    return await response.json();
}

function updateThemeLinks(theme) {
    const body = document.body;

    if (theme === 'dark') {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
}

function updateColorTheme(themeName) {
    const body = document.body;

    THEMES.forEach((t) => {
        body.classList.remove(`theme-${t}`);
    });

    body.classList.add(`theme-${themeName}`);
}

function handleScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    const onScroll = () => {
        if (window.pageYOffset > 0) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }
    };

    // 立即執行一次，檢查初始位置
    onScroll();

    // 監聽滾動事件
    window.addEventListener('scroll', onScroll);
}

async function bootstrapApp() {
    const savedLocale = localStorage.getItem('user-locale') || DEFAULT_LOCALE;
    const initialMessages = {};
    initialMessages[DEFAULT_LOCALE] = await loadLanguageMessages(
        DEFAULT_LOCALE
    );
    initialMessages[FALLBACK_LOCALE] = await loadLanguageMessages(
        FALLBACK_LOCALE
    );
    if (savedLocale !== DEFAULT_LOCALE && savedLocale !== FALLBACK_LOCALE) {
        initialMessages[savedLocale] = await loadLanguageMessages(savedLocale);
    }
    const i18n = createI18n({
        legacy: false,
        locale: savedLocale,
        fallbackLocale: FALLBACK_LOCALE,
        messages: initialMessages,
    });

    watchEffect(() => {
        const titleKey = router.currentRoute.value.meta.titleKey;

        if (titleKey) {
            document.title = i18n.global.t(titleKey, { pipe: '|' });
        } else {
            document.title = 'Blog | James Hsu';
        }
    });

    const App = {
        components: {
            'app-animation': Animation,
            'app-header': Header,
            'app-footer': Footer,
            'app-progress-bar': ProgressBar,
        },
        setup() {
            const savedMode = localStorage.getItem('theme-mode');
            const currentMode = ref(savedMode || 'light');
            const savedColorTheme = localStorage.getItem('color-theme');
            const currentColorTheme = ref(savedColorTheme || DEFAULT_THEME);
            const locale = i18n.global.locale;
            const animationHasPlayed = ref(false);
            const mask = document.querySelector('.mask');
            const progressBarRef = ref(null);

            const onAnimationFinished = () => {
                animationHasPlayed.value = true;
                if (animationHasPlayed.value) {
                    mask.classList.add('hidden');
                }
            };

            if (mask) {
                router.isReady().then(() => {
                    if (router.currentRoute.value.name !== 'Home') {
                        mask.classList.add('hidden');
                        animationHasPlayed.value = true;
                    }
                });
            }

            const shouldShowAnimation = computed(() => {
                return (
                    router.currentRoute.value.name === 'Home' &&
                    !animationHasPlayed.value
                );
            });

            const toggleMode = () => {
                const newMode =
                    currentMode.value === 'light' ? 'dark' : 'light';
                currentMode.value = newMode;
                updateThemeLinks(newMode);
                localStorage.setItem('theme-mode', newMode);
            };

            const changeColorTheme = (targetTheme) => {
                currentColorTheme.value = targetTheme;
                updateColorTheme(targetTheme);
                localStorage.setItem('color-theme', targetTheme);
            };

            const changeLocale = async (event) => {
                const newLocale = event.target.value;
                if (!i18n.global.messages.value[newLocale]) {
                    const newMessages = await loadLanguageMessages(newLocale);
                    i18n.global.setLocaleMessage(newLocale, newMessages);
                }
                locale.value = newLocale;
                localStorage.setItem('user-locale', newLocale);
            };

            router.beforeEach((to, from, next) => {
                progressBarRef.value?.start();
                next();
            });

            router.afterEach(() => {
                progressBarRef.value?.finish();
            });

            return {
                currentMode,
                currentColorTheme,
                toggleMode,
                changeColorTheme,
                changeLocale,
                i18n,
                shouldShowAnimation,
                onAnimationFinished,
                progressBarRef,
            };
        },

        mounted() {
            updateThemeLinks(this.currentMode);
            updateColorTheme(this.currentColorTheme);
            handleScrollEffect();
        },

        template: `
                <app-progress-bar ref="progressBarRef" />
                <Transition>
                    <app-animation 
                        v-if="shouldShowAnimation" 
                        @animation-finished="onAnimationFinished" 
                    />
                </Transition>
                <app-header
                    :currentMode="currentMode" 
                    :toggleMode="toggleMode"
                    :currentColorTheme="currentColorTheme"
                    :changeColorTheme="changeColorTheme"
                    :changeLocale="changeLocale"
                    :i18n="i18n"
                />
                <main class="px-4 md:px-8 my-[120px] justify-center">
                    <router-view />
                </main>
                <app-footer
                    :currentMode="currentMode"
                    :currentColorTheme="currentColorTheme"
                    :i18n="i18n"
                />
        `,
    };

    createApp(App).use(i18n).use(router).mount('#app');
}

bootstrapApp();
