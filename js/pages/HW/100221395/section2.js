import { onMounted, onUnmounted } from 'vue';

export default {
    name: 'Section2',
    setup() {
        const styleId = 'section2-custom-styles';

        const css = `
            #midterm-schedule {
                width: 100%;
                padding: 40px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: white;
            }

            #midterm-schedule table {
                width: 90%;
                max-width: 800px;
                border-collapse: collapse;
                background-color: #f0f0f0;
                border: 1px solid #333;
            }

            #midterm-schedule caption {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 15px;
                color: #333;
            }

            #midterm-schedule th, 
            #midterm-schedule td {
                border: 1px solid #333;
                padding: 15px;
                text-align: center;
                vertical-align: middle;
            }

            #midterm-schedule thead th {
                background-color: #e0e0e0;
                font-weight: bold;
            }

            #midterm-schedule tbody td {
                color: #333;
            }
        `;

        onMounted(() => {
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = css;
                document.head.appendChild(style);
            }
        });

        onUnmounted(() => {
            const style = document.getElementById(styleId);
            if (style) {
                style.remove();
            }
        });
    },
    template: /* html */ `
    <section id="midterm-schedule">
        <table>
            <caption>113學年度第二學期課表</caption>
            <thead>
                <tr>
                    <th>節次</th>
                    <th>星期一</th>
                    <th>星期二</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>第 1 節</td>
                    <!-- colspan="2" 水平合併星期一與星期二 -->
                    <td colspan="2">網頁設計</td>
                </tr>
                <tr>
                    <td>第 2 節</td>
                    <!-- rowspan="2" 垂直合併星期一的第 2 與第 3 節 -->
                    <td rowspan="2">資料庫</td>
                    <td>體育</td>
                </tr>
                <tr>
                    <td>第 3 節</td>
                    <td>通識課程</td>
                </tr>
            </tbody>
        </table>
    </section>
    `
};
