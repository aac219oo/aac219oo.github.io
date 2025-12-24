import { h } from 'vue';
import { useI18n } from 'vue-i18n';

const About = {
    setup() {
        const { t, tm } = useI18n();
        return { t, tm };
    },
    template: /* html */ `
        <section class="left table text-light-text dark:text-dark-text px-4 lg:px-8">
        <h1>
            <span v-html="$t('about.greeting')"></span>
        </h1>
        <br>
        <h2 class="text-4xl">{{ $t('about.status') }}</h2>
        <table>
            <tbody>
                <tr>
                    <td class="width20">{{ $t('about.intro_title') }}</td>
                    <td class="width80">
                        {{ $t('about.intro_content') }}
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('about.education_title') }}</td>
                    <td>
                        <ul>
                            <li v-for="item in $tm('about.education_list')" :key="item">{{ item }}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('about.work_title') }}</td>
                    <td>
                        <ul>
                            <li v-for="item in $tm('about.work_list')" :key="item">{{ item }}</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('about.skills_title') }}</td>
                    <td class="icon flex flex-wrap gap-4">
                        <img
                            src="./assets/images/icons8-html-5.svg"
                            title="HTML5"
                            alt="HTML5"
                        />
                        <img
                            src="./assets/images/icons8-css3.svg"
                            title="CSS3"
                            alt="CSS3"
                        />
                        <img
                            src="./assets/images/icons8-javascript.svg"
                            title="Javascript"
                            alt="Javascript"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg"
                            title="Typescript"
                            alt="Typescript"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/90/Angular-new-logo-small.svg"
                            title="Angular"
                            alt="Angular"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg"
                            title="Vue"
                            alt="Vue"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/3/30/React_Logo_SVG.svg"
                            title="React"
                            alt="React"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
                            title="Python"
                            alt="Python"
                        />
                        <img
                            src="./assets/images/AI_Application_Icon.ico"
                            alt="AI"
                        />
                        <img src="./assets/images/ps.ico" alt="PS" />
                    </td>
                </tr>
                <tr>
                    <td>{{ $t('about.exp_title') }}</td>
                    <td v-html="$t('about.exp_content')"></td>
                </tr>
                <tr>
                    <td>{{ $t('about.portfolio_title') }}</td>
                    <td>
                        <ul>
                            <li>
                                <a href="https://www.artisan.com.tw/"
                                    >{{ $t('about.projects_list.artisan') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://www.gianttour.com.tw/"
                                    >{{ $t('about.projects_list.giant') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://www.luxetravel.com.tw/"
                                    >{{ $t('about.projects_list.luxe') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://tourm.com.tw/">{{ $t('about.projects_list.tourm') }}</a>
                            </li>
                            <li>
                                <a href="https://ccs.ncl.edu.tw/"
                                    >{{ $t('about.projects_list.ncl') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://www.metro.taipei/"
                                    >{{ $t('about.projects_list.metro') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://www.cdic.gov.tw/"
                                    >{{ $t('about.projects_list.cdic') }}</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://stock.landbank.com.tw/Index_CH/index.aspx"
                                    >{{ $t('about.projects_list.landbank') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://www.hrcmntmp.ntpc.gov.tw/"
                                    >{{ $t('about.projects_list.park') }}</a
                                >
                            </li>
                            <li>
                                <a href="https://www.scbooks.com.tw/"
                                    >{{ $t('about.projects_list.scbooks') }}</a
                                >
                            </li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
    <section class="right">
        <img class="myPic" src="./assets/images/myselfL.jpg" alt="生活照" />
    </section>
    `,
};

export default About;
