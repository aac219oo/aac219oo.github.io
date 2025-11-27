import { ref, toRef, onMounted, onUnmounted } from 'vue';
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
    <header class="border-(--color-primary) border-b-[1px] border-solid bg-(--color-light-bg) text-(--color-light-text) dark:bg-(--color-dark-bg) dark:text-(--color-dark-text)">
        <router-link to="/" title="James Hsu 首頁" class="hover:text-primary transition-all duration-500 origin-left ease-in-out" :class="isHeaderActive ? 'w-[45px]' : 'w-[80px]'">
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
            
            <div ref="langContainerRef" class="relative">
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
        
            <ul class="ml-auto">
                <li 
                    v-for="link in navLinks" 
                    :key="link.path"
                    @click="isMenuOpen = false"
                >
                    <router-link :to="link.path" class="hover:text-primary">
                        {{ $t(link.i18nKey) }}
                    </router-link>
                </li>
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
    ],
    components: {
        'app-icon': AppIcon,
    },
    setup(props) {
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
            } catch (error) {
                console.error('Failed to load navigation links:', error);
            }
        };

        onMounted(() => {
            loadheader();
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
        };
    },

    template: HeaderTemplate,
};

export default Header;
