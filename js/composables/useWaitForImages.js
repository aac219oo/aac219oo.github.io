import { onMounted } from 'vue';

/**
 * 等待圖片載入完成的 Hook
 * @param {Function} callback - 當所有圖片載入完成（或失敗）後執行的函式
 * @param {Object} [elementRef=null] - (可選) Vue ref，若提供則只檢查該元素內的圖片，否則檢查整頁 document
 */
export function useWaitForImages(callback, elementRef = null) {
    onMounted(() => {
        // 1. 決定搜尋範圍
        const scope = (elementRef && elementRef.value) ? elementRef.value : document;
        
        // 2. 找出範圍內所有圖片
        const images = scope.querySelectorAll('img');
        
        // 如果沒有圖片，直接執行 callback 並結束
        if (images.length === 0) {
            callback();
            return;
        }

        let loadedCount = 0;

        const checkAllLoaded = () => {
            loadedCount++;
            // 當所有圖片都載入（或失敗）後，執行 callback
            if (loadedCount === images.length) {
                callback();
            }
        };

        images.forEach((img) => {
            if (img.complete) {
                checkAllLoaded();
            } else {
                // 使用 { once: true } 確保事件只觸發一次並自動移除，避免記憶體洩漏
                img.addEventListener('load', checkAllLoaded, { once: true });
                img.addEventListener('error', checkAllLoaded, { once: true });
            }
        });
    });
}