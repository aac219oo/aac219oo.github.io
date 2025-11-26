import { h, ref, onMounted, onUnmounted } from 'vue';
import { AnimationTemplate } from './animation_temp.js'
const Animation = {
    template: AnimationTemplate,
    emits: ['animation-finished'],
    setup(props, { emit }) {
        const lastWord = ref(null);
        let keydownListener = null;

        // 這個函式現在非常簡單：只要通知父元件即可
        const finishAnimation = () => {
            emit('animation-finished');
        };

        onMounted(() => {
            // 監聽 CSS animation 的結束
            if (lastWord.value) {
                lastWord.value.addEventListener('animationend', finishAnimation);
            }

            // 監聽 Escape 鍵
            keydownListener = (e) => {
                if (e.key === 'Escape') {
                    finishAnimation();
                }
            };
            document.addEventListener('keydown', keydownListener);
        });

        onUnmounted(() => {
            // 清理工作依然重要
            if (lastWord.value) {
                lastWord.value.removeEventListener('animationend', finishAnimation);
            }
            if (keydownListener) {
                document.removeEventListener('keydown', keydownListener);
            }
        });

        return {
            lastWord,
            finishAnimation
        };
    },
};

export default Animation;
