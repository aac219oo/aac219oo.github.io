import { ref, toRef, onMounted, onUnmounted } from 'vue';

export const THEMES = ['orange', 'green', 'blue', 'red'];

export const HeaderTemplate = /* html */ `
    <header>
        <router-link to="/" title="回首頁" class="JHlogo">
            <svg version="1.1" class="w-[80px] fill-current text-primary-500" id="圖層_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 262 262" style="enable-background:new 0 0 262 262;" xml:space="preserve">
            <path d="M131,0C58.7,0,0,58.6,0,131s58.7,131,131,131s131-58.7,131-131S203.3,0,131,0z M93.7,157.3
                c0,14.2-4,26-12.1,35.2c-8.1,9.3-18.3,13.9-30.7,13.9c-3,0-6.5-0.5-10.4-1.6c-1.4-0.4-2.4-1.7-2.4-3.1v-33.5c0-2,1.9-3.5,3.9-3.2
                c0.6,0.1,1.2,0.1,1.8,0.1c5.5,0,8.2-4.4,8.2-13.2V66.2c0-1.8,1.4-3.2,3.2-3.2h35.2c1.8,0,3.2,1.4,3.2,3.2V157.3z M219.5,199.5
                c0,1.9-1.6,3.5-3.5,3.5h-34.7c-1.9,0-3.5-1.6-3.5-3.5v-46.5c0-1.6-1.3-2.9-2.9-2.9h-13c-1.6,0.3-2.7,1.7-2.7,3.4v46.1
                c0,1.9-1.6,3.5-3.5,3.5H121c-1.9,0-3.5-1.6-3.5-3.5v-133c0-1.9,1.6-3.5,3.5-3.5h34.7c1.9,0,3.5,1.6,3.5,3.5v43.1
                c0,1.9,1.5,3.4,3.4,3.5h12.3c1.7,0,3-1.4,3-3V66.4c0-1.9,1.6-3.5,3.5-3.5H216c1.9,0,3.5,1.6,3.5,3.5V199.5z"/>
            </svg>
        </router-link>
        <button 
            class="menu-toggle" 
            id="menu-toggle" 
            aria-label="切換選單"
            @click="toggleMenu"
        >
            <svg
                width="40"
                height="40"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#000000" d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"/></svg>
        </button>
        
        <nav :class="{ 'show': isMenuOpen }" class="w-full gap-2 mx-2"> 
            <button
                class="menu-toggle menu-close"
                id="menu-close"
                aria-label="關閉選單"
                @click="isMenuOpen = false" 
            >
                <svg
                    width="40"
                    height="40"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>
            </button>
        
            <div class="relative toggle-theme">
                <button 
                    @click="isThemeSelectorOpen = !isThemeSelectorOpen" 
                    class="cursor-pointer flex items-center p-2 rounded"
                >
                    <svg class="w-[30px] fill-current text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 320.9 576 321.8 576 322.7C575.6 359.2 542.4 384 505.9 384L408 384C381.5 384 360 405.5 360 432C360 435.4 360.4 438.7 361 441.9C363.1 452.1 367.5 461.9 371.8 471.8C377.9 485.6 383.9 499.3 383.9 513.8C383.9 545.6 362.3 574.5 330.5 575.8C327 575.9 323.5 576 319.9 576C178.5 576 63.9 461.4 63.9 320C63.9 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320zM192 352C192 334.3 177.7 320 160 320C142.3 320 128 334.3 128 352C128 369.7 142.3 384 160 384C177.7 384 192 369.7 192 352zM192 256C209.7 256 224 241.7 224 224C224 206.3 209.7 192 192 192C174.3 192 160 206.3 160 224C160 241.7 174.3 256 192 256zM352 160C352 142.3 337.7 128 320 128C302.3 128 288 142.3 288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160zM448 256C465.7 256 480 241.7 480 224C480 206.3 465.7 192 448 192C430.3 192 416 206.3 416 224C416 241.7 430.3 256 448 256z"/></svg>
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
                                    'w-6 h-6 rounded-lg cursor-pointer hover:scale-[1.2] transition-transform duration-200 ease-in-out',
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
                                    <svg v-if="currentMode !== 'dark'" class="w-[20px] fill-current text-primary-500" data-name="圖層 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 46"><circle cx="23" cy="23" r="10"/><rect x="21" width="4" height="10" rx="2"/><rect x="21" y="36" width="4" height="10" rx="2"/><rect x="41" y="20" width="4" height="10" rx="2" transform="translate(16 66) rotate(-90)"/><rect x="5" y="20" width="4" height="10" rx="2" transform="translate(-20 30) rotate(-90)"/><rect x="35.7" y="7.3" width="4" height="10" rx="2" transform="translate(53.66 45.66) rotate(-135)"/><rect x="10.3" y="7.3" width="4" height="10" rx="2" transform="translate(-7.09 10.3) rotate(-45)"/><rect x="10.3" y="32.7" width="4" height="10" rx="2" transform="translate(-7.66 71.06) rotate(-135)"/><rect x="35.7" y="32.7" width="4" height="10" rx="2" transform="translate(-17.62 35.7) rotate(-45)"/></svg>
                                    <svg v-else class="w-[20px] fill-current text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C388.8 576 451.3 548.8 497.3 504.6C504.6 497.6 506.7 486.7 502.6 477.5C498.5 468.3 488.9 462.6 478.8 463.4C473.9 463.8 469 464 464 464C362.4 464 280 381.6 280 280C280 207.9 321.5 145.4 382.1 115.2C391.2 110.7 396.4 100.9 395.2 90.8C394 80.7 386.6 72.5 376.7 70.3C358.4 66.2 339.4 64 320 64z"/></svg>
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

    setup(props) {
        const isMenuOpen = ref(false);
        const navLinks = ref([]);
        const isThemeSelectorOpen = ref(false);

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
            console.log(isMenuOpen.value);
        };
        const setThemeColor = (theme) => {
            props.changeColorTheme(theme);
        };
        const getThemeColor = (theme) => {
            const isDark = props.currentMode === 'dark';
            const colors = {
                default: isDark ? '#FFFFFF' : '#000000',
                orange: '#E08958',
                green: '#0DBE33',
                blue: '#6595FF',
                red: '#FF5C5F',
            };
            return colors[theme] || 'gray';
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
            setThemeColor,
            getThemeColor,
            toggleMode: props.toggleMode,
            currentColorTheme: toRef(props, 'currentColorTheme'),
        };
    },

    template: HeaderTemplate,
};

export default Header;
