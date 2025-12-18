import AppIcon from '/js/components/AppIcon.js';

const Blog = {
    components: {
        'app-icon': AppIcon,
    },
    template: /* html */ `
            <div class="relative w-full mt-[110px]">
                <img class="block w-full h-[480px] object-cover brightness-125" src="/assets/images/contact-bg.webp" alt="banner">
                <div class="absolute top-[40%] left-[50%] -translate-[50%]">
                    <p class="text-white font-black text-7xl drop-shadow-xl/80 text-center">JH BLOG</p>
                    <p class="text-white font-bold text-2xl drop-shadow-xl/80 text-center">"Fear is an interesting counselor."</p>
                    <p class="text-white font-bold text-xl drop-shadow-xl/80 text-right">by Alex Honnold</p>
                </div>
                <app-icon name="vector" class="absolute top-[85%] left-[50%] w-[50px] -translate-[50%]" />
            </div>
    `,
};

export default Blog;
