import { ref, onMounted } from 'vue';

const HW100220477_googleEarthStudio = {
    setup() {
        const videoUrl = ref('');
        
        onMounted(() => {
            // 在這裡設定影片路徑
            // 這樣可以確保只有當組件被掛載(使用者點進來)後，瀏覽器才開始請求影片資源
            videoUrl.value = '/assets/videos/anywhere.mp4';
        });

        return {
            videoUrl
        };
    },
    template: /* html */ `
        <div class="flex flex-col items-center w-full p-4 gap-4">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Google Earth Studio 影片展示</h2>
            
            <div class="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-xl relative">
                <!-- 
                    動態綁定 :src="videoUrl"
                    初始值為空，onMounted 後才會有值，避免提早載入
                -->
                <video 
                    v-if="videoUrl"
                    class="w-full h-full object-contain animate-fade-in"
                    :src="videoUrl"
                    controls
                    muted
                    playsinline
                >
                    您的瀏覽器不支援 HTML5 影片標籤。
                </video>
                
                <!-- 載入前的佔位區塊 (可選) -->
                <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
                    載入中...
                </div>
            </div>

            <p class="text-gray-600 dark:text-gray-400 mt-2">
                這是使用 Google Earth Studio 製作的地球縮時攝影/運鏡影片。
            </p>
        </div>
    `
};

export default HW100220477_googleEarthStudio;