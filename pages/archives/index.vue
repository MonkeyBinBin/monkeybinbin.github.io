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
          <div class="section-header">
            <h3 class="section-title">
              文章列表
            </h3>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <div
            v-for="(monthPosts, key) in posts"
            :key="key"
            class="archieve-list"
          >
            <div class="archieve-list__category">
              <h5>
                <font-awesome-icon
                  class="mr-2"
                  :icon="['fas', 'calendar-alt']"
                />{{ key }}
              </h5>
            </div>
            <div
              v-for="(post, postKey) in monthPosts"
              :key="`post_${postKey}`"
              class="archieve-list__article"
            >
              <nuxt-link
                v-if="post && post.id && typeof post.id === 'string'"
                :to="'/article/'+post.id"
                :title="post.title"
              >
                <span>{{ post.title }}</span><span class="archieve-list__date">
                  [ {{ post.createDate }} ]
                </span>
              </nuxt-link>
              <span
                v-else
                class="text-muted"
              >
                {{ post?.title || 'Untitled' }} <span class="archieve-list__date">
                  [ {{ post?.createDate || 'Unknown date' }} ]
                </span>
              </span>
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
.archieve-list {
  padding-bottom: 10px;
  padding-top: 10px;

  &__category {
    padding-bottom: 5px;
  }

  &__article {
    a {
      @include link-animation($primary-color);

      color: $primary-color;

      &:hover {
        text-decoration: none;
      }
    }
  }

  &__date {
    font-size: small;
  }
}
</style>
