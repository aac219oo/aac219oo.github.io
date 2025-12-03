import { onMounted, onUnmounted, ref } from 'vue';

const HW100220477_panorama = {
    setup() {
        const panoramaContainer = ref(null);
        let viewer = null;

        // 定義全景圖路徑
        const imagePath = 'https://pannellum.org/images/alma.jpg';

        // 載入 CSS 的函式
        const loadStyle = (href) => {
            if (document.querySelector(`link[href="${href}"]`)) return;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        };

        // 載入 Script 的函式
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (window.pannellum) {
                    resolve(); // 如果已經載入過，直接回傳
                    return;
                }
                // 檢查是否正在載入中，避免重複插入
                let script = document.querySelector(`script[src="${src}"]`);
                if (!script) {
                    script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                } else {
                    script.addEventListener('load', resolve);
                }
            });
        };

        // 初始化全景圖檢視器
        const initViewer = () => {
            if (window.pannellum && panoramaContainer.value) {
                // 銷毀舊的實例 (如果有的話)
                if (viewer) {
                    try { viewer.destroy(); } catch(e) {}
                }

                viewer = window.pannellum.viewer(panoramaContainer.value, {
                    type: 'equirectangular',
                    panorama: imagePath,
                    autoLoad: true,        // 自動載入
                    autoRotate: 0,        // 自動旋轉速度 (負值為順時針)
                    compass: true,         // 顯示指南針
                    showControls: true     // 顯示控制列
                });
            }
        };

        onMounted(async () => {
            try {
                // 1. 載入 Pannellum CSS
                loadStyle('https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css');
                
                // 2. 載入 Pannellum JS，並等待載入完成
                await loadScript('https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js');
                
                // 3. 初始化
                initViewer();
            } catch (error) {
                console.error('Pannellum載入失敗:', error);
            }
        });

        onUnmounted(() => {
            // 組件銷毀時清理 viewer
            if (viewer) {
                // 嘗試呼叫 destroy，有些版本可能沒有此方法或實作不同，加 try-catch 保險
                try { viewer.destroy(); } catch (e) {}
            }
        });

        return {
            panoramaContainer
        };
    },
    template: /* html */ `
        <div class="panorama-box" style="position: relative; width: 100%;">
            <div 
                ref="panoramaContainer" 
                class="panorama" 
                style="width: 100%; height: 600px; background-color: #eee;"
            ></div>
            
            </div>
    `
};

export default HW100220477_panorama;