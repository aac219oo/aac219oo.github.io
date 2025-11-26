import { icons } from './icons.js';

export default {
    props: {
        name: {
            type: String,
            required: true
        }
        // class 會自動綁定到根元素 (svg) 上，所以不需要特別定義 prop
    },
    setup(props) {
        // 根據傳入的 name 取得對應的 icon 資料
        const iconData = icons[props.name] || { viewBox: '0 0 24 24', path: '' };
        
        return { iconData };
    },
    // 使用 v-html 來渲染路徑，這樣最靈活
    template: `
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            :viewBox="iconData.viewBox"
            class="fill-current" 
            v-html="iconData.path"
        >
        </svg>
    `
};