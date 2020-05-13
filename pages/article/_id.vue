<template>
  <section class="section">
    <div
      class="container aos-init"
      data-aos="fade-left"
    >
      <div class="row">
        <div class="col-12">
          <article-outline :post="post" :is-show-more="false" />
          <div
            v-if="post && post.articleContent"
            class="md-content"
            v-html="$options.filters.parseMd(post.articleContent)"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <nuxt-link
            v-if="!!prevPost"
            :to="'/article/'+prevPost.id"
            class="other_article_link"
          >
            <div class="d-flex justify-content-start align-items-center">
              <font-awesome-icon
                class="fa-2x mr-1"
                :icon="['fas', 'arrow-alt-circle-left']"
              />
              <span>{{prevPost.title}}</span>
            </div>
          </nuxt-link>
        </div>
        <div class="col-6">
          <nuxt-link
            v-if="!!nextPost"
            :to="'/article/'+nextPost.id"
            class="other_article_link"
          >
            <div class="d-flex justify-content-end align-items-center">
              <span class="text-right">{{nextPost.title}}</span>
              <font-awesome-icon
                class="fa-2x ml-1"
                :icon="['fas', 'arrow-alt-circle-right']"
              />
            </div>
          </nuxt-link>
        </div>
        <div class="col-12">
          <hr />
          <div class="comments">
            <vue-disqus
              shortname="monkeybinbinblog"
              :identifier="id"
              :url="`https://monkeybinbin.github.io/article/${id}`"
            ></vue-disqus>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import constant from '~/constant'
import api from '~/services/api'
import ArticleOutline from '~/components/ArticleOutline'

export default {
  name: 'Article',
  components: {
    ArticleOutline
  },
  head () {
    const _head = {
      title: this.post.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${constant.domain}${constant.baseUrl}article/${this.id}/` }
      ],
      script: [
        { src: '//assets.codepen.io/assets/embed/ei.js' }
      ]
    }
    if (this.post && this.post.tags) {
      _head.meta.push({ hid: 'keywords', name: 'keywords', content: this.post.tags.join() })
    }
    if (this.post && this.post.slug) {
      _head.meta.push({ hid: 'description', property: 'description', content: this.post.slug })
      _head.meta.push({ hid: 'og:description', property: 'og:description', content: this.post.slug })
    }
    if (this.post && this.post.title) {
      _head.meta.push({ hid: 'og:title', property: 'og:title', content: this.post.title })
    }
    return _head
  },
  async asyncData (context) {
    const { params, error } = context
    const { id } = params
    return Promise.all([
      api.getArticleById(id)
    ]).then(async ([post]) => {
      // return data that should be available
      // in the template
      if (post && !post.message) {
        const [prevPost, nextPost] = await api.getPrevAndNextArticleById(post.id, post.createDate)
        return {
          id,
          post,
          prevPost,
          nextPost
        }
      } else {
        error({ statusCode: 404, message: post.message })
      }
    })
  },
  data () {
    return {
      id: '',
      post: {},
      prevPost: undefined,
      nextPost: undefined
    }
  },
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>

<style lang="scss" scoped>
.md-content {
  & /deep/ img {
    max-width: 100%;
  }
}
.article__date::after {
  content: "";
}
.other_article_link {
  color: $primary-color;
}
</style>
