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
        class="row justify-content-center"
      >
        <div class="col-sm-10 col-md-8">
          <article-outline
            :post="post"
            :marked-tag="tagName"
          />
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
