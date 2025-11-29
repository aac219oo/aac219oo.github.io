import AppIcon from '/js/components/AppIcon.js';

// 模組化分頁元件
const Homework = {
    components: {
        'app-icon': AppIcon,
    },
    template: /* html */ `
        <div class="mt-[110px]">
            <ul class="text-light-text dark:text-dark-text">
                <li><router-link to="/HW/html.cafe">{{ $t('HW.second') }}</router-link></li>
                <li><a href="https://www.chiayu.somee.com/" target="_blank">03.網域名稱與服務內容</a></li>
                <li><router-link to="/HW/100218340">04.增加網頁顯示技術</router-link></li>
                <li><router-link to="/HW/100218476">05.表格練習</router-link></li>
                <li><router-link to="/HW/100219151">07.課堂練習2</router-link></li>
                <li><router-link to="/HW/100219359">08.課堂作業</router-link></li>
            </ul>
        </div>
    `,
};

export default Homework;
