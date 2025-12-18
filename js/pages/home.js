import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onMounted, ref, onUnmounted, nextTick } from 'vue';
import AppIcon from '/js/components/AppIcon.js';
import { useWaitForImages } from '/js/composables/useWaitForImages.js';
import ContactForm from '/js/components/contactForm.js';
import { CONFIG } from '/js/config.js';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const Home = {
    components: {
        'app-icon': AppIcon,
        'contact-form': ContactForm,
    },
    setup() {
        const containerRef = ref(null);
        const aboutRef = ref(null);
        const projects = ref([]);
        const projectsRef = ref(null);
        const projectTitleRef = ref(null);
        const bubbleRefs = ref([]);
        const bgRef = ref(null);
        const contactSectionRef = ref(null);

        let ctx;
        const handleFormFocus = () => {
            // 取得目標元素
            const target = e.target;

            // 延遲一點點執行，確保鍵盤彈出後的視窗高度已穩定 (選擇性，視效果調整)
            setTimeout(() => {
                // 計算目標元素相對於文件的絕對 Y 座標
                const rect = target.getBoundingClientRect();
                const scrollTop =
                    window.scrollY || document.documentElement.scrollTop;
                const absoluteTop = rect.top + scrollTop;

                // 設定偏移量 (例如 Header 高度 + 一些緩衝)
                // 假設 Header 高度約 80px，多留 20px 緩衝
                const offset = 0;

                // 計算最終捲動位置
                const targetScrollY = absoluteTop - offset;

                // 執行捲動
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth', // 平滑捲動
                });
            }, 100); // [建議] 稍微增加延遲 (100->300ms) 以配合 iOS 鍵盤彈出動畫時間
        };

        const initScrollTrigger = () => {
            if (ctx) ctx.revert();

            ctx = gsap.context(() => {
                gsap.fromTo(
                    containerRef.value,
                    { opacity: 1 },
                    {
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: aboutRef.value,
                            start: 'top bottom',
                            end: 'top 25%',
                            scrub: true,
                        },
                    }
                );

                ScrollTrigger.create({
                    trigger: containerRef.value,
                    start: 'top top',
                    endTrigger: aboutRef.value,
                    end: 'top top',
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                    anticipatePin: 1,
                });

                ScrollTrigger.create({
                    trigger: aboutRef.value,
                    pin: true,
                    start: 'top top',
                    end: 'bottom top',
                    anticipatePin: 1,
                });

                ScrollTrigger.create({
                    trigger: projectsRef.value,
                    pin: projectTitleRef.value,
                    start: 'top -1px',
                    endTrigger: contactSectionRef.value,
                    end: 'top 25%',
                    pinSpacing: false,
                    anticipatePin: 1,
                });

                gsap.fromTo(
                    projectsRef.value,
                    { opacity: 1 },
                    {
                        opacity: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: contactSectionRef.value,
                            start: 'top bottom',
                            end: 'top 25%',
                            scrub: true,
                        },
                    }
                );

                gsap.fromTo(
                    bgRef.value,
                    {
                        yPercent: -100, // 初始：背景圖底部 對齊 區塊頂部 (整張圖在上面)
                    },
                    {
                        yPercent: 0, // 結束：背景圖置中/填滿區塊
                        ease: 'none',
                        scrollTrigger: {
                            trigger: contactSectionRef.value,
                            start: 'top bottom', // 當區塊頂部 進入 視窗底部時開始
                            end: 'bottom bottom', // 當區塊底部 碰到 視窗底部時結束
                            scrub: true,
                        },
                    }
                );
            });
        };

        const loadProjects = async () => {
            try {
                const response = await fetch(
                    CONFIG.LOCAL_DATA + 'projects.json'
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                projects.value = data.projects.slice(0, 4);

                await nextTick();
                setTimeout(() => {
                    initScrollTrigger();
                    ScrollTrigger.refresh();
                }, 100);
            } catch (error) {
                console.error('Failed to load navigation links:', error);
            }
        };

        useWaitForImages(() => {
            ScrollTrigger.refresh();
        });

        onMounted(() => {
            loadProjects();
        });

        onUnmounted(() => {
            ctx && ctx.revert();
        });

        const handleMouseEnter = (index) => {
            const bubble = bubbleRefs.value[index];
            if (!bubble) return;

            gsap.to(bubble, {
                duration: 0.3,
                ease: 'power2.in',
                overwrite: 'auto',
            });
        };

        // 2. 滑鼠移動：泡泡跟隨 (使用 fixed 定位)
        const handleMouseMove = (e, index) => {
            const bubble = bubbleRefs.value[index];
            const target = e.currentTarget;

            if (!bubble || !target) return;

            // 取得 router-link 的邊界資訊
            const rect = target.getBoundingClientRect();

            // X 軸計算 (相對於左邊)：滑鼠 X - 容器左邊界
            const relativeX = e.clientX - rect.left;

            // Y 軸計算 (相對於底部)：滑鼠 Y - 容器下邊界
            // 因為 CSS 是 bottom-0，往上移動 y 會是負值，這是正確的
            const relativeY = e.clientY - rect.bottom;

            // 設定偏移量 (讓泡泡出現在滑鼠右下方)
            const offsetX = 10;
            const offsetY = 50;

            gsap.to(bubble, {
                x: relativeX + offsetX,
                y: relativeY + offsetY,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: 'auto',
            });
        };

        // 3. 滑鼠離開：隱藏泡泡
        const handleMouseLeave = (index) => {
            const bubble = bubbleRefs.value[index];
            if (!bubble) return;

            gsap.to(bubble, {
                y: 0,
                x: 0,
                duration: 0.3,
                ease: 'power2.in',
                overwrite: 'auto',
            });
        };

        // 用來綁定 v-for 裡的 ref
        const setBubbleRef = (el, index) => {
            if (el) bubbleRefs.value[index] = el;
        };

        return {
            containerRef,
            aboutRef,
            projectsRef,
            projectTitleRef,
            projects,
            setBubbleRef,
            handleMouseEnter,
            handleMouseMove,
            handleMouseLeave,
            bgRef,
            contactSectionRef,
            handleFormFocus,
        };
    },
    template: /* html */ `
                    <div ref="containerRef" class="will-change-transform max-w-[2160px] flex flex-col md:flex-row items-center min-h-[90vh] md:min-h-screen mt-[120px] md:mt-0 dark:text-dark-text">
                        <div class="md:w-1/2 mb-6 flex flex-col justify-center items-center h-full px-10">
                            <div class="md:max-w-md">
                                <h2 class="font-bold pb-3">
                                    <span class="block pb-3 text-4xl">你好, 我是</span>
                                    <span class="text-5xl md:text-7xl text-primary">James Hsu</span>
                                </h2>
                                <p class="">
                                    具備跨領域的技術與管理能力，
                                    <br>
                                    致力於打造高效且貼近使用者的應用程式。
                                </p>
                            </div>
                        </div>

                        <div class="w-full md:w-1/2 flex justify-center">
                            <img 
                                class="block brightness-125 shadow-lg" 
                                src="/assets/images/yehlier-scenery.webp" 
                                alt="野柳風景照"
                                fetchpriority="high"
                            >
                        </div>
                    </div>

                    <div ref="aboutRef" data-speed="0.5" class="will-change-transform px-2 z-1 w-full min-h-[360px] flex flex-col justify-center items-center bg-sky-50 dark:bg-gray-500 dark:text-dark-text">
                        <div class="text-center max-w-[480px]">
                            <h3 class="text-4xl font-bold mb-4">關於我</h3>
                            <p class="text-justify mb-4">
                            我擁有2年多的Web3前後端相關網頁應用的實務開發經驗，具備前端工程師、專案管理師與MIS三重實務經驗，曾任職於麥斯科技與哲煜科技。
                            自軍旅與美國進修背景成功轉職，精通HTML、CSS、JavaScript及Angular、Vue3、React等主流框架。
                            <br>
                            我將過往培養的紀律與執行力轉化為職場優勢，擅長跨領域溝通與問題解決。
                            這段跨領域歷程證明我具備高度適應力與學習熱忱，能以「技術＋管理」的全面視角，為專案創造最大價值。
                            </p>
                            <router-link to="/About" class="underline float-right hover:text-primary block w-fit border p-2 rounded">更多關於我</router-link>
                        </div>
                    </div>

                    <div ref="projectsRef" data-speed="0.5" class="will-change-transform w-full pb-[100px] z-1 min-h-[720px] flex flex-col justify-start items-center bg-light-bg dark:bg-dark-bg dark:text-dark-text">
                            <h3 ref="projectTitleRef" class="will-change-transform z-10 w-full text-center text-4xl font-bold p-8 bg-light-bg dark:bg-dark-bg">精選．作品集</h3>
                            <div class="flex justify-center items-center flex-col flex-wrap gap-[40px] mt-12">
                                <div
                                    v-for="(project, index) in projects" 
                                    :key="project.name" 
                                    class="flex justify-center items-center flex-col gap-[40px] w-full max-w-[1200px] w-1/2"
                                >
                                    <router-link 
                                        :to="{ name: 'project_detail', params: { id: project.id } }" 
                                        class="group relative flex justify-between items-center flex-col-reverse md:flex-row w-full hover:text-primary transition-shadow duration-300"
                                        @mouseenter="handleMouseEnter(index)"
                                        @mousemove="handleMouseMove($event, index)"
                                        @mouseleave="handleMouseLeave(index)"
                                    >
                                        <div class="p-4 text-justify mb-[50px] md:mb-0">
                                            <p class="font-bold text-xl mb-2">{{ project.name }}</p>
                                            <p class="">{{ project.description }}</p>
                                        </div>

                                        <img 
                                            :src="project.image" 
                                            :alt="project.name" 
                                            loading="lazy"
                                            class="rounded-lg w-3/4 md:w-full max-w-md m-4 transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-2xl"
                                        />

                                        <div 
                                            :ref="(el) => setBubbleRef(el, index)"
                                            class="absolute bottom-0 left-3 md:left-0 z-1 pointer-events-none
                                                bg-primary text-dark-text dark:text-light-text 
                                                px-4 py-2 rounded-full text-sm tracking-wider whitespace-nowrap
                                                border-1 border-black group-hover:shadow-[3px_3px_0px_hsl(from_var(--color-primary)_calc(h_+_120)_s_l_/_0.5)]"
                                            >
                                            了解更多<span class="font-bold">{{ project.name }}</span> <app-icon name="link" class="inline-block w-[15px] text-dark-text dark:text-light-text" />
                                        </div>
                                    </router-link>
                                    <hr
                                        v-if="index !== projects.length - 1"
                                        class="w-full border-t border-primary"
                                    />
                                </div>
                                <router-link to="/Projects" class="block w-fit border p-2 underline rounded hover:text-primary">更多作品集</router-link>
                            </div>
                    </div>
                    <div 
                        ref="contactSectionRef"
                        class="will-change-transform relative w-full overflow-hidden" 
                        data-speed="1.1"
                    >
                        <div 
                            ref="bgRef"
                            class="will-change-transform absolute top-0 left-0 w-full h-full z-0"
                        >
                            <picture>
                                <source
                                    media="(max-width: 768px)"
                                    srcset="./assets/images/contact-bg-768.webp"
                                />
                                <img
                                    src="./assets/images/contact-bg.webp"
                                    alt="Contact Background"
                                    loading="lazy"
                                    class="w-full h-full object-cover brightness-75"
                                />
                            </picture>
                        </div>

                        <!-- 內容層：相對定位，z-10 蓋過背景 -->
                        <div
                            class="relative z-10 w-full py-20 px-4 text-light-text dark:text-dark-text"
                        >
                            <contact-form />
                        </div>
                    </div>
    `,
};

export default Home;
