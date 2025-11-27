import { h } from 'vue';

const About = {
    template: `
        <section class="left table mt-[110px]">
        <h1>
            Hi. I am <br />
            James Hsu.
        </h1>
        <table>
            <tbody>
                <tr>
                    <td class="width20">自我簡介</td>
                    <td class="width80">
                        您好，我是許家瑜。我是一位軟體工程師，擁有 2 年 Web3
                        相關應用的實戰開發經驗。我目前在臺中國立勤益科技大學進修，持續學習最新的技術趨勢。過去我曾參與過
                        20
                        多項專案的開發與維護，讓我對產品的生命週期有深入理解。我特別熱衷於設計環節，因為我相信好的技術必須搭配好的用戶體驗才能發揮最大價值。我很期待將這些經驗帶入貴公司。
                    </td>
                </tr>
                <tr>
                    <td>學歷</td>
                    <td>
                        <ul>
                            <li>長億高級中學(畢業)</li>
                            <li>南西雅圖學院(肄業)</li>
                            <li>國立勤益科技大學(就學中)</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>工作經歷</td>
                    <td>
                        <ul>
                            <li>職業軍人</li>
                            <li>麥斯科技有限公司</li>
                            <li>哲煜科技股份有限公司</li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>專長</td>
                    <td class="icon">
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
                            src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg"
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
                    <td>工作經驗</td>
                    <td>
                        💻 專業歷程與背景 我具備在軟體科技業擔任
                        專案經理（PM） 與 前端工程師
                        的雙重經驗，曾在麥斯科技有限公司和哲煜科技股份有限公司任職。
                        在進入科技領域之前，我的職涯起點較為特別。我曾在軍隊服役四年，主要負責後勤補給工作，這段經歷培養了我對紀律、規劃與執行效率的重視。退伍後，我前往美國南西雅圖學院進修一年，後因家庭因素返國。
                        <br>
                        <br>
                        🚀 轉職與技能發展
                        回國後，我憑藉著對程式設計的濃厚興趣，下定決心轉向軟體開發。
                        我先透過職訓中心系統學習了 HTML、CSS
                        等前端基礎技術，並成功考取了前端網頁設計丙級證照。結訓後，深知軟體產業發展迅速，我持續投入時間自學
                        JavaScript，以滿足現代職場的需求。
                        在麥斯科技與哲煜科技擔任前端工程師期間，我透過參與各種專案，熟練掌握了多種主流框架的開發與應用，包括
                        Angular、Vue 和
                        React。這段經歷不僅累積了紮實的技術實力，也使我具備從專案規劃到實際程式開發的全面視角。
                        <br>
                        <br>
                        🌟 跨領域經驗
                        早期的服務業經驗（餐飲、零售）與軍隊的後勤背景，賦予了我優秀的溝通協調能力、問題解決能力以及對細節的專注力，這些特質在擔任專案經理和跨部門合作時，成為我與團隊高效合作的關鍵優勢。
                        我的職涯轉變證明了我具備強烈的學習動力、適應快速變化的能力，並能將過去看似不相關的經驗轉化為軟體開發領域的專業價值。
                    </td>
                </tr>
                <tr>
                    <td>作品集 & 專案經驗</td>
                    <td>
                        <ul>
                            <li>
                                <a href="https://www.artisan.com.tw/"
                                    >巨匠旅遊</a
                                >
                            </li>
                            <li>
                                <a href="https://www.gianttour.com.tw/"
                                    >巨大旅遊</a
                                >
                            </li>
                            <li>
                                <a href="https://www.luxetravel.com.tw/"
                                    >典藏旅遊</a
                                >
                            </li>
                            <li>
                                <a href="https://tourm.com.tw/">旅市假期</a>
                            </li>
                            <li>
                                <a href="https://ccs.ncl.edu.tw/"
                                    >國家圖書館 漢學研究中心</a
                                >
                            </li>
                            <li>
                                <a href="https://www.metro.taipei/"
                                    >臺北捷運運量數據管理平台</a
                                >
                            </li>
                            <li>
                                <a href="https://www.cdic.gov.tw/"
                                    >中央存款保險股份有限公司</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://stock.landbank.com.tw/Index_CH/index.aspx"
                                    >土地銀行證券財經資訊網站</a
                                >
                            </li>
                            <li>
                                <a href="https://www.hrcmntmp.ntpc.gov.tw/"
                                    >新北大都會公園</a
                                >
                            </li>
                            <li>
                                <a href="https://www.scbooks.com.tw/"
                                    >商鼎數位出版</a
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
