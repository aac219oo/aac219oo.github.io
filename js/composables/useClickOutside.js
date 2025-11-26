import { onMounted, onUnmounted } from 'vue';

export function useClickOutside(elementRef, callback, excludeRef = null) {
    const handleClick = (event) => {
        // 1. 如果目標元素不存在，直接離開
        if (!elementRef.value) return;

        // 2. 如果點擊的是目標元素內部，視為「內部點擊」，不做事
        if (elementRef.value.contains(event.target)) {
            return;
        }

        // 3. 如果有點擊排除的元素 (例如 Toggle 按鈕)，也視為例外
        // 因為按鈕自己有 @click 會處理開關，這裡如果執行 callback (關閉) 會導致邏輯打架
        if (excludeRef && excludeRef.value && excludeRef.value.contains(event.target)) {
            return;
        }

        // 4. 確定是點擊外部，執行 callback
        callback();
    };

    onMounted(() => {
        window.addEventListener('click', handleClick);
    });

    onUnmounted(() => {
        window.removeEventListener('click', handleClick);
    });
}