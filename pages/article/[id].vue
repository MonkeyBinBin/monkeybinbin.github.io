<template>
  <section class="section">
    <div
      ref="container"
      class="container"
    >
      <div class="row">
        <div class="col-12">
          <article-outline
            :post="post"
            :is-show-more="false"
          />
          <div
            v-if="post && post.articleContent"
            class="md-content"
            v-html="parsedContent"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <hr>
          <div class="comments">
            <ClientOnly>
              <Disqus :page-config="pageConfig" />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useAsyncData, useError } from 'nuxt/app'
import { animate, inView } from 'motion'
import { marked, Renderer } from 'marked'
import highlightjs from 'highlight.js'
import api from '~/services/api'
import ArticleOutline from '~/components/ArticleOutline'
import pathHelper from '~/helpers/path'

// 設定 marked 渲染器
const renderer = new Renderer()
renderer.link = (token) => {
  // 從 token 物件中取得連結資訊
  const { href, title, text } = token
  // 安全檢查 title 參數，避免顯示 undefined
  const safeTitle = title && typeof title === 'string' && title !== 'undefined' && title !== 'null' && title.trim()
  const titleAttr = safeTitle ? ` title="${safeTitle}"` : ''
  return `<a target="_blank" href="${href}"${titleAttr}>${text}</a>`
}
// 暫時移除 table 自訂渲染器，使用預設的
// renderer.table = (token) => {
//   const { header, rows } = token
//   return `<table class="table table-striped">${header}${rows}</table>`
// }

marked.setOptions({
  renderer,
  baseUrl: pathHelper.getBaseUrl(),
  highlight: function (code, language) {
    const validLang = !!(language && highlightjs.getLanguage(language))
    const highlighted = validLang ? highlightjs.highlight(language, code).value : code
    return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`
  }
})

const container = ref(null)
const route = useRoute()
const id = route.params.id

const { data } = await useAsyncData('article', async () => {
  const post = await api().getArticleById(id)
  if (!post || post.message) {
    throw useError({ statusCode: 404, message: post?.message || 'Not found' })
  }
  return { post }
})

const post = data.value?.post

// 計算處理後的 Markdown 內容
const parsedContent = computed(() => {
  if (!post?.articleContent) return ''
  return marked(post.articleContent)
})

// Disqus 頁面配置
const pageConfig = computed(() => ({
  url: `https://monkeybinbin.github.io/article/${id}`,
  identifier: `article-${id}`,
  title: post?.articleTitle || 'MonkeyBinBin Blog'
}))

onMounted(() => {
  inView(container.value, () => {
    animate(
      container.value,
      { opacity: [0, 1], x: [-50, 0] },
      { duration: 0.8, easing: 'ease-out' }
    )
  })
})
</script>

<style lang="scss" scoped>
.md-content {
  :deep(img) {
    max-width: 100%;
  }
}

.other-article-link {
  color: $primary-color;
}
</style>
