import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { onMounted, ref, onUnmounted } from 'vue';
import AppIcon from '/js/components/AppIcon.js';

gsap.registerPlugin(ScrollTrigger);

const Home = {
    components: {
        'app-icon': AppIcon,
    },
    setup() {
        const containerRef = ref(null);
        const imgRef = ref(null);

        let ctx;

        onMounted(() => {
            ctx = gsap.context(() => {
            }, containerRef.value);
        });

        onUnmounted(() => {
            ctx && ctx.revert();
        });

        return {
            containerRef,
            imgRef
        };
    },
    template: /* html */ `
                <div ref="containerRef" class="max-w-[2160px] sticky top-0 z-0 flex items-center min-h-screen dark:text-(--color-dark-text)">
                    <div class="w-1/2 flex flex-col justify-center items-center h-full px-10">
                        <div class="max-w-md">
                            <h2 class="font-bold pb-3"><span class="block pb-3 text-4xl">你好, 我是</span><span class="text-7xl text-primary">許家瑜</span></h2>
                            <p class="text-xl">
                                專長為前端開發技術的工程師,
                                <br/>
                                擁有 2 年多的 Web3 相關應用的實務開發經驗,
                                <br/>
                                目前正朝著全端技術努力發展中。
                            </p>
                        </div>
                    </div>

                    <div ref="imgRef" class="w-1/2 flex justify-center">
                        <img 
                            class="block brightness-125 shadow-lg" 
                            src="/assets/images/F52A146D-D370-4161-9414-21A16814CE54.jpg" 
                            alt=""
                        >
                    </div>
                </div>

                <div class="relative z-10 w-full h-screen flex flex-col justify-center items-center transition-colors duration-300 bg-sky-50 dark:bg-gray-500 dark:text-(--color-dark-text)">
                    <div class="text-center">
                        <p class="text-4xl mb-4">About me</p>
                        <p class="text-xl mb-4">I'm a programmer.</p>
                        <router-link to="/About" class="underline">Read more</router-link>
                    </div>
                </div>
    `,
};

export default Home;