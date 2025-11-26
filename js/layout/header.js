import { ref, toRef, onMounted, onUnmounted } from 'vue';
import AppIcon from '/js/components/AppIcon.js';

export const THEME_COLORS = {
    orange: '#E08958',
    green: '#0DBE33',
    blue: '#6595FF',
    red: '#FF5C5F',
};
export const THEMES = Object.keys(THEME_COLORS);

export const HeaderTemplate = /* html */ `
    <header>
        <router-link to="/" title="回首頁" class="JHlogo">
            <app-icon name="logo" class="w-[80px] text-primary-500" />
        </router-link>
        <button 
            class="menu-toggle" 
            id="menu-toggle" 
            aria-label="切換選單"
            @click="toggleMenu"
        >
            <app-icon name="menu" width="40" height="40" class="fill-black" />
        </button>
        
        <nav :class="{ 'show': isMenuOpen }" class="w-full gap-2 mx-2"> 
            <button
                class="menu-toggle menu-close"
                id="menu-close"
                aria-label="關閉選單"
                @click="isMenuOpen = false" 
            >
                <app-icon name="close" width="40" height="40" />
            </button>
        
            <div class="relative toggle-theme">
                <button 
                    @click="isThemeSelectorOpen = !isThemeSelectorOpen" 
                    class="cursor-pointer flex items-center p-2 rounded"
                >
                    <app-icon name="palette" class="w-[30px] text-primary-500" />
                </button>
                
                <div v-if="isThemeSelectorOpen" class="theme-selector-popover">
                    
                    <div class="theme-section">
                        <div class="flex gap-[10px]">
                            <span class="w-max">{{ $t('theme.color_theme') }}</span>
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
                    </div>
                    
                    <hr class="my-3 border-gray-200 dark:border-gray-700"/>

                    <div class="theme-section flex items-center gap-[10px]">
                        <span class="w-max">{{ $t('theme.theme_mode') }}</span>
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
                                :class="{'bg-primary-500': currentMode === 'dark', 'bg-gray-400': currentMode === 'light'}"
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
            
            <button>
                <svg class="w-[30px] fill-current text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M192 64C209.7 64 224 78.3 224 96L224 128L352 128C369.7 128 384 142.3 384 160C384 177.7 369.7 192 352 192L342.4 192L334 215.1C317.6 260.3 292.9 301.6 261.8 337.1C276 345.9 290.8 353.7 306.2 360.6L356.6 383L418.8 243C423.9 231.4 435.4 224 448 224C460.6 224 472.1 231.4 477.2 243L605.2 531C612.4 547.2 605.1 566.1 589 573.2C572.9 580.3 553.9 573.1 546.8 557L526.8 512L369.3 512L349.3 557C342.1 573.2 323.2 580.4 307.1 573.2C291 566 283.7 547.1 290.9 531L330.7 441.5L280.3 419.1C257.3 408.9 235.3 396.7 214.5 382.7C193.2 399.9 169.9 414.9 145 427.4L110.3 444.6C94.5 452.5 75.3 446.1 67.4 430.3C59.5 414.5 65.9 395.3 81.7 387.4L116.2 370.1C132.5 361.9 148 352.4 162.6 341.8C148.8 329.1 135.8 315.4 123.7 300.9L113.6 288.7C102.3 275.1 104.1 254.9 117.7 243.6C131.3 232.3 151.5 234.1 162.8 247.7L173 259.9C184.5 273.8 197.1 286.7 210.4 298.6C237.9 268.2 259.6 232.5 273.9 193.2L274.4 192L64.1 192C46.3 192 32 177.7 32 160C32 142.3 46.3 128 64 128L160 128L160 96C160 78.3 174.3 64 192 64zM448 334.8L397.7 448L498.3 448L448 334.8z"/></svg>
            </button>
            <select @change="changeLocale" class="mr-auto">
                <option
                    value="zh-Hant"
                    :selected="$i18n.locale === 'zh-Hant'"
                >
                    中文
                </option>
                <option value="en" :selected="$i18n.locale === 'en'">
                    English
                </option>
            </select>
        
            <ul>
                <li 
                    v-for="link in navLinks" 
                    :key="link.path"
                    @click="isMenuOpen = false"
                >
                    <router-link :to="link.path">
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
    ],
    components: {
        'app-icon': AppIcon,
    },
    setup(props) {
        const isMenuOpen = ref(false);
        const navLinks = ref([]);
        const isThemeSelectorOpen = ref(false);

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };
        const setThemeColor = (theme) => {
            props.changeColorTheme(theme);
        };
        const getThemeColor = (theme) => {
            return THEME_COLORS[theme] || 'gray';
        };
        const handleClickOutside = (event) => {
            const toggleButton = document.getElementById('menu-toggle');
            const navElement = document.querySelector('header nav');
            const themeContainer = document.querySelector('.toggle-theme');

            if (
                isMenuOpen.value &&
                navElement &&
                !navElement.contains(event.target) &&
                toggleButton &&
                !toggleButton.contains(event.target)
            ) {
                isMenuOpen.value = false;
            }

            if (
                isThemeSelectorOpen.value &&
                themeContainer &&
                !themeContainer.contains(event.target)
            ) {
                isThemeSelectorOpen.value = false;
            }
        };

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
            document.addEventListener('click', handleClickOutside);
            loadheader();
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            isMenuOpen,
            toggleMenu,
            navLinks,
            isThemeSelectorOpen,
            THEMES,
            THEME_COLORS,
            setThemeColor,
            getThemeColor,
            toggleMode: props.toggleMode,
            currentColorTheme: toRef(props, 'currentColorTheme'),
        };
    },

    template: HeaderTemplate,
};

export default Header;
