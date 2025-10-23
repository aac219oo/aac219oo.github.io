import { createApp, ref, computed, watchEffect, onMounted } from 'vue';
import { createI18n } from 'vue-i18n';
import router from './router/router.js';

import Animation from './pages/animation.js';
import Header from './layout/header.js';
import Footer from './layout/footer.js';

const DEFAULT_LOCALE = 'zh-Hant';
const FALLBACK_LOCALE = 'en';

async function loadLanguageMessages(locale) {
    const response = await fetch(`./assets/i18n/${locale}.json`);
    if (!response.ok) {
        console.error(`Failed to load language file for ${locale}`);
        return {};
    }
    return await response.json();
}

function updateThemeLinks(theme) {
    const lightLink = document.getElementById('theme-light');
    const darkLink = document.getElementById('theme-dark');
    const body = document.body;

    if (theme === 'dark') {
        if (lightLink) lightLink.disabled = true;
        if (darkLink) darkLink.disabled = false;
        body.classList.add('dark');
    } else {
        if (lightLink) lightLink.disabled = false;
        if (darkLink) darkLink.disabled = true;
        body.classList.remove('dark');
    }
}

function handleScrollEffect() {
    const header = document.querySelector("header");
    if (!header) return;

    const onScroll = () => {
        if (window.pageYOffset > 0) {
            header.classList.add("active");
        } else {
            header.classList.remove("active");
        }
    };

    // 立即執行一次，檢查初始位置
    onScroll();

    // 監聽滾動事件
    window.addEventListener("scroll", onScroll);
}

async function bootstrapApp() {

    const initialMessages = {};
    initialMessages[DEFAULT_LOCALE] = await loadLanguageMessages(DEFAULT_LOCALE);
    initialMessages[FALLBACK_LOCALE] = await loadLanguageMessages(FALLBACK_LOCALE);
    const i18n = createI18n({ legacy: false, locale: DEFAULT_LOCALE, fallbackLocale: FALLBACK_LOCALE, messages: initialMessages });

    watchEffect(() => {
        const titleKey = router.currentRoute.value.meta.titleKey;

        if (titleKey) {
            document.title = i18n.global.t(titleKey, { pipe: "|" });
        } else {
            document.title = 'Blog | James Hsu';
        }
    });

    const App = {
        components: {
            'app-animation': Animation,
            'app-header': Header,
            'app-footer': Footer
        },
        setup() {
            const currentTheme = ref('light');
            const locale = i18n.global.locale;
            const animationHasPlayed = ref(false);

            const onAnimationFinished = () => {
                animationHasPlayed.value = true;
            };

            const shouldShowAnimation = computed(() => {
                return router.currentRoute.value.name === 'Home' && !animationHasPlayed.value;
            });

            const toggleTheme = () => {
                const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
                currentTheme.value = newTheme;
                updateThemeLinks(newTheme);
            };

            const changeLocale = async (event) => {
                const newLocale = event.target.value;
                if (!i18n.global.messages.value[newLocale]) {
                    const newMessages = await loadLanguageMessages(newLocale);
                    i18n.global.setLocaleMessage(newLocale, newMessages);
                }
                locale.value = newLocale;
            };

            onMounted(() => {
                const mask = document.querySelector('.mask');
                if (mask) {
                    mask.style.display = 'none';
                }
            });

            return {
                currentTheme,
                toggleTheme,
                changeLocale,
                i18n,
                shouldShowAnimation,
                onAnimationFinished,
            };
        },

        mounted() {
            updateThemeLinks(this.currentTheme);
            handleScrollEffect();
        },

        template: `
                <Transition>
                    <app-animation 
                        v-if="shouldShowAnimation" 
                        @animation-finished="onAnimationFinished" 
                    />
                </Transition>
                <app-header 
                    :currentTheme="currentTheme" 
                    :toggleTheme="toggleTheme"
                    :changeLocale="changeLocale"
                    :i18n="i18n"
                />
                <main class="px-4 md:px-8 my-[120px] justify-center">
                        <router-view />
                </main>
                <app-footer 
                    :currentTheme="currentTheme"
                    :i18n="i18n"
                />
        `,
    };

    createApp(App)
        .use(i18n)
        .use(router)
        .mount('#app');
}

bootstrapApp();
