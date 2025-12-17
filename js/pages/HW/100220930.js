import { onMounted, onUnmounted } from 'vue';

export default {
    name: 'HW100220930',
    setup() {
        const resources = [
            {
                id: 'bootstrap-css',
                type: 'link',
                href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
            },
            {
                id: 'bootstrap-js',
                type: 'script',
                src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
            },
            {
                id: 'contact-css',
                type: 'link',
                href: '/assets/css/contact.css',
            },
        ];
        onMounted(() => {
            // 動態引入 Bootstrap 5 CSS
            resources.forEach((res) => {
                if (!document.getElementById(res.id)) {
                    const el = document.createElement(res.type);
                    el.id = res.id;
                    if (res.type === 'link') {
                        el.rel = 'stylesheet';
                        el.href = res.href;
                    } else {
                        el.src = res.src;
                    }
                    document.head.appendChild(el);
                }
            });

            // 2. 監控 Modal 事件以調整 Header z-index
            const myModalEl = document.getElementById('contactModal');
            const headerEl = document.querySelector('header'); // 假設您的標籤是 <header>

            if (myModalEl && headerEl) {
                // 當 Modal 開始顯示時
                myModalEl.addEventListener('show.bs.modal', () => {
                    headerEl.classList.remove('z-999');
                    headerEl.classList.add('z-0');
                });

                // 當 Modal 完全隱藏後
                myModalEl.addEventListener('hidden.bs.modal', () => {
                    headerEl.classList.remove('z-0');
                    headerEl.classList.add('z-999');
                });
            }

            onUnmounted(() => {
                resources.forEach((res) => {
                    const el = document.getElementById(res.id);
                    if (el) {
                        el.remove(); // 從 DOM 中移除樣式與腳本
                    }
                });

                // 確保 Header 恢復原狀，避免 Modal 開啟時切換到一半就離開頁面
                const headerEl = document.querySelector('header');
                if (headerEl) {
                    headerEl.classList.remove('z-0');
                    headerEl.classList.add('z-999');
                }
            });
        });
    },
    template: /*html*/ `
    <div class="container py-5">
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#contactModal">
        聯絡我們
      </button>
      <!-- Modal -->
      <div class="modal fade" id="contactModal" data-bs-backdrop="false" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header d-flex justify-content-center align-items-center" style="height: 60px;">
              <h5 class="modal-title w-100 text-center" id="contactModalLabel">聯絡我們</h5>
              <button type="button" class="btn-close position-absolute end-0 me-3" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="name" class="form-label">姓名</label>
                  <input type="text" class="form-control" id="name" placeholder="請輸入姓名">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">電子郵件</label>
                  <input type="email" class="form-control" id="email" placeholder="請輸入電子郵件">
                </div>
                <div class="mb-3">
                  <label for="message" class="form-label">訊息</label>
                  <textarea class="form-control" id="message" rows="3" placeholder="請輸入訊息"></textarea>
                </div>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">送出</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
