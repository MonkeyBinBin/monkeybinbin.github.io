<template>
  <section class="section">
    <div :class="isAosInit ? 'container aos-init' : 'container'" :data-aos="isAosInit ? 'fade-left' : undefined" :key="0" v-if="!errorMsg">
      <div class="row">
        <div class="col-12 article">
          <p class="article__date text-black-50 small mb-0" v-if="post && post.createDate">
            <font-awesome-icon :icon="['fas', 'calendar-alt']" />
            {{post.createDate|parseDatetime}}
          </p>
          <h2>{{post.title}}</h2>
          <p class="article__slug text-black-50 ml-4 my-0" v-if="post && post.slug">{{post.slug}}</p>
          <hr class="article__divider my-4 mx-0">
          <div v-if="post && post.articleContent" class="md-content" v-html="$options.filters.parseMd(post.articleContent)" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <hr />
          <div class="comments">
            <vue-disqus shortname="monkeybinbinblog" :identifier="id" :url="`https://monkeybinbin.github.io/article/${id}`"></vue-disqus>
          </div>
        </div>
      </div>
    </div>
    <div :class="isAosInit ? 'container aos-init' : 'container'" :data-aos="isAosInit ? 'fade-left' : undefined" :key="1" v-else>
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="not-found-title">404</h1>
          <p class="text-black-50">Oops, the page you're looking for doesn't exist.</p>
          <nuxt-link to="/" class="btn btn-dark">回首頁</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import constant from '~/constant'
import api from '~/services/api'

export default {
  name: 'Article',
  head () {
    const _head = {
      title: this.errorMsg || this.post.title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${constant.domain}${constant.baseUrl}article/${this.id}/` }
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
    const { params } = context
    const { id } = params
    return Promise.all([
      api.getArticleById(id)
    ]).then(([post]) => {
      // return data that should be available
      // in the template
      if (post && !post.message) {
        return {
          post,
          isAosInit: !process.server
        }
      } else {
        return {
          id,
          title: post.message,
          post: {},
          errorMsg: post.message
        }
      }
    })
  },
  data () {
    return {
      id: this.$route.params.id,
      errorMsg: '',
      post: {},
      isAosInit: true
    }
  },
  mounted () {
    this.getArticleById()

    this.$nextTick(function () {
      AOS.init()
    })
  },
  methods: {
    getArticleById: async function () {
      const post = await api.getArticleById(this.id)
      if (post && !post.message) {
        this.post = post
        // 載入codepen embed的js
        $.getScript('//assets.codepen.io/assets/embed/ei.js')
      } else {
        this.errorMsg = post.message
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.md-content {
  & /deep/ img {
    max-width: 100%;
  }
}
.not-found-title {
  font-size: 200px;
  color: #1dc8cd;
}
.article__date::after {
  content: '';
}
</style>
