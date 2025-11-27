import { ref } from 'vue';

export default {
    setup() {
        const progress = ref(0);
        const show = ref(false);
        let interval = null;

        // 開始跑進度
        const start = () => {
            show.value = true;
            progress.value = 0;
            clearInterval(interval);
            
            interval = setInterval(() => {
                if (progress.value < 90) {
                    // 隨機增加進度，製造自然感
                    progress.value += Math.random() * 10;
                }
            }, 200);
        };

        // 結束進度
        const finish = () => {
            clearInterval(interval);
            progress.value = 100;
            
            setTimeout(() => {
                show.value = false;
                setTimeout(() => {
                    progress.value = 0;
                }, 200);
            }, 300);
        };

        // 重要：必須將 start 和 finish 回傳，父組件才能透過 ref 呼叫
        return {
            progress,
            show,
            start,
            finish
        };
    },
    template: `
        <div 
            class="progress-bar fixed top-0 left-0 h-[2px] bg-primary-500 z-[99999] transition-all duration-300 ease-out"
            :style="{ 
                width: progress + '%', 
                opacity: show ? 1 : 0 
            }"
        ></div>
    `
};