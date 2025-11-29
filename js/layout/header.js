import { ref, toRef, onMounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import gsap from 'gsap';
import AppIcon from '/js/components/AppIcon.js';
import { useClickOutside } from '/js/composables/useClickOutside.js';

export const THEME_COLORS = {
    orange: '#E08958',
    green: '#0DBE33',
    blue: '#6595FF',
    red: '#FF5C5F',
};
export const THEMES = Object.keys(THEME_COLORS);
export const LANGUAGES = [
    { name: '中文', value: 'zh-Hant' },
    { name: 'English', value: 'en' },
];

export const HeaderTemplate = /* html */ `
    <header class="fixed w-full top-0 left-0 z-999 px-[2rem] py-[0.8rem] border-(--color-primary) border-b-[1px] border-solid bg-(--color-light-bg) text-(--color-light-text) dark:bg-(--color-dark-bg) dark:text-(--color-dark-text)">
        <router-link to="/" title="James Hsu 首頁" class="w-[70px] hover:text-primary transition-all duration-500 origin-left ease-in-out">
            <app-icon name="logo"/>
        </router-link>
        <button 
            ref="menuBtnRef"
            class="menu-toggle hover:text-primary" 
            id="menu-toggle" 
            aria-label="切換選單"
            @click="toggleMenu"
        >
            <app-icon name="menu" width="40" height="40" class="fill-black" />
        </button>
        
        <nav ref="navRef" :class="{ 'show': isMenuOpen }" class="w-full gap-2 mx-2"> 
            <button
                class="menu-toggle menu-close"
                id="menu-close"
                aria-label="關閉選單"
                @click="isMenuOpen = false" 
            >
                <app-icon name="close" width="40" height="40" />
            </button>
        
            <div ref="themeContainerRef" class="relative">
                <button 
                    ref="themeBtnRef"
                    @click="isThemeSelectorOpen = !isThemeSelectorOpen" 
                    class="cursor-pointer flex items-center p-2 rounded hover:text-primary"
                >
                    <app-icon name="palette" class="w-[30px] text-primary-500" />
                </button>
                
                <div v-if="isThemeSelectorOpen" class="theme-selector-popover bg-[#fff] text-(--color-light-text) dark:bg-[#434343] dark:text-(--color-dark-text)">
                    <div class="theme-section flex gap-[10px]">
                        <span class="w-max dark:text-(--color-dark-text)">{{ $t('theme.color_theme') }}</span>
                        <button 
                            v-for="theme in THEMES" 
                            :key="theme" 
                            @click="setThemeColor(theme)"
                            :class="[
                                'color-theme w-6 h-6 rounded-lg cursor-pointer hover:scale-[1.2] transition-transform duration-200 ease-in-out',
                                'theme-' + theme,
                                currentColorTheme === theme ? 'scale-[1.2]' : ''
                            ]"
                            :style="{ backgroundColor: getThemeColor(theme) }"
                            :aria-label="$t('theme.' + theme)"
                        ></button>
                    </div>
                    
                    <hr class="my-3 border-gray-200 dark:border-white-700"/>

                    <div class="theme-section flex items-center gap-[10px]">
                        <span class="w-max dark:text-(--color-dark-text)">{{ $t('theme.theme_mode') }}</span>
                        <div 
                            class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                        >
                            <input 
                                type="checkbox" 
                                name="toggle" 
                                id="darkModeToggle" 
                                :checked="currentMode === 'dark'" 
                                @change="toggleMode"
                                class="sr-only toggle-checkbox"
                            />
                            
                            <label 
                                for="darkModeToggle" 
                                class="toggle-label block w-[50px] h-[27px] rounded-full bg-gray-400 cursor-pointer"
                                :class="{'bg-gray-400': currentMode === 'dark', 'bg-sky-400': currentMode === 'light'}"
                            >
                                <div 
                                    class="absolute top-[50%] left-1 -translate-y-1/2 w-5 h-5 transition-transform duration-300 ease-in-out fill-current text-yellow-500"
                                    :class="currentMode === 'dark' ? 'translate-x-6' : 'translate-x-0'"
                                >
                                    <app-icon 
                                        v-if="currentMode !== 'dark'" 
                                        name="sun" 
                                        class="w-[20px] text-orange-200" 
                                    />
                                    <app-icon 
                                        v-else 
                                        name="moon" 
                                        class="w-[20px] text-indigo-500" 
                                    />
                                </div>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
            
            <div ref="langContainerRef" class="relative hidden">
                <button
                    ref="langBtnRef"
                    @click="isLangSelectorOpen = !isLangSelectorOpen" 
                    class="cursor-pointer flex items-center p-2 rounded hover:text-primary"
                >
                    <app-icon name="language" class="w-[30px] text-primary-500" />
                </button>
                <div v-if="isLangSelectorOpen" class="theme-selector-popover bg-[#fff] text-(--color-light-text) dark:bg-[#434343] dark:text-(--color-dark-text)">
                    <div class="flex flex-col gap-[10px]">
                        <button 
                            v-for="lang in LANGUAGES" 
                            :key="lang.value" 
                            @click="setLocale(lang.value)"
                            class="text-left px-2 py-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:text-primary"
                            :class="{ 'text-primary-500 font-bold': i18n.global.locale.value === lang.value }"
                        >
                            {{ lang.name }}
                        </button>
                    </div>
                </div>
            </div>
        
            <ul class="ml-auto relative flex" @mouseleave="handleMouseLeave">
                <li 
                    v-for="link in navLinks" 
                    :key="link.path"
                    :ref="(el) => { if(el) linkRefs[link.path] = el }"
                    @click="isMenuOpen = false"
                    @mouseenter="handleMouseEnter(link.path)"
                >
                    <router-link :to="link.path" class="hover:text-primary">
                        {{ $t(link.i18nKey) }}
                    </router-link>
                </li>
                <span 
                    ref="markerRef"
                    class="absolute -bottom-[15px] -translate-x-1/2 h-0 w-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-(--color-primary) opacity-0 pointer-events-none"
                    aria-hidden="true"
                ></span>
            </ul>
        </nav>
    </header>
`;

const Header = {
    props: [
        'currentMode',
        'toggleMode',
        'currentColorTheme',
        'changeColorTheme',
        'changeLocale',
        'i18n',
        'isHeaderActive',
        'isHeaderHidden',
    ],
    components: {
        'app-icon': AppIcon,
    },
    setup(props) {
        const route = useRoute();
        const isMenuOpen = ref(false);
        const navLinks = ref([]);
        const isThemeSelectorOpen = ref(false);
        const isLangSelectorOpen = ref(false);
        const menuBtnRef = ref(null);
        const navRef = ref(null);

        const themeBtnRef = ref(null);
        const themeContainerRef = ref(null);

        const langBtnRef = ref(null);
        const langContainerRef = ref(null);
        const linkRefs = ref({});
        const markerRef = ref(null);

        const updateMarker = (path) => {
            // 1. Try to find an exact match first
            let el = linkRefs.value[path];

            // 2. If no exact match, try to find a parent path (active state logic)
            // This handles cases like /HW/123 -> matching /HW
            if (!el) {
                // Sort keys by length descending to match longest prefix first
                // e.g. Match '/blog/tech' before '/blog' before '/'
                const keys = Object.keys(linkRefs.value).sort(
                    (a, b) => b.length - a.length
                );

                for (const key of keys) {
                    // Check if current path starts with the key
                    // And ensure it's a valid path segment boundary
                    if (path.startsWith(key)) {
                        // Valid boundaries:
                        // 1. key is root '/'
                        // 2. key ends with '/' (unlikely in nav links usually)
                        // 3. path has '/' right after key length (e.g. /HW/123 matches /HW)
                        // This prevents /HW2 matching /HW
                        if (key === '/' || path.charAt(key.length) === '/') {
                            el = linkRefs.value[key];
                            break; // Found the longest match
                        }
                    }
                }
            }

            if (el && markerRef.value) {
                // Calculate center: offsetLeft + half width - half triangle width (6px)
                const center = el.offsetLeft + el.offsetWidth / 2;

                gsap.to(markerRef.value, {
                    x: center,
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out', // You can change this to 'back.out(1.7)' for a bouncy effect
                    overwrite: true, // Ensure new animations override old ones immediately
                });
            } else if (markerRef.value) {
                // Hide if no matching link
                gsap.to(markerRef.value, {
                    opacity: 0,
                    duration: 0.2,
                    overwrite: true,
                });
            }
        };

        const handleMouseEnter = (path) => {
            updateMarker(path);
        };

        const handleMouseLeave = () => {
            // Return to current route on mouse leave
            updateMarker(route.path);
        };

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };
        const setThemeColor = (theme) => {
            props.changeColorTheme(theme);
        };
        const getThemeColor = (theme) => {
            return THEME_COLORS[theme] || 'gray';
        };
        const setLocale = (langValue) => {
            props.changeLocale({ target: { value: langValue } });
        };

        useClickOutside(
            navRef,
            () => {
                if (isMenuOpen.value) isMenuOpen.value = false;
            },
            menuBtnRef
        );

        useClickOutside(
            themeContainerRef,
            () => {
                if (isThemeSelectorOpen.value)
                    isThemeSelectorOpen.value = false;
            },
            themeBtnRef
        );

        useClickOutside(
            langContainerRef,
            () => {
                if (isLangSelectorOpen.value) isLangSelectorOpen.value = false;
            },
            langBtnRef
        );

        const loadheader = async () => {
            try {
                const response = await fetch('/assets/data/header.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                navLinks.value = data.navLinks;

                nextTick(() => {
                    updateMarker(route.path);
                });
            } catch (error) {
                console.error('Failed to load navigation links:', error);
            }
        };

        watch(
            () => props.isHeaderHidden,
            (newVal) => {
                if (newVal) {
                    isThemeSelectorOpen.value = false;
                    isLangSelectorOpen.value = false;
                }
            }
        );

        watch(
            () => route.path,
            (newPath) => {
                nextTick(() => {
                    updateMarker(newPath);
                });
            }
        );

        watch(
            () => props.i18n.global.locale.value, // Specifically watch the value
            async (newVal) => {
                // console.log('Locale changed to:', newVal);
                // 1. Wait for the DOM to update (text length changes)
                await nextTick(); 
                // 2. Recalculate based on current route, not newPath (which is undefined here)
                updateMarker(route.path);
            }
        );

        onMounted(() => {
            loadheader();
            window.addEventListener('resize', () => {
                // Use gsap.set for instant resize updates instead of animating
                const el = linkRefs.value[route.path];
                if (el && markerRef.value) {
                    const center = el.offsetLeft + el.offsetWidth / 2;
                    gsap.set(markerRef.value, { x: center });
                }
            });
        });

        return {
            isMenuOpen,
            toggleMenu,
            navLinks,
            isThemeSelectorOpen,
            isLangSelectorOpen,
            THEMES,
            THEME_COLORS,
            LANGUAGES,
            setThemeColor,
            getThemeColor,
            setLocale,
            toggleMode: props.toggleMode,
            currentColorTheme: toRef(props, 'currentColorTheme'),
            i18n: props.i18n,
            menuBtnRef,
            navRef,
            themeBtnRef,
            themeContainerRef,
            langBtnRef,
            langContainerRef,
            isHeaderActive: toRef(props, 'isHeaderActive'),
            isHeaderHidden: toRef(props, 'isHeaderHidden'),
            linkRefs,
            markerRef, // Changed from markerStyle
            handleMouseEnter,
            handleMouseLeave,
        };
    },

    template: HeaderTemplate,
};

export default Header;
