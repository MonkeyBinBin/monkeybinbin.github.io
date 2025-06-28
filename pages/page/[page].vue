<template>
  <section class="tech-section">
    <div ref="container" class="tech-container">
      <div class="tech-header">
        <h1 class="tech-title"><span class="tech-accent">Blog</span> Articles</h1>
        <div class="tech-divider" />
        <p class="tech-subtitle">探索程式設計與技術領域的精選文章與心得分享</p>
      </div>

      <div class="tech-grid">
        <div v-for="(post, key) in validPosts" :key="post.id || key" class="tech-card-wrapper">
          <div class="tech-card">
            <article-outline :post="post" />
          </div>
        </div>
      </div>

      <!-- 分頁導覽 -->
      <nav v-if="totalPages > 1" class="pagination-nav" aria-label="文章分頁導覽">
        <div class="pagination-wrapper">
          <!-- 上一頁 -->
          <NuxtLink
            v-if="currentPage > 1"
            :to="currentPage === 2 ? '/' : `/page/${currentPage - 1}`"
            class="pagination-link pagination-prev"
            aria-label="上一頁"
          >
            <i class="fas fa-chevron-left" />
            <span>上一頁</span>
          </NuxtLink>

          <!-- 頁碼 -->
          <div class="pagination-numbers">
            <!-- 第一頁 -->
            <NuxtLink
              v-if="showFirstPage"
              to="/"
              class="pagination-number"
              :class="{ active: currentPage === 1 }"
            >
              1
            </NuxtLink>

            <!-- 省略號 -->
            <span v-if="showFirstEllipsis" class="pagination-ellipsis">...</span>

            <!-- 中間頁碼 -->
            <NuxtLink
              v-for="page in visiblePages"
              :key="page"
              :to="page === 1 ? '/' : `/page/${page}`"
              class="pagination-number"
              :class="{ active: currentPage === page }"
            >
              {{ page }}
            </NuxtLink>

            <!-- 省略號 -->
            <span v-if="showLastEllipsis" class="pagination-ellipsis">...</span>

            <!-- 最後一頁 -->
            <NuxtLink
              v-if="showLastPage"
              :to="`/page/${totalPages}`"
              class="pagination-number"
              :class="{ active: currentPage === totalPages }"
            >
              {{ totalPages }}
            </NuxtLink>
          </div>

          <!-- 下一頁 -->
          <NuxtLink
            v-if="currentPage < totalPages"
            :to="`/page/${currentPage + 1}`"
            class="pagination-link pagination-next"
            aria-label="下一頁"
          >
            <span>下一頁</span>
            <i class="fas fa-chevron-right" />
          </NuxtLink>
        </div>

        <!-- 頁面資訊 -->
        <div class="pagination-info">
          第 {{ currentPage }} 頁，共 {{ totalPages }} 頁（總計 {{ postsData.total }} 篇文章）
        </div>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import ArticleOutline from '~/components/ArticleOutline';
import api from '~/services/api';
import config from '~/config';
import { useAsyncData, useRoute, createError } from '#app';

const route = useRoute();
const container = ref(null);

// 分頁設定
const POSTS_PER_PAGE = config.articleListMaxLimit;
const currentPage = computed(() => {
  const page = parseInt(route.params.page);
  return isNaN(page) || page < 1 ? 1 : page;
});

const skip = computed(() => (currentPage.value - 1) * POSTS_PER_PAGE);

// 使用 useAsyncData 取得文章資料
const { data: postsData, error } = await useAsyncData(`posts-page-${currentPage.value}`, () =>
  api().getArticles(POSTS_PER_PAGE, skip.value)
);

// 計算分頁資訊
const totalPages = computed(() => {
  if (!postsData.value || !postsData.value.total) return 1;
  return Math.ceil(postsData.value.total / POSTS_PER_PAGE);
});

// 過濾有效的文章資料
const validPosts = computed(() => {
  if (!postsData.value || !postsData.value.items) return [];

  return postsData.value.items.filter((post) => {
    const isValid =
      post &&
      typeof post === 'object' &&
      post.id &&
      typeof post.id === 'string' &&
      post.id.trim() &&
      post.title;

    if (!isValid && process.dev) {
      console.warn('分頁發現無效的文章資料:', post);
    }

    return isValid;
  });
});

// 分頁導覽計算
const visibleRange = 2; // 當前頁面前後顯示的頁數
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(2, currentPage.value - visibleRange);
  const end = Math.min(totalPages.value - 1, currentPage.value + visibleRange);

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages.value) {
      pages.push(i);
    }
  }
  return pages;
});

const showFirstPage = computed(() => currentPage.value > visibleRange + 1 || totalPages.value <= 5);
const showLastPage = computed(
  () => currentPage.value < totalPages.value - visibleRange || totalPages.value <= 5
);
const showFirstEllipsis = computed(() => currentPage.value > visibleRange + 2);
const showLastEllipsis = computed(() => currentPage.value < totalPages.value - visibleRange - 1);

// 檢查頁面是否有效
if (currentPage.value > totalPages.value && totalPages.value > 0) {
  throw createError({
    statusCode: 404,
    statusMessage: '頁面不存在',
  });
}

if (error.value) throw new Error(error.value);
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.tech-section {
  position: relative;
  min-height: 100vh;
  background: #fff;
  padding: 60px 0;
  overflow: hidden;
}

.tech-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
}

.tech-header {
  text-align: center;
  margin-bottom: 80px;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
}

.tech-title {
  font-size: 3.5rem;
  font-weight: 300;
  color: #2c3e50;
  margin-bottom: 20px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
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

.tech-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.tech-grid {
  display: grid;
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
  margin-bottom: 60px;
}

.tech-card-wrapper {
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
  animation-delay: calc(var(--index) * 0.1s);
}

.tech-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(29, 200, 205, 0.1);
  border-radius: 16px;
  padding: 40px;
  position: relative;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.03),
    0 0 0 1px rgba(255, 255, 255, 0.8);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, $primary-color, $tertiary-color);
    border-radius: 16px 16px 0 0;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow:
      0 20px 40px rgba(29, 200, 205, 0.25),
      0 0 30px rgba(29, 224, 153, 0.15),
      inset 0 0 20px rgba(255, 255, 255, 0.1),
      inset 0 0 0 1px rgba(29, 200, 205, 0.3);
    border-color: transparent;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(29, 200, 205, 0.05) 100%),
      linear-gradient(45deg, transparent 30%, rgba(29, 200, 205, 0.1) 50%, transparent 70%);
    background-size:
      100% 100%,
      200% 200%;
    background-position:
      0 0,
      -100% -100%;
    animation: shimmer 2s infinite;
    transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02);
    filter: brightness(1.05) saturate(1.1);
    overflow: hidden;

    &::before {
      opacity: 1;
      height: 3px;
      background: linear-gradient(90deg, $primary-color, $tertiary-color, $primary-color);
      background-size: 200% 100%;
      animation: gradient-move 1.5s infinite;
      box-shadow:
        0 0 15px rgba(29, 200, 205, 0.3),
        0 0 25px rgba(29, 224, 153, 0.15);
    }

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      right: 1px;
      bottom: 1px;
      border-radius: 15px;
      background: linear-gradient(45deg, transparent, rgba(29, 200, 205, 0.1), transparent);
      background-size: 200% 200%;
      animation: border-glow 2s infinite;
      pointer-events: none;
      z-index: -1;
    }
  }
}

// 分頁樣式
.pagination-nav {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(29, 200, 205, 0.2);
  border-radius: 8px;
  color: $primary-color;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: $primary-color;
    color: #fff;
    border-color: $primary-color;
    box-shadow: 0 4px 12px rgba(29, 200, 205, 0.3);
  }
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(29, 200, 205, 0.2);
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(29, 200, 205, 0.1);
    border-color: $primary-color;
    color: $primary-color;
  }

  &.active {
    background: $primary-color;
    border-color: $primary-color;
    color: #fff;
    box-shadow: 0 4px 12px rgba(29, 200, 205, 0.3);
  }
}

.pagination-ellipsis {
  padding: 0 8px;
  color: #64748b;
  font-weight: 500;
}

.pagination-info {
  color: #64748b;
  font-size: 0.9rem;
  text-align: center;
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

@keyframes shimmer {
  0% {
    background-position:
      0 0,
      -100% -100%;
  }

  50% {
    background-position:
      0 0,
      100% 100%;
  }

  100% {
    background-position:
      0 0,
      -100% -100%;
  }
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes border-glow {
  0% {
    background-position: 0% 50%;
    opacity: 0.3;
  }

  50% {
    background-position: 100% 50%;
    opacity: 0.8;
  }

  100% {
    background-position: 0% 50%;
    opacity: 0.3;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .tech-section {
    padding: 40px 0;
  }

  .tech-container {
    padding: 0 16px;
  }

  .tech-header {
    margin-bottom: 50px;
  }

  .tech-grid {
    gap: 24px;
    margin-bottom: 40px;
  }

  .tech-card {
    padding: 24px;
    border-radius: 12px;
  }

  .pagination-wrapper {
    gap: 4px;
  }

  .pagination-link {
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .pagination-number {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
}

// 為每個卡片設定不同的動畫延遲
.tech-card-wrapper:nth-child(1) {
  --index: 1;
}

.tech-card-wrapper:nth-child(2) {
  --index: 2;
}

.tech-card-wrapper:nth-child(3) {
  --index: 3;
}

.tech-card-wrapper:nth-child(4) {
  --index: 4;
}

.tech-card-wrapper:nth-child(5) {
  --index: 5;
}

.tech-card-wrapper:nth-child(6) {
  --index: 6;
}

.tech-card-wrapper:nth-child(7) {
  --index: 7;
}

.tech-card-wrapper:nth-child(8) {
  --index: 8;
}

.tech-card-wrapper:nth-child(9) {
  --index: 9;
}

.tech-card-wrapper:nth-child(10) {
  --index: 10;
}

.tech-card-wrapper:nth-child(11) {
  --index: 11;
}

.tech-card-wrapper:nth-child(12) {
  --index: 12;
}

.tech-card-wrapper:nth-child(13) {
  --index: 13;
}

.tech-card-wrapper:nth-child(14) {
  --index: 14;
}

.tech-card-wrapper:nth-child(15) {
  --index: 15;
}

.tech-card-wrapper:nth-child(16) {
  --index: 16;
}

.tech-card-wrapper:nth-child(17) {
  --index: 17;
}

.tech-card-wrapper:nth-child(18) {
  --index: 18;
}

.tech-card-wrapper:nth-child(19) {
  --index: 19;
}

.tech-card-wrapper:nth-child(20) {
  --index: 20;
}
</style>
