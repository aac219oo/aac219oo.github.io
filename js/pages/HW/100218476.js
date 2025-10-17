const HW100218476 = {
    template: `
        <table class="w-full border-collapse bg-white border">
            <colgroup>
                <col span="2" class="bg-cyan-300" />
            </colgroup>
            <caption class="text-xl">雲端服務產品功能比較表</caption>
            <thead class="border bg-cyan-500">
                <tr>
                    <th colspan="2" class="border w-1/4 text-center">方案比較</th>
                    <td class="border text-center">AWS</td>
                    <td class="border text-center">Microsoft Azure</td>
                    <td class="border text-center">GCP</td>
                </tr>
            </thead>
            <tbody class="border">
                <tr class="border">
                    <th colspan="2" class="border">執行速度</th>
                    <td class="border">全球範圍內數據中心</td>
                    <td class="border">全球範圍內數據中心</td>
                    <td class="border">全球範圍內數據中心</td>
                </tr>
                <tr class="border">
                    <th colspan="2" class="border">儲存容量</th>
                    <td colspan="3" class="border text-center">大</td>
                </tr>
                <tr class="border">
                    <th colspan="2" class="border">計算服務</th>
                    <td class="border">
                        大（擁有多樣的 EC2
                        實例類型，適合從一般工作負載到高效能運算）
                    </td>
                    <td class="border">
                        中（支援混合雲及高效能運算，但虛擬機種類和定制選項稍少）
                    </td class="border">
                    <td class="border">
                        中（自定義虛擬機實例性能強，但整體實例數量少於
                        AWS）
                    </td>
                </tr>
                <tr class="border">
                    <th colspan="2" class="border">儲存服務</th>
                    <td class="border">
                        多（供多樣的存儲類型，如
                        S3、EBS、EFS，並且具備全球最佳的耐久性和彈性）
                    </td>
                    <td class="border">
                        中（Blob、Disk、File Storage 選擇較 AWS
                        稍少，但整合微軟生態系統
                    </td class="border">
                    <td class="border">
                        中（Cloud Storage 具備彈性且可自動調整冷熱存儲）
                    </td>
                </tr>
                <tr class="border">
                    <th rowspan="2" class="border">支援</th>
                    <th class="border">作業系統</th>
                    <td class="border">
                        支援 Linux 多種發行版本、Windows 和自家 Amazon
                        Linux
                    </td>
                    <td class="border">以 Windows 支援最為強大，也支援 Linux</td>
                    <td>
                        支援 Linux 和 Windows，但相對 AWS 和 Azure
                        來說支援的版本稍少
                    </td>
                </tr>
                <tr>
                    <th class="border">程式語言</th>
                    <td class="border text-center">多</td>
                    <td colspan="2" class="border text-center">中</td>
                </tr>
                <tr class="border">
                    <th colspan="2" class="border">價格費用</th>
                    <td class="border">聯繫我們索取方案</td>
                    <td class="border">聯繫我們索取方案</td>
                    <td class="border">聯繫我們索取方案</td>
                </tr>
                <tr class="border">
                    <th colspan="2" class="border">整體優缺點</th>
                    <td class="border">
                        廣泛的功能、高可靠性和安全性，對新手用戶較複雜
                    </td class="border">
                    <td class="border">緊密與微軟產品整合，對微軟用戶友好</td>
                    <td class="border">強調創新和先進技術，在機器學習方面領先</td>
                </tr>
            </tbody>
        </table>
    `
};

export default HW100218476;