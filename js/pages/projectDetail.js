import { onMounted, ref, nextTick, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import gsap from 'gsap';
import Draggable from 'gsap/Draggable';
import AppIcon from '/js/components/AppIcon.js';
import { CONFIG } from '/js/config.js';

// [新增] 註冊插件
gsap.registerPlugin(Draggable);

const ProjectDetail = {
    components: { 'app-icon': AppIcon },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const { t, locale } = useI18n();
        const project = ref(null);
        const loading = ref(true);
        const error = ref(null);
        const isLightboxOpen = ref(false);
        const selectedImage = ref('');
        const currentImageIndex = ref(0);

        let ctx;
        let loopTween;
        let dragInstance; // [新增] 用來儲存 Draggable 實體

        const projectId = route.params.id;

        const initScrollTrigger = () => {
            if (ctx) ctx.revert();

            ctx = gsap.context(() => {
                const boxes = gsap.utils.toArray('.box');
                const totalBoxes = boxes.length;
                const wrapElement = document.querySelector('.boxes');

                if (totalBoxes === 0) return;

                // 1. 初始排列
                gsap.set(boxes, {
                    xPercent: (i) => i * 100,
                });

                // 2. 建立主動畫 Loop
                loopTween = gsap.to(boxes, {
                    xPercent: `-=${100 * totalBoxes}`,
                    duration: 40,
                    ease: 'none',
                    repeat: -1,
                    modifiers: {
                        xPercent: gsap.utils.wrap(0, 100 * totalBoxes),
                    },
                });

                // --- [新增] Draggable 拖拉邏輯 ---
                // 建立一個隱形的代理物件，用來計算拖拉距離
                const proxy = document.createElement('div');

                dragInstance = Draggable.create(proxy, {
                    trigger: '.boxes', // 觸發區域為整個圖片容器
                    type: 'x', // 只允許水平拖拉
                    inertia: true, // 如果有 InertiaPlugin 會有慣性效果，沒有則為標準拖拉
                    onPress: () => {
                        loopTween.pause(); // 按下時暫停動畫
                    },
                    onDrag: function () {
                        // 計算總像素寬度 (單張寬度 * 張數)
                        // 注意：這裡假設所有 box 等寬，取第一個 box 的寬度
                        const boxWidth = boxes[0].offsetWidth;
                        const totalWidth = boxWidth * totalBoxes;

                        // 將拖拉的像素距離 (this.deltaX) 轉換為動畫進度的比例
                        // 因為動畫是向左走(xPercent 減少)，所以往左拖(deltaX負值)應該要讓動畫繼續前進(progress增加)
                        // 公式：progress -= deltaX / totalWidth
                        const progressChange = this.deltaX / totalWidth;

                        // 更新動畫進度 (使用 wrap 確保在 0-1 之間循環)
                        const currentProgress = loopTween.progress();
                        loopTween.progress(
                            gsap.utils.wrap(
                                0,
                                1,
                                currentProgress - progressChange
                            )
                        );
                    },
                    onRelease: () => {
                        loopTween.play(); // 放開後繼續播放
                        // 如果想要更自然的慣性，需要 InertiaPlugin 並配合 ThrowProps，
                        // 但單純 play() 對於無限輪播來說通常已經足夠流暢。
                    },
                    // [新增] 解決拖拉與點擊衝突：
                    // 設定最小拖拉距離，超過 3px 視為拖拉，不觸發 click
                    minimumMovement: 3,
                })[0];
            });
        };

        const handleMouseEnter = () => {
            // 只有在「沒有正在拖拉」的時候才減速
            // Draggable.isDragging 可以判斷全域是否有東西正在被拖拉
            if (loopTween && !dragInstance?.isDragging) {
                gsap.to(loopTween, { timeScale: 0, duration: 0.5 });
            }
        };

        const handleMouseLeave = () => {
            if (loopTween && !dragInstance?.isDragging) {
                gsap.to(loopTween, { timeScale: 1, duration: 0.5 });
            }
        };

        const openLightbox = (imgSrc) => {
            // [關鍵] 如果剛剛發生了拖曳行為，就不開啟 Lightbox
            // this.pointerEvent.defaultPrevented 在 Draggable 運作時通常會被設為 true
            if (dragInstance && dragInstance.isDragging) return;

            // 雙重檢查：如果剛剛才放開滑鼠(isThrowing/isPressed)，有時需要判斷時間差
            // 這裡使用簡單的方式：Draggable 會在拖曳時加上 data-dragging 屬性，或者我們可以依賴 click 事件的特性
            // 更好的方式是檢查 Draggable 的狀態：
            if (
                dragInstance &&
                Math.abs(dragInstance.startX - dragInstance.x) > 3
            ) {
                // 如果位移超過 3px，視為拖拉，不開啟
                return;
            }

            if (project.value && project.value.images) {
                const index = project.value.images.indexOf(imgSrc);
                if (index !== -1) {
                    currentImageIndex.value = index;
                    selectedImage.value = imgSrc;
                    isLightboxOpen.value = true;
                    if (loopTween) loopTween.pause();
                }
            }
        };

        const closeLightbox = () => {
            isLightboxOpen.value = false;
            selectedImage.value = '';
            if (loopTween) loopTween.play();
        };

        const prevImage = (e) => {
            if (e) e.stopPropagation(); // 防止觸發關閉 lightbox
            if (!project.value?.images) return;

            const len = project.value.images.length;
            // (當前 - 1 + 總長度) % 總長度 = 循環上一張
            currentImageIndex.value = (currentImageIndex.value - 1 + len) % len;
            selectedImage.value = project.value.images[currentImageIndex.value];
        };

        // [新增] 切換到下一張
        const nextImage = (e) => {
            if (e) e.stopPropagation(); // 防止觸發關閉 lightbox
            if (!project.value?.images) return;

            const len = project.value.images.length;
            // (當前 + 1) % 總長度 = 循環下一張
            currentImageIndex.value = (currentImageIndex.value + 1) % len;
            selectedImage.value = project.value.images[currentImageIndex.value];
        };

        const handleKeydown = (e) => {
            if (!isLightboxOpen.value) return; // 只有 Lightbox 開啟時才監聽

            if (e.key === 'ArrowLeft') prevImage();
            else if (e.key === 'ArrowRight') nextImage();
            else if (e.key === 'Escape') closeLightbox();
        };

        const loadProjectData = async () => {
            loading.value = true;
            error.value = null;
            try {
                const currentLocale = locale.value;
                const langFile =
                    currentLocale === 'en'
                        ? 'projects_en.json'
                        : 'projects_zh-Hant.json';
                const response = await fetch(CONFIG.LOCAL_DATA + langFile);
                if (!response.ok)
                    throw new Error('Network response was not ok');
                const data = await response.json();
                const foundProject = data.projects.find(
                    (p) => p.id === projectId
                );

                if (foundProject) {
                    project.value = foundProject;
                } else {
                    error.value = t('ProjectDetail.error_not_found'); //'找不到該專案資料';
                }

                await nextTick();
                setTimeout(() => {
                    initScrollTrigger();
                }, 100);
            } catch (err) {
                console.error(err);
                error.value = t('ProjectDetail.error_load'); // '讀取資料發生錯誤';
            } finally {
                loading.value = false;
            }
        };

        watch(locale, () => {
            loadProjectData();
        });

        onMounted(async () => {
            window.addEventListener('keydown', handleKeydown);
            loadProjectData();
        });

        // 記得在組件銷毀時清理
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeydown);
            if (ctx) ctx.revert();
        });

        const goBack = () => {
            router.push({ path: '/Projects' });
        };

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
            prevImage,
            nextImage,
            t
        };
    },
    template: /* html */ `
        <div class="w-full mx-auto px-4 lg:px-8 text-light-text dark:text-dark-text">
            
            <div v-if="loading" class="text-center py-20">
                {{ $t('ProjectDetail.loading') }}
            </div>

            <div v-else-if="error" class="text-center py-20">
                <p class="text-xl mb-4">{{ error }}</p>
                <button @click="goBack" class="text-blue-600 hover:underline">{{ $t('ProjectDetail.back_list') }}</button>
            </div>

            <div v-else class="">
                <button 
                    @click="goBack" 
                    class="mb-6 flex items-center cursor-pointer hover:text-primary transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    {{ $t('ProjectDetail.back_projects') }}
                </button>
                
                <div class="w-full h-64 md:h-96 relative">
                    <img :src="project.images[0]" :alt="project.name" class="w-full h-full object-cover object-top">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div class="p-8 text-white">
                            <h1 class="text-3xl md:text-4xl font-bold mb-2 text-shadow-lg">{{ project.name }}</h1>
                        </div>
                    </div>
                </div>

                <div class="p-2 md:p-8">
                    <div class="prose max-w-none">
                        <h3 class="text-2xl font-bold mb-4">{{ $t('ProjectDetail.intro') }}</h3>
                        <p class="text-lg leading-relaxed mb-4">{{ project.description }}</p>
                        
                        <div class="">                            
                            <p>
                                <strong>{{ $t('ProjectDetail.tech') }}</strong>
                                <span v-for="(tech, index) in project.technologies" :key="index" class="w-fit inline-block">
                                    <app-icon :name="tech" class="h-[30px] fill-none mr-2" />
                                </span>
                            </p>
                            <p>
                                <strong>{{ $t('ProjectDetail.link') }}</strong>
                                <a v-if="project.link" :href="project.link" target="_blank" class="hover:text-primary hover:underline">
                                    {{ project.link }}
                                    <app-icon name="link" class="inline-block w-[15px]" />
                                </a>
                                <span v-else>{{ $t('ProjectDetail.none') }}</span>
                            </p>
                            <p>
                                <strong>{{ $t('ProjectDetail.github') }}</strong>
                                <a v-if="project.github" :href="project.github" target="_blank" class="hover:text-primary hover:underline">
                                    {{ project.github }}
                                    <app-icon name="link" class="inline-block w-[15px]" />
                                </a>
                                <span v-else>{{ $t('ProjectDetail.none') }}</span>
                            </p>
                            <br />
                            <h3 class="font-bold mb-2">{{ $t('ProjectDetail.info') }}</h3>
                            <p class="space-y-2">{{ project.content }}</p>
                        </div>
                    </div>

                    <!-- 
                        這裡加了 cursor-grab 樣式提示用戶可以拖拉
                        並移除了 @click (改在代碼中處理 click 邏輯，避免拖拉觸發)
                    -->
                    <div 
                        v-if="project.images && project.images.length" 
                        class="mt-8 relative md:overflow-hidden h-[300px] cursor-grab active:cursor-grabbing select-none"
                        @mouseenter="handleMouseEnter"
                        @mouseleave="handleMouseLeave"
                    >
                        <!-- boxes 容器 -->
                        <div class="boxes relative h-full touch-pan-y">
                            <!-- 
                                注意：將 @click 改為 @pointerup 或在 openLightbox 內部判斷
                                這裡保留 click 但在函數內做阻擋邏輯是最簡單的 Vue 整合方式
                            -->
                            <div
                                v-for="(img, index) in project.images" 
                                :key="index"
                                class="box absolute w-full -left-full md:w-1/4 md:-left-1/4 h-full"
                                @click="openLightbox(img)"
                            >
                                <img  
                                    :src="img" 
                                    :alt="project.name + ' 截圖 ' + (index + 1)" 
                                    loading="lazy"
                                    class="block object-cover object-top px-3 pointer-events-none w-full h-full"
                                >
                                <!-- pointer-events-none 確保圖片本身不會被瀏覽器預設的拖曳行為影響 -->

                                <div class="absolute top-1 left-4 z-10 p-1 bg-gray-500/70 rounded text-dark-text pointer-events-none">
                                    <app-icon name="magnifying" class="w-[30px] h-[30px]" />
                                </div>
                            </div>
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
                    <!-- Close Button -->
                    <button 
                        class="absolute top-5 right-5 text-white/70 hover:text-white p-2 z-[102] cursor-pointer"
                        @click="closeLightbox"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <!-- Previous Button (Left) -->
                    <button 
                        v-if="project.images.length > 1"
                        class="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-[102] cursor-pointer bg-black/30 hover:bg-black/60 rounded-full transition-colors"
                        @click.stop="prevImage"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <!-- Next Button (Right) -->
                    <button 
                        v-if="project.images.length > 1"
                        class="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 z-[102] cursor-pointer bg-black/30 hover:bg-black/60 rounded-full transition-colors"
                        @click.stop="nextImage"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <img 
                        :src="selectedImage" 
                        class="max-w-full max-h-full object-contain rounded-lg shadow-2xl scale-100 animate-fade-in select-none"
                        @click.stop
                    >
                </div>
            </Teleport>
        </div>
    `,
};

export default ProjectDetail;
