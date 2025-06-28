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

      <!-- 分頁導覽 -->
      <div
        v-if="totalPages > 1"
        class="row justify-content-center mt-5"
      >
        <div class="col-sm-10 col-md-8">
          <nav
            class="pagination-nav"
            aria-label="標籤文章分頁導覽"
          >
            <div class="pagination-wrapper">
              <!-- 上一頁 -->
              <NuxtLink
                v-if="currentPage > 1"
                :to="currentPage === 2 ? `/tag/${tagName}` : `/tag/${tagName}/${currentPage - 1}`"
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
                  :to="`/tag/${tagName}`"
                  class="pagination-number"
                  :class="{ active: currentPage === 1 }"
                >
                  1
                </NuxtLink>

                <!-- 省略號 -->
                <span
                  v-if="showFirstEllipsis"
                  class="pagination-ellipsis"
                >...</span>

                <!-- 中間頁碼 -->
                <NuxtLink
                  v-for="page in visiblePages"
                  :key="page"
                  :to="page === 1 ? `/tag/${tagName}` : `/tag/${tagName}/${page}`"
                  class="pagination-number"
                  :class="{ active: currentPage === page }"
                >
                  {{ page }}
                </NuxtLink>

                <!-- 省略號 -->
                <span
                  v-if="showLastEllipsis"
                  class="pagination-ellipsis"
                >...</span>

                <!-- 最後一頁 -->
                <NuxtLink
                  v-if="showLastPage"
                  :to="`/tag/${tagName}/${totalPages}`"
                  class="pagination-number"
                  :class="{ active: currentPage === totalPages }"
                >
                  {{ totalPages }}
                </NuxtLink>
              </div>

              <!-- 下一頁 -->
              <NuxtLink
                v-if="currentPage < totalPages"
                :to="`/tag/${tagName}/${currentPage + 1}`"
                class="pagination-link pagination-next"
                aria-label="下一頁"
              >
                <span>下一頁</span>
                <i class="fas fa-chevron-right" />
              </NuxtLink>
            </div>

            <!-- 頁面資訊 -->
            <div class="pagination-info">
              第 {{ currentPage }} 頁，共 {{ totalPages }} 頁（總計 {{ postsData.total }} 篇 "{{ tagName }}" 相關文章）
            </div>
          </nav>
        </div>
      </div>
    </motion-div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useAsyncData, useError, useHead } from 'nuxt/app'
import ArticleOutline from '~/components/ArticleOutline'
import config from '~/config'
import constant from '~/constant'
import api from '~/services/api'

const route = useRoute()
const tagName = route.params.tag

// 驗證 tag 參數
if (!tagName) {
  throw useError({ statusCode: 404, message: 'Tag parameter is required' })
}

// 分頁設定 - 使用動態路由參數
const POSTS_PER_PAGE = config.articleListMaxLimit
const currentPage = computed(() => {
  // 使用路徑參數，如果沒有頁碼參數則預設為第 1 頁
  const page = parseInt(route.params.page) || 1
  return isNaN(page) || page < 1 ? 1 : page
})

const skip = computed(() => (currentPage.value - 1) * POSTS_PER_PAGE)

// 取得文章資料
const { data } = await useAsyncData(`articles-by-tag-${tagName}-page-${currentPage.value}`, async () => {
  try {
    const postsData = await api().getArticlesWithTag(tagName, POSTS_PER_PAGE, skip.value)
    return { postsData, tagName }
  } catch (error) {
    throw useError({ statusCode: 500, message: error.message || 'Failed to fetch articles' })
  }
})

const postsData = data.value?.postsData || { items: [], total: 0 }
const posts = postsData.items || []

// 計算分頁資訊
const totalPages = computed(() => {
  if (!postsData.total) return 1
  return Math.ceil(postsData.total / POSTS_PER_PAGE)
})

// 檢查頁面是否有效
if (currentPage.value > totalPages.value && totalPages.value > 0) {
  throw useError({
    statusCode: 404,
    statusMessage: `標籤 "${tagName}" 的第 ${currentPage.value} 頁不存在`
  })
}

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

// 分頁導覽計算
const visibleRange = 2
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(2, currentPage.value - visibleRange)
  const end = Math.min(totalPages.value - 1, currentPage.value + visibleRange)

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages.value) {
      pages.push(i)
    }
  }
  return pages
})

const showFirstPage = computed(() => currentPage.value > visibleRange + 1 || totalPages.value <= 5)
const showLastPage = computed(() => currentPage.value < totalPages.value - visibleRange || totalPages.value <= 5)
const showFirstEllipsis = computed(() => currentPage.value > visibleRange + 2)
const showLastEllipsis = computed(() => currentPage.value < totalPages.value - visibleRange - 1)

// 設定頁面標題和 meta 資訊
const title = computed(() => {
  const pageInfo = currentPage.value > 1 ? ` - 第 ${currentPage.value} 頁` : ''
  return `${tagName} 相關文章${pageInfo} - ${constant.title}`
})
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
    color: white;
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
    color: white;
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

@media (max-width: 576px) {
  .tech-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .pagination-nav {
    margin-top: 2rem;
    padding: 1rem 0;
  }

  .pagination-number {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
}
</style>
