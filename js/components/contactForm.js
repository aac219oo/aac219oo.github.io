import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { CONFIG } from '/js/config.js';

export default {
    name: 'ContactForm',
    props: {},
    setup(props) {
        const { t, locale } = useI18n();
        // GAS Google Apps Script 網址
        const GAS_URL = CONFIG.GAS_URL;

        const form = reactive({
            name: '',
            email: '',
            phone: '',
            gender: null,
            contactDay: [], // 改為陣列，支援多選 (['weekday', 'weekend'])
            weekdayTime: '', // 新增：平日時段
            weekendTime: '', // 新增：週末時段
            message: '',
            captcha: '',
        });

        const isSubmitting = ref(false);
        const submitStatus = ref({ type: '', message: '' });

        // 定義時間段選項
        const timeOptions = computed(() => [
            { value: 'morning', label: '09:00 ~ 12:00' },
            { value: 'afternoon', label: '13:00 ~ 17:00' },
            { value: 'evening', label: '18:00 ~ 21:00' },
            { value: 'any', label: t('Contact.anytime') },
        ]);

        const handleTimeChange = (type) => {
            if (!form.contactDay.includes(type)) {
                form.contactDay.push(type);
            }
        };

        const handleDayChange = (type) => {
            // Vue 的 v-model 會先更新 form.contactDay，所以這裡可以直接檢查
            if (!form.contactDay.includes(type)) {
                if (type === 'weekday') {
                    form.weekdayTime = '';
                } else if (type === 'weekend') {
                    form.weekendTime = '';
                }
            }
        };

        // 驗證碼相關邏輯
        const captchaCanvas = ref(null);
        const generatedCode = ref('');

        // 隨機顏色產生器
        const randomColor = (min, max) => {
            const r = Math.floor(Math.random() * (max - min + 1) + min);
            const g = Math.floor(Math.random() * (max - min + 1) + min);
            const b = Math.floor(Math.random() * (max - min + 1) + min);
            return `rgb(${r},${g},${b})`;
        };

        const drawCaptcha = (text) => {
            const canvas = captchaCanvas.value;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // 清除畫布
            ctx.clearRect(0, 0, width, height);

            // 背景色 (隨機淺色背景)
            ctx.fillStyle = randomColor(230, 255);
            ctx.fillRect(0, 0, width, height);

            // 文字樣式
            ctx.font = 'bold 28px sans-serif';
            ctx.textBaseline = 'middle';

            // 逐字繪製
            const len = text.length;
            const charWidth = width / (len + 1);

            for (let i = 0; i < len; i++) {
                ctx.save();
                ctx.fillStyle = randomColor(50, 150);
                const x = (i + 1) * charWidth + (Math.random() - 0.5) * 5;
                const y = height / 2 + (Math.random() - 0.5) * 5;
                ctx.translate(x, y);
                ctx.rotate((Math.random() - 0.5) * 0.5);
                ctx.fillText(text[i], 0, 0);
                ctx.restore();
            }

            // 干擾線
            for (let i = 0; i < 7; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * width, Math.random() * height);
                ctx.lineTo(Math.random() * width, Math.random() * height);
                ctx.strokeStyle = randomColor(100, 200);
                ctx.lineWidth = 1 + Math.random();
                ctx.stroke();
            }

            // 雜訊點
            for (let i = 0; i < 40; i++) {
                ctx.fillStyle = randomColor(100, 220);
                ctx.beginPath();
                ctx.arc(
                    Math.random() * width,
                    Math.random() * height,
                    1,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
            }
        };

        const generateCaptcha = () => {
            const chars =
                'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
            let result = '';
            for (let i = 0; i < 4; i++) {
                result += chars.charAt(
                    Math.floor(Math.random() * chars.length)
                );
            }
            generatedCode.value = result;
            drawCaptcha(result);
        };

        // [修改] 增加 clearMessage 參數，預設為 true
        const resetForm = (clearMessage = true) => {
            form.name = '';
            form.email = '';
            form.phone = '';
            form.gender = null;
            form.contactDay = [];
            form.weekdayTime = '';
            form.weekendTime = '';
            form.message = '';
            form.captcha = '';

            // 只有當 clearMessage 為 true 時才清空狀態
            if (clearMessage) {
                submitStatus.value = { type: '', message: '' };
            }

            generateCaptcha();
        };

        const handleGenderChange = (val) => {
            if (form.gender === val) {
                form.gender = null; // 如果點擊已選取的，則取消選取
            } else {
                form.gender = val; // 否則選取新的
            }
        };

        watch(locale, () => {
            // Re-draw captcha or update options needed?
            // Options are computed, so they update automatically.
            // Captcha drawing is canvas based, no translation needed inside canvas (random chars).
        });

        onMounted(() => {
            generateCaptcha();
        });

        const submitForm = async () => {
            // 1. 檢查驗證碼
            if (
                !form.captcha ||
                form.captcha.toLowerCase() !== generatedCode.value.toLowerCase()
            ) {
                submitStatus.value = {
                    type: 'error',
                    message: t('Contact.invalid_captcha'),
                };
                generateCaptcha();
                form.captcha = '';
                return;
            }

            isSubmitting.value = true;
            submitStatus.value = {
                type: 'info',
                message: t('Contact.sending'),
            }; // 設定傳送中狀態

            try {
                // 2. 整理資料：將性別與時間合併到 message 中
                let genderText = '';
                if (form.gender === 'male') genderText = t('Contact.male');
                else if (form.gender === 'female') genderText = t('Contact.female');
                else genderText = t('Contact.unselected');

                // 整理聯絡時間字串
                let contactInfo = [];

                // 取得選項文字的 helper
                const getTimeLabel = (val) => {
                    if (!val) return t('Contact.unspecified_time');
                    const opt = timeOptions.value.find((o) => o.value === val);
                    return opt ? opt.label : t('Contact.unspecified');
                };

                if (form.contactDay.includes('weekday')) {
                    contactInfo.push(`${t('Contact.weekday_prefix')}${getTimeLabel(form.weekdayTime)}`);
                }
                if (form.contactDay.includes('weekend')) {
                    contactInfo.push(`${t('Contact.weekend_prefix')}${getTimeLabel(form.weekendTime)}`);
                }

                const timeText =
                    contactInfo.length > 0 ? contactInfo.join(' / ') : t('Contact.unspecified');

                // 組合新的訊息內容
                const finalMessage = `
【個人資訊】
性別：${genderText}
方便聯絡時間：${timeText}

【訊息內容】
${form.message}
                `.trim();

                const data = {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: finalMessage,
                };

                // console.log("Sending data:", data); // Debug: 檢查發送的資料

                const response = await fetch(GAS_URL, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                });

                const result = await response.json();

                if (result.status === 'success') {
                    submitStatus.value = {
                        type: 'success',
                        message: t('Contact.success'),
                    };
                    // [修改] 傳入 false，表示不要清空剛剛設定好的成功訊息
                    resetForm(false);
                } else {
                    throw new Error('Server returned error status');
                }
            } catch (error) {
                console.error('Error:', error);
                submitStatus.value = {
                    type: 'error',
                    message: t('Contact.fail'),
                };
            } finally {
                isSubmitting.value = false;
            }
        };

        return {
            form,
            isSubmitting,
            submitStatus,
            submitForm,
            captchaCanvas,
            generateCaptcha,
            resetForm,
            timeOptions,
            handleGenderChange,
            handleTimeChange,
            handleDayChange,
            t
        };
    },
    template: /* html */ `
        <div 
            class="
            w-full max-w-lg mx-auto my-8 p-8 bg-white/40 dark:bg-dark-bg/40 rounded-2xl relative
            after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:rounded-2xl after:bg-[hsla(0_0%_100%_.6);] after:backdrop-blur-[30px] after:-z-[1]
            "
        >
            <h2 class="text-3xl font-bold text-center mb-8">{{ $t('Contact.title') }}</h2>

            <form @submit.prevent="submitForm" class="space-y-6">
                <!-- 姓名 -->
                <div>
                    <label for="name" class="block mb-2 font-medium">{{ $t('Contact.name') }} <span class="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        id="name" 
                        v-model="form.name" 
                        required 
                        :placeholder="$t('Contact.name_placeholder')"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                    >
                </div>

                <!-- 性別 -->
                <div>
                    <label class="block mb-2 font-medium">{{ $t('Contact.gender') }} <span class="text-gray-600 dark:text-gray-300 text-sm font-normal">{{ $t('Contact.optional') }}</span></label>
                    <div class="flex items-center gap-6">
                        <label class="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                :checked="form.gender === 'male'"
                                @change="handleGenderChange('male')"
                                class="w-4 h-4 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                            >
                            <span class="ml-2">{{ $t('Contact.male') }}</span>
                        </label>

                        <label class="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                :checked="form.gender === 'female'"
                                @change="handleGenderChange('female')"
                                class="w-4 h-4 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                            >
                            <span class="ml-2">{{ $t('Contact.female') }}</span>
                        </label>
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block mb-2 font-medium">{{ $t('Contact.email') }} <span class="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        id="email" 
                        v-model="form.email" 
                        required 
                        :placeholder="$t('Contact.email_placeholder')"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                    >
                </div>

                <!-- 手機號碼 (選填) -->
                <div>
                    <label for="phone" class="block mb-2 font-medium">
                        {{ $t('Contact.phone') }} <span class="text-gray-600 dark:text-gray-300 text-sm font-normal">{{ $t('Contact.optional') }}</span>
                    </label>
                    <input 
                        type="tel" 
                        id="phone" 
                        v-model="form.phone" 
                        :placeholder="$t('Contact.phone_placeholder')"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                    >
                </div>

                <!-- 方便聯絡時間 (新增) -->
                <div>
                    <label class="block mb-2 font-medium">{{ $t('Contact.time') }} <span class="text-gray-600 dark:text-gray-300 text-sm font-normal">{{ $t('Contact.time_hint') }}</span></label>
                    <div class="space-y-3">
                        <!-- 平日選項 -->
                        <div class="flex items-center flex-wrap gap-4">
                            <label class="flex items-center cursor-pointer min-w-[80px]">
                                <input 
                                    type="checkbox" 
                                    v-model="form.contactDay" 
                                    value="weekday"
                                    @change="handleDayChange('weekday')"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                >
                                <span class="ml-2">{{ $t('Contact.weekday') }}</span>
                            </label>
                            
                            <select 
                                v-model="form.weekdayTime"
                                @change="handleTimeChange('weekday')"
                                class="flex-1 min-w-[150px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 cursor-pointer"
                            >
                                <option value="" disabled selected>{{ $t('Contact.select_weekday') }}</option>
                                <option v-for="opt in timeOptions" :key="'wk-'+opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>
                        </div>

                        <!-- 週末選項 -->
                        <div class="flex items-center flex-wrap gap-4">
                            <label class="flex items-center cursor-pointer min-w-[80px]">
                                <input 
                                    type="checkbox" 
                                    v-model="form.contactDay" 
                                    value="weekend"
                                    @change="handleDayChange('weekend')"
                                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                                >
                                <span class="ml-2">{{ $t('Contact.weekend') }}</span>
                            </label>
                            
                            <select 
                                v-model="form.weekendTime"
                                @change="handleTimeChange('weekend')"
                                class="flex-1 min-w-[150px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 cursor-pointer"
                            >
                                <option value="" disabled selected>{{ $t('Contact.select_weekend') }}</option>
                                <option v-for="opt in timeOptions" :key="'wd-'+opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>


                <!-- 訊息 -->
                <div>
                    <label for="message" class="block mb-2 font-medium">{{ $t('Contact.message') }} <span class="text-red-500">*</span></label>
                    <textarea 
                        id="message" 
                        v-model="form.message" 
                        required 
                        rows="5"
                        :placeholder="$t('Contact.message_placeholder')"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                    ></textarea>
                </div>

                <!-- 圖形驗證碼 -->
                <div>
                    <label for="captcha" class="block mb-2 font-medium">{{ $t('Contact.captcha') }} <span class="text-red-500">*</span></label>
                    <div class="flex items-center gap-3">
                        <input 
                            type="text" 
                            id="captcha" 
                            v-model="form.captcha" 
                            required 
                            :placeholder="$t('Contact.captcha_placeholder')"
                            class="flex-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        >
                        <!-- 驗證碼畫布 -->
                        <canvas 
                            ref="captchaCanvas" 
                            width="120" 
                            height="42" 
                            class="cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                            :title="$t('Contact.refresh_captcha')"
                            @click="generateCaptcha"
                        ></canvas>
                        <!-- 刷新按鈕 (輔助) -->
                        <button 
                            type="button" 
                            @click="generateCaptcha"
                            class="p-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
                            :title="$t('Contact.refresh_tooltip')"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 狀態訊息 -->
                <div v-if="submitStatus.message" :class="[
                    'p-4 rounded-lg text-sm font-medium text-center',
                    submitStatus.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                ]">
                    {{ submitStatus.message }}
                </div>

                <!-- 按鈕 -->
                <button 
                    type="submit" 
                    :disabled="isSubmitting"
                    class="
                    w-full px-6 py-3 font-bold text-white bg-primary rounded-lg 
                    hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-200 
                    flex justify-center items-center gap-2
                    "
                >
                    <span v-if="isSubmitting" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    <span>{{ isSubmitting ? $t('Contact.submitting') : $t('Contact.submit') }}</span>
                </button>
            </form>
        </div>
    `,
};
