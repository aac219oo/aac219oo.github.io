import { h } from 'vue';

// 模組化分頁元件
const Error = {
    // 您可以在這裡使用 setup() 函式或 options api
    template: `
        <div class="text-center py-12">
            <h2>404 - 找不到頁面</h2>
            <p>您要找的頁面不存在，請
                <router-link to="/">回首頁</router-link>
            </p>
        </div>
    `
};

export default Error;
