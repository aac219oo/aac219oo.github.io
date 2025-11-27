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
                <div ref="containerRef" class="sticky top-0 z-0 flex items-center h-screen">
                    <div class="w-1/2 flex flex-col justify-center items-center h-full px-10">
                        <h2 class="text-6xl font-bold mb-8">Hello World! <br> I'm James Hsu</h2>
                        <p class="text-xl text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            <br><br>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                        </p>
                    </div>

                    <div ref="imgRef" class="w-1/2 flex justify-center">
                        <img 
                            class="block brightness-125 shadow-lg" 
                            src="/assets/images/F52A146D-D370-4161-9414-21A16814CE54.jpg" 
                            alt=""
                        >
                    </div>
                </div>

                <div class="relative z-10 bg-sky-500 w-full h-screen flex flex-col justify-center items-center">
                    <div class="text-center">
                        <p class="text-4xl mb-4">About me</p>
                        <p class="text-xl mb-4">I'm a programmer.</p>
                        <router-link to="/About" class="underline">Read more</router-link>
                    </div>
                </div>
    `,
};

export default Home;