import { onMounted, ref, onUnmounted, nextTick } from 'vue';
import AppIcon from '/js/components/AppIcon.js';
import { CONFIG } from '/js/config.js';

const Projects = {
    components: {
        'app-icon': AppIcon,
    },
    setup() {
        const projects = ref([]);
        onMounted(async () => {
            const response = await fetch(CONFIG.LOCAL_DATA + 'projects.json');
            const data = await response.json();
            projects.value = data.projects;
        });
        // console.log(projects);
        return { projects };
    },
    template: /* html */ `
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-light-text dark:text-dark-text">
            <!-- 頁面標題區塊 -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-extrabold mb-4">作品集</h1>
            </div>

            <!-- 專案卡片 Grid 佈局 -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <!-- 使用 v-for 迴圈渲染每個專案卡片 -->
                <div v-for="project in projects" :key="project.id" class="bg-white dark:bg-dark-bg rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-200">
                    
                    <!-- 卡片圖片區塊 -->
                    <div class="h-48 overflow-hidden relative group">
                        <img 
                            :src="project.image" 
                            :alt="project.name" 
                            class="w-full h-full object-cover absolute z-1 transform group-hover:scale-105 transition-transform duration-500"
                        >
                        <!-- 覆蓋層 (可選：增加互動感) -->
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </div>

                    <!-- 卡片內容區塊 -->
                    <div class="p-6 flex-1 flex flex-col">
                        <h3 class="text-xl font-bold text-light-text dark:text-dark-text mb-2">{{ project.name }}</h3>
                        <p class="text-light-text dark:text-dark-text mb-4 flex-1">{{ project.description }}</p>
                        
                        <!-- 按鈕或連結區塊 -->
                        <div class="mt-auto pt-4 border-t border-gray-100 text-right">
                            <router-link 
                                :to="{ name: 'project_detail', params: { id: project.id } }" 
                                class="text-primary font-medium hover:text-[hsl(from_var(--color-primary)_calc(h_+_120)_s_l)] flex items-center gap-2 transition-colors inline-flex"
                            >
                                查看詳情
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </router-link>
                        </div>
                    </div>
                </div>

            </div>
            <p class="mt-6 text-right">還有更多作品持續上架中...</p>
        </div>
    `,
};

export default Projects;
