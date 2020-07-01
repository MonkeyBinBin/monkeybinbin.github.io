<template>
  <section class="section">
    <div
      class="container aos-init"
      data-aos="fade-left"
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
                :to="'/article/'+post.id"
                :title="post.title"
              >
                <span>{{ post.title }}</span><span class="archieve-list__date">
                  [ {{ post.createDate }} ]
                </span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import api from '~/services/api'
import constant from '~/constant'

export default {
  name: 'Archives',
  async asyncData ({ params, error }) {
    return Promise.all([
      api.getArticlesGroupByYearMonth()
    ]).then(([posts]) => {
      return {
        posts
      }
    }).catch(reason => {
      error({ message: reason })
    })
  },
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  },
  head () {
    const title = `所有文章列表 - ${constant.title}`
    const description = '依據文章建立的時間，列出所有的文章連結，排列方式是利用文章建立的時間排序，由新到舊'
    const head = {
      title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${constant.domain}${constant.baseUrl}archives` },
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'description', property: 'description', content: description },
        { hid: 'og:description', property: 'og:description', content: description }
      ]
    }
    return head
  }
}
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
