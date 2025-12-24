import { h } from 'vue';
import { useI18n } from 'vue-i18n';

// 模組化分頁元件
const ErrorPage = {
    setup() {
        const { t } = useI18n();
        return { t };
    },
    template: `
        <div class="text-center py-12 text-light-text dark:text-dark-text">
            <h2>{{ $t('Error.title') }}</h2>
            <p>{{ $t('Error.description') }}
                <router-link to="/">{{ $t('Error.back_home') }}</router-link>
            </p>
        </div>
    `
};

export default Error;
