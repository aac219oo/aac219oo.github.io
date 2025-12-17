import { onMounted, onUnmounted } from 'vue';

const HW100220929 = {
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
                href: '/assets/css/brand.css',
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
        });

        onUnmounted(() => {
            resources.forEach((res) => {
                const el = document.getElementById(res.id);
                if (el) {
                    el.remove(); // 從 DOM 中移除樣式與腳本
                }
            });
        });
    },
    template: /*html*/ `
    <!-- 產品展示區塊 -->
    <div class="container my-4">
      <div class="row">
        <!-- 第一張卡片 -->
        <div class="col-12 col-sm-6 col-md-4 mb-4">
          <div class="card h-100">
            <img src="./assets/images/projects/electric-2.jpg" class="card-img-top" alt="產品A">
            <div class="card-body">
              <h5 class="card-title">產品A</h5>
              <p class="card-text">這是產品A的描述。</p>
              <router-link to="/Projects/electric" class="btn btn-primary">了解更多</router-link>
            </div>
          </div>
        </div>
        <!-- 第二張卡片 -->
        <div class="col-12 col-sm-6 col-md-4 mb-4">
          <div class="card h-100">
            <img src="./assets/images/projects/new-taipei-park.png" class="card-img-top" alt="產品B">
            <div class="card-body">
              <h5 class="card-title">產品B</h5>
              <p class="card-text">這是產品B的描述。</p>
              <router-link to="/Projects/new-taipei-park" class="btn btn-primary">了解更多</router-link>
            </div>
          </div>
        </div>
        <!-- 第三張卡片 -->
        <div class="col-12 col-sm-12 col-md-4 mb-4">
          <div class="card h-100">
            <img src="./assets/images/projects/scbooks-4.jpeg" class="card-img-top" alt="產品C">
            <div class="card-body">
              <h5 class="card-title">產品C</h5>
              <p class="card-text">這是產品C的描述。</p>
              <router-link to="/Projects/scbooks" class="btn btn-primary">了解更多</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
};

export default HW100220929;
