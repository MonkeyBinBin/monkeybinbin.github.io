<template>
  <section class="section">
    <motion-div
      v-motion="{
        initial: { opacity: 0, x: 40 },
        enter: { opacity: 1, x: 0, transition: { duration: 0.6 } }
      }"
      class="container"
    >
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <h1 class="mb-5">
            Posts tagged with "{{ tagName }}"
          </h1>
        </div>
      </div>
      <div
        v-for="(post, key) in validPosts"
        :key="post.id || key"
        class="row justify-content-center mb-4"
      >
        <div class="col-sm-10 col-md-8">
          <div class="tech-card">
            <article-outline
              :post="post"
              :marked-tag="tagName"
            />
          </div>
        </div>
      </div>
    </motion-div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useAsyncData, useError, useHead } from 'nuxt/app'
import ArticleOutline from '~/components/ArticleOutline'
import constant from '~/constant'
import api from '~/services/api'

const route = useRoute()
const tagName = route.params.tag

// 驗證 tag 參數
if (!tagName) {
  throw useError({ statusCode: 404, message: 'Tag parameter is required' })
}

// 取得文章資料
const { data } = await useAsyncData('articles-by-tag', async () => {
  try {
    const posts = await api().getArticlesWithTag(tagName)
    return { posts, tagName }
  } catch (error) {
    throw useError({ statusCode: 500, message: error.message || 'Failed to fetch articles' })
  }
})

const posts = data.value?.posts || []

// 過濾有效的文章資料
const validPosts = computed(() => {
  return posts.filter(post => {
    // 檢查 post 是否為有效物件且有必要的屬性
    const isValid = post &&
      typeof post === 'object' &&
      post.id &&
      typeof post.id === 'string' &&
      post.id.trim() &&
      post.title

    if (!isValid && process.dev) {
      console.warn(`標籤頁面 "${tagName}" 發現無效的文章資料:`, post)
    }

    return isValid
  })
})

// 設定頁面標題和 meta 資訊
const title = `${tagName} 相關文章 - ${constant.title}`
const description = `所有與 ${tagName} 主題相關的文章`

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: `${constant.domain}${constant.baseUrl}tag/${tagName}` },
    { name: 'keywords', content: [...constant.keywords, `${tagName} 相關文章`].join(',') }
  ],
  link: [
    { rel: 'canonical', href: `${constant.domain}${constant.baseUrl}tag/${tagName}` }
  ]
})
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.section {
  padding: 2rem 0;
  min-height: 100vh;
}

.tech-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary-color, $tertiary-color);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 16px 64px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }
  }
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, $primary-color, $tertiary-color);
    border-radius: 2px;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .section {
    padding: 1rem 0;
  }

  .tech-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 576px) {
  .tech-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }
}
</style>
