import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppIcon from '/js/components/AppIcon.js';

export default {
    name: 'Breadcrumb',
    components: {
        'app-icon': AppIcon,
    },
    setup() {
        const route = useRoute();

        const breadcrumbs = computed(() => {
            const matched = route.matched;
            // console.log('Matched Routes:', matched);

            const crumbs = matched
                .filter((r) => r.name)
                .map((r) => {
                    const keyName = String(r.name).toLowerCase();
                    const i18nKey = `menu.${keyName}`;

                    return {
                        path: r.path,
                        name: r.name,
                        i18nKey: i18nKey
                    };
                });

            // console.log('Breadcrumbs:', crumbs);

            return crumbs;
        });

        const isHome = computed(() => {
            return route.path === '/' || route.path === '/home';
        });

        return {
            breadcrumbs,
            isHome,
        };
    },
    template: /* html */ `
        <nav v-if="!isHome" aria-label="Breadcrumb" class="w-full mt-[110px] mb-6 mx-10">
            <ol class="flex flex-wrap items-center text-sm md:text-base">
                
                <!-- Home Icon -->
                <li class="flex items-center">
                    <router-link 
                        to="/" 
                        class="flex items-center transition-colors duration-200 text-(--color-light-text) dark:text-(--color-dark-text) hover:text-primary dark:hover:text-primary"
                        title="Home"
                    >
                        <app-icon name="home" class="w-4 h-4 md:w-[25px] md:h-[25px]" />
                    </router-link>
                </li>

                <!-- Breadcrumb Items -->
                <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path" class="flex items-center">
                    
                    <!-- Separator (/) -->
                    <span class="mx-2 text-gray-400 dark:text-gray-500 select-none">/</span>
                    
                    <!-- Link (if not last item) -->
                    <router-link 
                        v-if="index < breadcrumbs.length - 1"
                        :to="crumb.path"
                        class="transition-colors duration-200 text-(--color-light-text) dark:text-(--color-dark-text) hover:text-primary dark:hover:text-primary font-medium"
                    >
                        {{ $t(crumb.i18nKey) }}
                    </router-link>

                    <!-- Current Page (Last item, text only) -->
                    <span 
                        v-else 
                        class="font-bold cursor-default text-light-text dark:text-dark-text"
                        aria-current="page"
                    >
                        {{ $t(crumb.i18nKey) }}
                    </span>
                </li>
            </ol>
        </nav>
    `,
};
