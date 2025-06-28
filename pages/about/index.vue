<template>
  <section class="section about-section">
    <motion-div
      v-motion="{
        initial: { opacity: 0, y: 20 },
        enter: { opacity: 1, y: 0, transition: { duration: 0.8 } },
      }"
      class="container"
    >
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <div class="tech-archive-header">
            <h1 class="tech-archive-title"><span class="tech-accent">關於</span> 我</h1>
            <div class="tech-divider" />
            <p class="tech-archive-subtitle">來自台灣的前端開發者，喜歡探索新技術與創作</p>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <div class="content-card">
            <p class="intro-text">
              資深網頁開發工程師，擁有多年前端開發經驗，熟悉各類框架與技術，擅長從需求分析到畫面實作的整合流程。工作之餘喜歡畫一些可愛風格的插圖，將美感與程式結合，創造有趣又實用的作品。我重視使用者體驗與程式碼品質，也樂於探索新工具來提升團隊效率。對於技術分享與協作充滿熱情，期望在專業領域中持續精進，也在創作中找到更多靈感與樂趣。
            </p>
            <section id="skills" class="container my-5">
              <h2 class="mb-4">專業技術能力</h2>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <strong>前端框架</strong>：熟悉
                  Angular、Vue.js、Nuxt、React，具備元件化設計與大型應用開發經驗
                </li>
                <li class="list-group-item">
                  <strong>語言與工具</strong>：精通 TypeScript、JavaScript，熟悉 HTML5 / CSS3 / SCSS
                </li>
                <li class="list-group-item">
                  <strong>跨平台開發</strong>：具備使用 C# 開發 Xamarin 應用、Electron 與 Cordova
                  打包混合式應用的經驗
                </li>
                <li class="list-group-item">
                  <strong>開發工具鏈</strong>：熟悉
                  Vite、Webpack、ESLint、Prettier，維持穩定開發流程與程式碼品質
                </li>
                <li class="list-group-item">
                  <strong>狀態管理</strong>：使用 Pinia、Vuex、Zustand 等工具處理複雜狀態邏輯
                </li>
                <li class="list-group-item">
                  <strong>API 串接與整合</strong>：具備 RESTful API
                  串接經驗，熟悉前後端資料流與錯誤處理設計
                </li>
                <li class="list-group-item">
                  <strong>Node.js 生態系</strong>：了解基本後端邏輯，可撰寫簡易 API 與工具程式
                </li>
                <li class="list-group-item">
                  <strong>版本控制與協作</strong>：熟練 Git 工作流程，善用 GitHub / GitLab
                  進行團隊協作
                </li>
                <li class="list-group-item">
                  <strong>自動化與部署</strong>：具備 CI/CD 基礎知識，可配合專案自動化流程部署
                </li>
                <li class="list-group-item">
                  <strong>UI/UX 概念</strong>：注重使用者體驗，能與設計師協作完成高品質的前端實作
                </li>
                <li class="list-group-item">
                  <strong>跨瀏覽器相容性</strong>：熟悉常見瀏覽器的差異與相容性處理技巧
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </motion-div>
  </section>
</template>

<script setup>
import { useHead } from 'nuxt/app';
import constant from '~/constant';

// 設定頁面標題和 meta 資訊
const title = `關於我 - ${constant.title}`;
const description = '來自台灣的前端開發者，喜歡探索新技術與創作，略懂多種程式語言和前端框架';

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    {
      property: 'og:url',
      content: `${constant.domain}${constant.baseUrl}about`,
    },
  ],
  link: [{ rel: 'canonical', href: `${constant.domain}${constant.baseUrl}about` }],
});
</script>

<style lang="scss" scoped>
.about-section {
  background-color: #fff;
  min-height: 80vh;
  padding: 60px 0;
  position: relative;

  // 背景科技感裝飾
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(29, 200, 205, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(29, 224, 153, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  .tech-archive-header {
    text-align: center;
    margin-bottom: 4rem;
    opacity: 0;
    animation: fade-in-up 0.8s ease-out forwards;
  }

  .tech-archive-title {
    font-size: 3.2rem;
    font-weight: 300;
    color: #2c3e50;
    margin-bottom: 20px;
    letter-spacing: -0.02em;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2.4rem;
    }
  }

  .tech-accent {
    background: linear-gradient(135deg, $primary-color, $tertiary-color);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
  }

  .tech-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, $primary-color, $tertiary-color);
    margin: 0 auto 30px;
    border-radius: 2px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(29, 200, 205, 0.3), transparent);
    }
  }

  .tech-archive-subtitle {
    color: #64748b;
    font-size: 1.1rem;
    font-weight: 400;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .content-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 3rem;
    position: relative;

    // 科技感邊框
    border: 1px solid rgba(29, 200, 205, 0.2);

    // 微妙陰影
    box-shadow:
      0 20px 40px rgba(29, 200, 205, 0.08),
      0 10px 20px rgba(29, 224, 153, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    // 內部光暈效果
    &::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      border-radius: 19px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
      pointer-events: none;
      opacity: 0.5;
    }

    &:hover {
      transform: translateY(-8px);
      box-shadow:
        0 30px 60px rgba(29, 200, 205, 0.12),
        0 15px 30px rgba(29, 224, 153, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border-color: rgba(29, 200, 205, 0.3);
    }

    .intro-text {
      font-size: 1.4rem;
      line-height: 1.8;
      color: #444;
      margin-bottom: 2rem;
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    .skills-text {
      font-size: 1.2rem;
      line-height: 1.7;
      color: #666;
      margin: 0;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(29, 200, 205, 0.04), rgba(29, 224, 153, 0.04));
      border-radius: 12px;
      border-left: 3px solid $primary-color;
      position: relative;

      // 微妙的內部光效
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(29, 200, 205, 0.06));
        border-radius: 0 12px 12px 0;
      }
    }
  }
}

// 動畫關鍵框架
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 響應式設計
@media (max-width: 768px) {
  .about-section {
    padding: 3rem 0;

    .tech-archive-header {
      margin-bottom: 3rem;

      .tech-archive-title {
        font-size: 2.4rem;
      }

      .tech-divider {
        width: 60px;
        height: 2px;
      }

      .tech-archive-subtitle {
        font-size: 1rem;
        padding: 0 1rem;
      }
    }

    .content-card {
      padding: 2rem;
      margin: 0 1rem;
      border-radius: 15px;

      .intro-text {
        font-size: 1.2rem;
      }

      .skills-text {
        font-size: 1.1rem;
        padding: 1rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .about-section {
    .tech-archive-header {
      .tech-archive-title {
        font-size: 2rem;
      }

      .tech-archive-subtitle {
        font-size: 0.95rem;
      }
    }
  }
}
</style>
