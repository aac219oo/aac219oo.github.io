import { onMounted, onUnmounted } from 'vue';

export default {
    name: 'Section1',
    setup() {
        const styleId = 'section1-custom-styles';

        const css = `
            .exam-card-wrapper {
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 300px;
            }

            .exam-card-container {
                display: flex;
                align-items: center;
                border: 3px dashed #FF5733;
                background-color: white;
                padding: 20px;
                transition: transform 0.3s ease;
                max-width: 1000px;
                width: 100%;
            }

            .exam-card-container:hover {
                transform: translate(5px, -5px);
            }

            .exam-card-container img {
                width: 40%;
                border-radius: 15px;
                object-fit: cover;
                display: block;
            }

            .exam-card-container .text-block {
                width: 60%;
                padding-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .exam-card-container .text-block h2 {
                margin-top: 0;
                font-size: 2rem;
                font-weight: bold;
                color: #333;
                margin-bottom: 10px;
            }

            .exam-card-container .text-block p {
                line-height: 1.6;
                color: #666;
                margin: 0;
            }

            /* 手機版模式 (螢幕寬度小於或等於 850px) */
            @media screen and (max-width: 850px) {
                .exam-card-container {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .exam-card-container img {
                    width: 100%;
                    margin-bottom: 20px;
                }

                .exam-card-container .text-block {
                    width: 100%;
                    padding-left: 0;
                }
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
    <div class="exam-card-wrapper">
        <div class="exam-card-container">
            <img src="/assets/images/100221395/aurasync.jpg" alt="ROG Astral GeForce RTX 5090">
            <div class="text-block">
                <h2>ROG Astral GeForce RTX 5090</h2>
                <p>全新 ROG Astral 系列的靈感來自宇宙無限的廣闊和美麗，體現不斷探索和開拓前沿的創新理念。本著這項精神，ROG Astral GeForce RTX 5090 推出 ROG 首款四風扇顯示卡，並具備專利均溫熱導板、更高密度的散熱鰭片、相變 GPU 散熱片、極高的預設時脈速度、增強的功率輸出及更多特點。這些優質創新設計與吸擊的壓鑄框架及金屬 GPU 支架相得益彰，共同造就極致效能，甚至可因應最嚴苛的遊戲使用情境。</p>
            </div>
        </div>
    </div>
    `
};
