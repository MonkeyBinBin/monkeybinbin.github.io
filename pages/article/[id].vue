<template>
  <section class="tech-article-section">
    <div
      ref="container"
      class="tech-article-container"
    >
      <!-- 文章標題與資訊區域 -->
      <div class="tech-article-header">
        <article-outline
          :post="post"
          :is-show-more="false"
        />
      </div>

      <!-- 文章內容區域 -->
      <div class="tech-article-content">
        <div
          v-if="post && post.articleContent"
          class="markdown-content"
          v-html="parsedContent"
        />
      </div>

      <!-- 留言區域 -->
      <div class="tech-comments-section">
        <div class="tech-comments-header">
          <h2 class="tech-comments-title">
            <span class="tech-accent">討論</span> 與回饋
          </h2>
          <div class="tech-divider" />
        </div>
        <div class="tech-comments-wrapper">
          <ClientOnly>
            <Disqus :page-config="pageConfig" />
          </ClientOnly>
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
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.tech-article-section {
  position: relative;
  min-height: 100vh;
  background: #ffffff;
  padding: 60px 0;
  overflow: hidden;

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
}

.tech-article-container {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
}

.tech-article-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  border: 1px solid rgba(29, 200, 205, 0.1);
  box-shadow:
    0 10px 30px rgba(29, 200, 205, 0.08),
    0 4px 12px rgba(29, 224, 153, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  // 科技感邊框效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $primary-color, $tertiary-color);
    border-radius: 20px 20px 0 0;
  }

  // 入場動畫
  opacity: 0;
  animation: slideInFromTop 0.8s ease-out forwards;
}

.tech-article-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 50px;
  margin-bottom: 40px;
  border: 1px solid rgba(29, 200, 205, 0.1);
  box-shadow:
    0 10px 30px rgba(29, 200, 205, 0.08),
    0 4px 12px rgba(29, 224, 153, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  // 入場動畫
  opacity: 0;
  animation: slideInFromLeft 0.8s ease-out 0.2s forwards;
}

.markdown-content {
  color: #2c3e50;
  line-height: 1.8;
  font-size: 1.1rem;

  // 標題樣式
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    color: #2c3e50;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 1.2em;
      background: linear-gradient(135deg, $primary-color, $tertiary-color);
      border-radius: 2px;
    }
  }

  :deep(h1) {
    font-size: 2.2rem;
    margin-top: 0;
  }

  :deep(h2) {
    font-size: 1.8rem;
  }

  :deep(h3) {
    font-size: 1.5rem;
  }

  // 段落樣式
  :deep(p) {
    margin-bottom: 1.5rem;
    text-align: justify;
  }

  // 連結樣式
  :deep(a) {
    color: $primary-color;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, $primary-color, $tertiary-color);
      transition: width 0.3s ease;
    }

    &:hover {
      color: $tertiary-color;

      &::after {
        width: 100%;
      }
    }
  }

  // 程式碼區塊樣式
  :deep(pre) {
    background: #f8fafc;
    border: 1px solid rgba(29, 200, 205, 0.1);
    border-radius: 12px;
    padding: 24px;
    margin: 2rem 0;
    overflow-x: auto;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, $primary-color, $tertiary-color);
      border-radius: 12px 12px 0 0;
    }

    code {
      background: none;
      padding: 0;
      border: none;
      font-family: 'Fira Code', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }

  // 行內程式碼樣式
  :deep(code:not(pre code)) {
    background: rgba(29, 200, 205, 0.1);
    color: $primary-color;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Fira Code', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
    font-size: 0.9em;
    border: 1px solid rgba(29, 200, 205, 0.2);
  }

  // 引用區塊樣式
  :deep(blockquote) {
    background: linear-gradient(135deg, rgba(29, 200, 205, 0.05), rgba(29, 224, 153, 0.05));
    border-left: 4px solid $primary-color;
    padding: 20px 30px;
    margin: 2rem 0;
    border-radius: 0 12px 12px 0;
    position: relative;

    &::before {
      content: '"';
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 3rem;
      color: rgba(29, 200, 205, 0.3);
      font-family: serif;
    }

    p {
      margin: 0;
      color: #4a5568;
      font-style: italic;
    }
  }

  // 列表樣式
  :deep(ul), :deep(ol) {
    margin: 1.5rem 0;
    padding-left: 2rem;

    li {
      margin-bottom: 0.5rem;

      &::marker {
        color: $primary-color;
      }
    }
  }

  // 圖片樣式
  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  // 表格樣式
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th {
      background: linear-gradient(135deg, rgba(29, 200, 205, 0.1), rgba(29, 224, 153, 0.1));
      color: $primary-color;
      font-weight: 600;
    }

    tr:hover {
      background: rgba(29, 200, 205, 0.02);
    }
  }
}

.tech-comments-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(29, 200, 205, 0.1);
  box-shadow:
    0 10px 30px rgba(29, 200, 205, 0.08),
    0 4px 12px rgba(29, 224, 153, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  // 入場動畫
  opacity: 0;
  animation: slideInFromRight 0.8s ease-out 0.4s forwards;
}

.tech-comments-header {
  text-align: center;
  margin-bottom: 40px;
}

.tech-comments-title {
  font-size: 2rem;
  font-weight: 300;
  color: #2c3e50;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.tech-accent {
  background: linear-gradient(135deg, $primary-color, $tertiary-color);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.tech-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, $primary-color, $tertiary-color);
  margin: 0 auto;
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(29, 200, 205, 0.3), transparent);
  }
}

.tech-comments-wrapper {
  :deep(.disqus-container) {
    border-radius: 12px;
    overflow: hidden;
  }
}

// 動畫關鍵框架
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 響應式設計
@media (max-width: 768px) {
  .tech-article-section {
    padding: 40px 0;
  }

  .tech-article-container {
    padding: 0 16px;
  }

  .tech-article-header,
  .tech-article-content,
  .tech-comments-section {
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
  }

  .markdown-content {
    font-size: 1rem;

    :deep(h1) {
      font-size: 1.8rem;
    }

    :deep(h2) {
      font-size: 1.5rem;
    }

    :deep(h3) {
      font-size: 1.3rem;
    }

    :deep(pre) {
      padding: 16px;
      margin: 1.5rem 0;
    }

    :deep(blockquote) {
      padding: 16px 20px;
      margin: 1.5rem 0;
    }
  }

  .tech-comments-title {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .tech-article-header,
  .tech-article-content,
  .tech-comments-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .markdown-content {
    :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
      &::before {
        left: -12px;
        width: 3px;
      }
    }
  }
}
</style>
