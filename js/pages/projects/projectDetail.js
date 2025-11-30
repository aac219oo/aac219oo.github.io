import { onMounted, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import gsap from 'gsap';

const ProjectDetail = {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const project = ref(null);
        const loading = ref(true);
        const error = ref(null);
        const isLightboxOpen = ref(false);
        const selectedImage = ref('');
        let ctx;
        let loopTween; // [新增] 用來儲存動畫實體

        const projectId = route.params.id;

        const initScrollTrigger = () => {
            if (ctx) ctx.revert();

            ctx = gsap.context(() => {
                const boxes = gsap.utils.toArray('.box');
                const totalBoxes = boxes.length;

                // 若沒有圖片就不執行
                if (totalBoxes === 0) return;

                // 1. 初始排列
                gsap.set(boxes, {
                    xPercent: (i) => i * 100,
                });

                // 2. 開始動畫，並將其存入 loopTween 變數
                loopTween = gsap.to(boxes, {
                    xPercent: `-=${100 * totalBoxes}`,
                    duration: 40,
                    ease: 'none',
                    repeat: -1,
                    modifiers: {
                        xPercent: gsap.utils.wrap(0, 100 * totalBoxes),
                    },
                });
            });
        };

        // [新增] 滑鼠進入：平滑減速
        const handleMouseEnter = () => {
            if (loopTween) {
                // timeScale: 0.1 代表變成原本速度的 1/10
                // duration: 0.5 代表花 0.5 秒慢慢煞車，比較自然
                gsap.to(loopTween, { timeScale: 0.2, duration: 0.5 });
            }
        };

        // [新增] 滑鼠離開：平滑恢復速度
        const handleMouseLeave = () => {
            if (loopTween) {
                // timeScale: 1 代表恢復正常速度
                gsap.to(loopTween, { timeScale: 1, duration: 0.5 });
            }
        };

        const openLightbox = (imgSrc) => {
            selectedImage.value = imgSrc;
            isLightboxOpen.value = true;
            // 選擇性：開啟大圖時暫停輪播，體驗比較好
            if (loopTween) loopTween.pause();
        };

        // [新增] 關閉 Lightbox
        const closeLightbox = () => {
            isLightboxOpen.value = false;
            selectedImage.value = '';
            // 選擇性：關閉後恢復輪播
            if (loopTween) loopTween.play();
        };

        onMounted(async () => {
            try {
                const response = await fetch('/assets/data/projects.json');
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const data = await response.json();
                const foundProject = data.projects.find(
                    (p) => p.id === projectId
                );

                if (foundProject) {
                    project.value = foundProject;
                } else {
                    error.value = '找不到該專案資料';
                }

                await nextTick();
                setTimeout(() => {
                    initScrollTrigger();
                }, 100);
            } catch (err) {
                console.error(err);
                error.value = '讀取資料發生錯誤';
            } finally {
                loading.value = false;
            }
        });

        const goBack = () => {
            router.push({ path: '/Projects' });
        };

        // [修改] 記得回傳新的函式 handleMouseEnter, handleMouseLeave
        return {
            project,
            loading,
            error,
            goBack,
            handleMouseEnter,
            handleMouseLeave,
            isLightboxOpen,
            selectedImage,
            openLightbox,
            closeLightbox,
        };
    },
    template: /* html */ `
        <div class="w-full mx-auto px-4 lg:px-8 text-light-text dark:text-dark-text">
            
            <div v-if="loading" class="text-center py-20">
                載入中...
            </div>

            <div v-else-if="error" class="text-center py-20">
                <p class="text-xl mb-4">{{ error }}</p>
                <button @click="goBack" class="text-blue-600 hover:underline">返回列表</button>
            </div>

            <div v-else class="">
                <button 
                    @click="goBack" 
                    class="mb-6 flex items-center cursor-pointer hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    返回作品集
                </button>
                
                <div class="w-full h-64 md:h-96 relative">
                    <img :src="project.images[0]" :alt="project.name" class="w-full h-full object-cover object-top">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div class="p-8 text-white">
                            <h1 class="text-3xl md:text-4xl font-bold mb-2 text-shadow-lg">{{ project.name }}</h1>
                        </div>
                    </div>
                </div>

                <div class="p-8">
                    <div class="prose max-w-none">
                        <h3 class="text-2xl font-bold mb-4">專案介紹</h3>
                        <p class="text-lg leading-relaxed mb-6">{{ project.description }}</p>
                        
                        <div class="p-6 mt-8">                            
                            <p><strong>主要技術：</strong> <span v-for="(tech, index) in project.technologies" :key="index">{{ tech }}<span v-if="index < project.technologies.length - 1">, </span></span></p>
                            <p><strong>專案連結：</strong> <a v-if="project.link" :href="project.link" target="_blank" class="text-blue-600 hover:underline">{{ project.link }}</a><span v-else>暫無提供</span></p>
                            <p><strong>GitHub：</strong> <a v-if="project.github" :href="project.github" target="_blank" class="text-blue-600 hover:underline">{{ project.github }}</a><span v-else>暫無提供</span></p>
                            <br />
                            <h3 class="font-bold mb-2">專案資訊</h3>
                            <p class="space-y-2">{{ project.content }}</p>
                        </div>
                    </div>

                    <div 
                        v-if="project.images && project.images.length" 
                        class="mt-8 relative overflow-hidden h-[300px]"
                        @mouseenter="handleMouseEnter"
                        @mouseleave="handleMouseLeave"
                    >
                        <div class="boxes relative h-full">
                            <img 
                                v-for="(img, index) in project.images" 
                                :key="index" 
                                :src="img" 
                                :alt="project.name + ' 截圖 ' + (index + 1)" 
                                class="box block absolute w-full -left-full md:w-1/4 md:-left-1/4 h-full object-cover object-top px-2 cursor-pointer"
                                @click="openLightbox(img)"
                            >
                        </div>
                    </div>

                </div>
            </div>
            <Teleport to="body">
                <div 
                    v-if="isLightboxOpen" 
                    class="fixed inset-0 z-[999] bg-black/90 flex justify-center items-center backdrop-blur-sm p-4 transition-all duration-300"
                    @click="closeLightbox"
                >
                    <button 
                        class="absolute top-5 right-5 text-white/70 hover:text-white p-2 z-[101] cursor-pointer"
                        @click="closeLightbox"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <img 
                        :src="selectedImage" 
                        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl scale-100 animate-fade-in"
                        @click.stop
                    >
                </div>
            </Teleport>
        </div>
    `,
};

export default ProjectDetail;
