import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
// 1. 引入 nextTick
import { onMounted, ref, onUnmounted, nextTick } from 'vue';
import AppIcon from '/js/components/AppIcon.js';
import { useWaitForImages } from '/js/composables/useWaitForImages.js';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Home = {
    components: {
        'app-icon': AppIcon,
    },
    setup() {
        const containerRef = ref(null);
        const aboutRef = ref(null);
        const projectsRef = ref(null);
        const projects = ref([]);

        let ctx;

        // 2. 將 GSAP 的初始化邏輯獨立出來
        const initScrollTrigger = () => {
            // 如果已有 context 實例，先清除舊的 (避免重複綁定)
            if (ctx) ctx.revert();

            ctx = gsap.context(() => {
                ScrollSmoother.create({
                    smooth: 2,
                    effects: true,
                    normalizeScroll: true,
                });

                // 3. 在這裡選取元素，這時 DOM 已經長好了
                let sections = gsap.utils.toArray('.projects-container .panel');

                // 4. 恢復並修正橫向捲動邏輯
                if (sections.length > 0) {
                    gsap.to(sections, {
                        xPercent: -100 * (sections.length - 1),
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.projects-container',
                            pin: true,
                            scrub: 1, // 改成 1 會比 0.1 更滑順一點
                            // end 設定為捲動寬度，這樣手感會比較自然，也可以固定寫 "+=3000"
                            end: "+=3000", 
                        },
                    });
                }

                // 其他動畫邏輯
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
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    scrub: true,
                });

                ScrollTrigger.create({
                    trigger: aboutRef.value,
                    pin: aboutRef.value,
                    start: 'center center',
                    end: '+=400',
                });
            });
        };

        const loadProjects = async () => {
            try {
                const response = await fetch('/assets/data/projects.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                projects.value = data.projects;

                // 5. 關鍵修改：等待 DOM 更新完畢後，才執行 GSAP
                await nextTick();
                initScrollTrigger(); 

            } catch (error) {
                console.error('Failed to load navigation links:', error);
            }
        };

        useWaitForImages(() => {
            ScrollTrigger.refresh();
        });

        onMounted(() => {
            // 6. 只要呼叫 loadProjects 即可，初始化會在 loadProjects 內部完成
            loadProjects();
        });

        onUnmounted(() => {
            ctx && ctx.revert();
        });

        return {
            containerRef,
            aboutRef,
            projectsRef,
            projects,
        };
    },
    template: /* html */ `
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <div ref="containerRef" data-speed="clamp(0.5)" class="max-w-[2160px] flex items-center min-h-screen dark:text-dark-text">
                        <div class="w-1/2 flex flex-col justify-center items-center h-full px-10">
                            <div class="max-w-md">
                                <h2 class="font-bold pb-3">
                                    <span class="block pb-3 text-4xl">你好, 我是</span>
                                    <span class="text-7xl text-primary">許家瑜</span>
                                </h2>
                                <p class="">
                                    專長為前端開發、專案管理與MIS的軟體工程師,
                                    <br/>
                                    擁有2年多的Web3前後端相關網頁應用的實務開發經驗,
                                    <br/>
                                    目前正朝著全端技術努力發展中。
                                </p>
                            </div>
                        </div>

                        <div class="w-1/2 flex justify-center">
                            <img 
                                class="block brightness-125 shadow-lg" 
                                src="/assets/images/F52A146D-D370-4161-9414-21A16814CE54.jpg" 
                                alt="野柳風景照"
                            >
                        </div>
                    </div>

                    <div ref="aboutRef" data-speed="clamp(0.5)" class="z-10 w-full min-h-[360px] flex flex-col justify-center items-center bg-sky-50 dark:bg-gray-500 dark:text-dark-text">
                        <div class="text-center max-w-[480px]">
                            <h3 class="text-4xl font-bold mb-4">關於我</h3>
                            <p class="text-left mb-4">
                            具備前端工程師、專案管理師與MIS的三重實務經驗，曾任職於麥斯科技與哲煜科技。
                            自軍旅與美國進修背景成功轉職，精通HTML、CSS、JavaScript及Angular、Vue3、React等主流框架。
                            <br>
                            我將過往培養的紀律與執行力轉化為職場優勢，擅長跨部門溝通與問題解決。
                            這段跨領域歷程證明我具備高度適應力與學習熱忱，能以「技術＋管理」的全面視角，為專案創造最大價值。
                            </p>
                            <router-link to="/About" class="underline hover:text-primary">閱讀更多...</router-link>
                        </div>
                    </div>

                    <div ref="projectsRef" data-speed="clamp(0.65)" class="w-full z-10 min-h-[720px] flex flex-col justify-start items-center bg-light-bg dark:bg-dark-bg dark:text-dark-text overflow-hidden">
                        <div class="text-center w-full py-10">
                            <h3 class="text-4xl font-bold mb-4">精選作品集</h3>
                            
                            <div class="projects-container flex justify-start pl-10 flex-nowrap w-full">
                                <div
                                    v-for="project in projects" 
                                    :key="project.name" 
                                    class="flex justify-center panel min-w-[400px] mx-4"
                                    >
                                    <router-link 
                                        :to="project.link" 
                                        class="block w-full max-w-sm bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                        
                                        <div class="p-4">
                                            <p class="font-bold text-xl mb-2">{{ project.title }}</p>
                                            <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{{ project.description }}</p>
                                        </div>

                                        <img 
                                            :src="project.image" 
                                            :alt="project.title" 
                                            class="rounded-b-lg w-full h-48 object-cover"/>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `,
};

export default Home;