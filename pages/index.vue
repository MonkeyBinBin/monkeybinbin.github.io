<template>
  <section class="section">
    <div
      ref="container"
      class="container"
    >
      <div
        v-for="(post, key) in validPosts"
        :key="post.id || key"
        class="row justify-content-center"
      >
        <div class="col-sm-10 col-md-8">
          <article-outline :post="post" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { animate, inView } from 'motion'
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

onMounted(() => {
  inView(container.value, () => {
    animate(
      container.value,
      { opacity: [0, 1], x: [-50, 0] },
      { duration: 0.8, easing: 'ease-out' }
    )
  })
})

if (error.value) throw new Error(error.value)
</script>
