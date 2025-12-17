import AppIcon from '/js/components/AppIcon.js';

// 模組化分頁元件
const Homework = {
    components: {
        'app-icon': AppIcon,
    },
    template: /* html */ `
            <ul class="text-light-text dark:text-dark-text">
                <li><router-link to="/HW/html.cafe" class="hover:text-primary hover:underline hover:decoration-solid">{{ $t('HW.second') }}</router-link></li>
                <li><a href="https://www.chiayu.somee.com/" target="_blank" class="hover:text-primary hover:underline hover:decoration-solid">03.網域名稱與服務內容</a></li>
                <li><router-link to="/HW/100218340" class="hover:text-primary hover:underline hover:decoration-solid">04.增加網頁顯示技術</router-link></li>
                <li><router-link to="/HW/100218476" class="hover:text-primary hover:underline hover:decoration-solid">05.表格練習</router-link></li>
                <li><router-link to="/HW/100219151" class="hover:text-primary hover:underline hover:decoration-solid">07.課堂練習2</router-link></li>
                <li><router-link to="/HW/100219359" class="hover:text-primary hover:underline hover:decoration-solid">08.課堂作業</router-link></li>
                <li><router-link to="/HW/100220208" class="hover:text-primary hover:underline hover:decoration-solid">12.課堂練習</router-link></li>
                <li><router-link to="/HW/100220477" class="hover:text-primary hover:underline hover:decoration-solid">13.全景及3D網頁</router-link></li>
                <li><a href="https://aac219oo.github.io/next_practice/coupon" target="_blank" class="hover:text-primary hover:underline hover:decoration-solid">14.課堂練習</a></li>
                <li><router-link to="/HW/100220929" class="hover:text-primary hover:underline hover:decoration-solid">15-1.課堂練習</router-link></li>
                <li><router-link to="/HW/100220930" class="hover:text-primary hover:underline hover:decoration-solid">15-2.課堂練習</router-link></li>
            </ul>
    `,
};

export default Homework;
