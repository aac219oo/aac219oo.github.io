import { h } from 'vue';

const Home = {
    template: `
        <div class="page-content">
            <h2>{{ $t('pages.home_title') }}</h2>
            <p>{{ $t('pages.home_content') }}</p>
        </div>
    `
};

export default Home;
