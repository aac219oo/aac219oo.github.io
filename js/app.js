import {
    createApp,
    ref,
    computed,
    watchEffect,
    onMounted,
    onUnmounted,
} from 'vue';
import { createI18n } from 'vue-i18n';
import router from './router/router.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Animation from './components/animation.js';
import Header, { THEMES } from './layout/header.js';
import Footer from './layout/footer.js';
import ProgressBar from './components/ProgressBar.js';

gsap.registerPlugin(ScrollTrigger);
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
    const html = document.documentElement;

    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

function updateColorTheme(themeName) {
    const body = document.body;

    THEMES.forEach((t) => {
        body.classList.remove(`theme-${t}`);
    });

    body.classList.add(`theme-${themeName}`);
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
            const headerRef = ref(null);
            const isHeaderHidden = ref(false);
            const isHeaderActive = ref(false);

            let ctx;

            const initScrollTrigger = () => {
                ctx = gsap.context(() => {
                    const showHeaderAnim = gsap
                        .from(headerRef.value.$el, {
                            yPercent: -100,
                            duration: 0.4,
                            ease: 'power2.out',
                            paused: true,
                        })
                        .progress(1);
                    ScrollTrigger.create({
                        start: 'top top',
                        end: 99999,
                        onUpdate: (self) => {
                            const scrollTop = self.scroll();
                            const direction = self.direction;
                            if (scrollTop <= 0) {
                                showHeaderAnim.play();
                                isHeaderActive.value = false;
                            } else if (direction === 1) {
                                showHeaderAnim.reverse();
                                isHeaderActive.value = false;
                            } else if (direction === -1) {
                                showHeaderAnim.play();
                                isHeaderActive.value = true;
                            }
                        },
                    });
                });
            };

            const headerClasses = computed(() => {
                return {
                    'fixed w-full top-0 z-50 px-[2rem]': true,
                    ' py-[0.2rem] backdrop-blur-sm shadow-[-6px_-6px_16px_var(--color-primary)]':
                        isHeaderActive.value,
                    'py-[0.8rem] shadow-none': !isHeaderActive.value,
                };
            });

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

            onMounted(() => {
                updateThemeLinks(currentMode.value);
                updateColorTheme(currentColorTheme.value);
                initScrollTrigger();
            });

            onUnmounted(() => {
                ctx && ctx.revert();
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
                headerRef,
                isHeaderActive,
                headerClasses,
            };
        },

        template: /* html */ `
                <app-progress-bar ref="progressBarRef" />
                <Transition>
                    <app-animation 
                        v-if="shouldShowAnimation" 
                        @animation-finished="onAnimationFinished" 
                    />
                </Transition>
                <app-header
                    ref="headerRef"
                    :class="headerClasses"
                    :currentMode="currentMode" 
                    :toggleMode="toggleMode"
                    :currentColorTheme="currentColorTheme"
                    :changeColorTheme="changeColorTheme"
                    :changeLocale="changeLocale"
                    :i18n="i18n"
                    :isHeaderActive="isHeaderActive"
                />
                <main class="flex justify-center items-center w-full">
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
