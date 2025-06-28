<template>
  <section class="tech-section">
    <div
      ref="container"
      class="tech-container"
    >
      <div class="tech-header">
        <h1 class="tech-title">
          <span class="tech-accent">Blog</span> Articles
        </h1>
        <div class="tech-divider" />
        <p class="tech-subtitle">
          探索程式設計與技術領域的精選文章與心得分享
        </p>
      </div>

      <div class="tech-grid">
        <div
          v-for="(post, key) in validPosts"
          :key="post.id || key"
          class="tech-card-wrapper"
        >
          <div class="tech-card">
            <article-outline :post="post" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ArticleOutline from '~/components/ArticleOutline'
import api from '~/services/api'
import constant from '~/constant'
import { useAsyncData } from '#app'

const container = ref(null)

// 使用 useAsyncData 取得文章資料
const { data: posts, error } = await useAsyncData('posts', () => api().getArticles(constant.articleListMaxLimit))

// 過濾有效的文章資料
const validPosts = computed(() => {
  if (!posts.value) return []

  return posts.value.filter(post => {
    // 檢查 post 是否為有效物件且有必要的屬性
    const isValid = post &&
      typeof post === 'object' &&
      post.id &&
      typeof post.id === 'string' &&
      post.id.trim() &&
      post.title

    if (!isValid && process.dev) {
      console.warn('首頁發現無效的文章資料:', post)
    }

    return isValid
  })
})

// onMounted(() => {
//   inView(container.value, () => {
//     animate(
//       container.value,
//       { opacity: [0, 1], x: [-50, 0] },
//       { duration: 0.8, easing: 'ease-out' }
//     )
//   })
// })

if (error.value) throw new Error(error.value)
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.tech-section {
  position: relative;
  min-height: 100vh;
  background: #ffffff;
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
  animation: fadeInUp 0.8s ease-out forwards;
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
  -webkit-background-clip: text;
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
}

.tech-card-wrapper {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
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
    background-size: 100% 100%, 200% 200%;
    background-position: 0 0, -100% -100%;
    animation: shimmer 2s infinite;
    transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02);
    filter: brightness(1.05) saturate(1.1);
    overflow: hidden;

    &::before {
      opacity: 1;
      height: 3px;
      background: linear-gradient(90deg,
        $primary-color,
        $tertiary-color,
        $primary-color);
      background-size: 200% 100%;
      animation: gradientMove 1.5s infinite;
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
      background: linear-gradient(45deg,
        transparent,
        rgba(29, 200, 205, 0.1),
        transparent);
      background-size: 200% 200%;
      animation: borderGlow 2s infinite;
      pointer-events: none;
      z-index: -1;
    }
  }
}

// 動畫關鍵框架
@keyframes fadeInUp {
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
    background-position: 0 0, -100% -100%;
  }
  50% {
    background-position: 0 0, 100% 100%;
  }
  100% {
    background-position: 0 0, -100% -100%;
  }
}

@keyframes gradientMove {
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

@keyframes borderGlow {
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
  }

  .tech-card {
    padding: 24px;
    border-radius: 12px;
  }
}

// 為每個卡片設定不同的動畫延遲
.tech-card-wrapper:nth-child(1) { --index: 1; }
.tech-card-wrapper:nth-child(2) { --index: 2; }
.tech-card-wrapper:nth-child(3) { --index: 3; }
.tech-card-wrapper:nth-child(4) { --index: 4; }
.tech-card-wrapper:nth-child(5) { --index: 5; }
.tech-card-wrapper:nth-child(6) { --index: 6; }
.tech-card-wrapper:nth-child(7) { --index: 7; }
.tech-card-wrapper:nth-child(8) { --index: 8; }
.tech-card-wrapper:nth-child(9) { --index: 9; }
.tech-card-wrapper:nth-child(10) { --index: 10; }
</style>
