<template>
  <section class="tech-archive-section">
    <motion-div
      v-motion="{
        initial: { opacity: 0, x: 40 },
        enter: { opacity: 1, x: 0, transition: { duration: 0.6 } }
      }"
      class="tech-archive-container"
    >
      <div class="tech-archive-header">
        <h1 class="tech-archive-title">
          <span class="tech-accent">文章</span> 列表
        </h1>
        <div class="tech-divider" />
        <p class="tech-archive-subtitle">
          依據建立時間排序的所有文章，探索知識的時光軌跡
        </p>
      </div>

      <div class="tech-archive-grid">
        <div
          v-for="(monthPosts, key) in posts"
          :key="key"
          class="tech-timeline-group"
        >
          <div class="tech-timeline-header">
            <div class="tech-timeline-marker">
              <font-awesome-icon
                :icon="['fas', 'calendar-alt']"
                class="tech-timeline-icon"
              />
            </div>
            <h3 class="tech-timeline-date">
              {{ key }}
            </h3>
            <div class="tech-timeline-line" />
          </div>

          <div class="tech-articles-container">
            <div
              v-for="(post, postKey) in monthPosts"
              :key="`post_${postKey}`"
              class="tech-article-card"
            >
              <nuxt-link
                v-if="post && post.id && typeof post.id === 'string'"
                :to="'/article/'+post.id"
                :title="post.title"
                class="tech-article-link"
              >
                <div class="tech-article-content">
                  <h4 class="tech-article-title">
                    {{ post.title }}
                  </h4>
                  <span class="tech-article-date">{{ post.createDate }}</span>
                </div>
                <div class="tech-article-arrow">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </div>
              </nuxt-link>
              <div
                v-else
                class="tech-article-invalid"
              >
                <div class="tech-article-content">
                  <h4 class="tech-article-title">
                    {{ post?.title || 'Untitled' }}
                  </h4>
                  <span class="tech-article-date">{{ post?.createDate || 'Unknown date' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion-div>
  </section>
</template>

<script setup>
import { useAsyncData, useError, useHead } from 'nuxt/app'
import apiModule from '~/services/api'
import constant from '~/constant'

// 取得文章資料
const { data } = await useAsyncData('archives', async () => {
  try {
    const api = apiModule()
    const posts = await api.getArticlesGroupByYearMonth()
    return { posts }
  } catch (error) {
    throw useError({ statusCode: 500, message: error.message || 'Failed to fetch articles' })
  }
})

const posts = data.value?.posts || []

// 設定頁面標題和 meta 資訊
const title = `所有文章列表 - ${constant.title}`
const description = '依據文章建立的時間，列出所有的文章連結，排列方式是利用文章建立的時間排序，由新到舊'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: `${constant.domain}${constant.baseUrl}archives` }
  ],
  link: [
    { rel: 'canonical', href: `${constant.domain}${constant.baseUrl}archives` }
  ]
})
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.tech-archive-section {
  position: relative;
  min-height: 100vh;
  padding: 60px 0;
  overflow: hidden;
}

.tech-archive-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
}

.tech-archive-header {
  text-align: center;
  margin-bottom: 80px;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
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

.tech-archive-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.tech-archive-grid {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.tech-timeline-group {
  position: relative;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: calc(var(--group-index) * 0.1s);
}

.tech-timeline-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.tech-timeline-marker {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, $primary-color, $tertiary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 25px rgba(29, 200, 205, 0.3),
    0 0 20px rgba(29, 224, 153, 0.2);
  position: relative;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid rgba(29, 200, 205, 0.2);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

.tech-timeline-icon {
  color: white;
  font-size: 1.2rem;
}

.tech-timeline-date {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0 20px;
  letter-spacing: -0.01em;
}

.tech-timeline-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(29, 200, 205, 0.3), transparent);
  margin-left: 20px;
  border-radius: 1px;
}

.tech-articles-container {
  display: grid;
  gap: 20px;
  padding-left: 70px;

  @media (max-width: 768px) {
    padding-left: 0;
    gap: 16px;
  }
}

.tech-article-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(29, 200, 205, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.02),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, $primary-color, $tertiary-color);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(29, 200, 205, 0.3);
    box-shadow:
      0 12px 30px rgba(29, 200, 205, 0.15),
      0 0 25px rgba(29, 224, 153, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.95);

    &::before {
      opacity: 1;
    }

    .tech-article-arrow {
      transform: translateX(5px);
      color: $primary-color;
    }
  }
}

.tech-article-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  min-height: 80px;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
}

.tech-article-invalid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  opacity: 0.6;
  min-height: 80px;
}

.tech-article-content {
  flex: 1;
}

.tech-article-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
  line-height: 1.4;
  transition: color 0.3s ease;

  .tech-article-link:hover & {
    color: $primary-color;
  }
}

.tech-article-date {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 400;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.tech-article-arrow {
  color: #94a3b8;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  margin-left: 16px;
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

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .tech-archive-section {
    padding: 60px 0;
  }

  .tech-archive-container {
    padding: 0 16px;
  }

  .tech-archive-header {
    margin-bottom: 60px;
  }

  .tech-archive-grid {
    gap: 40px;
  }

  .tech-timeline-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .tech-timeline-marker {
    width: 40px;
    height: 40px;
  }

  .tech-timeline-date {
    font-size: 1.5rem;
    margin: 0;
  }

  .tech-timeline-line {
    display: none;
  }

  .tech-article-link,
  .tech-article-invalid {
    padding: 20px;
    min-height: 70px;
  }

  .tech-article-title {
    font-size: 1.1rem;
  }

  .tech-article-date {
    font-size: 0.85rem;
  }
}

// 為每個時間軸群組設定不同的動畫延遲
.tech-timeline-group:nth-child(1) { --group-index: 1; }
.tech-timeline-group:nth-child(2) { --group-index: 2; }
.tech-timeline-group:nth-child(3) { --group-index: 3; }
.tech-timeline-group:nth-child(4) { --group-index: 4; }
.tech-timeline-group:nth-child(5) { --group-index: 5; }
.tech-timeline-group:nth-child(6) { --group-index: 6; }
.tech-timeline-group:nth-child(7) { --group-index: 7; }
.tech-timeline-group:nth-child(8) { --group-index: 8; }
.tech-timeline-group:nth-child(9) { --group-index: 9; }
.tech-timeline-group:nth-child(10) { --group-index: 10; }
</style>
