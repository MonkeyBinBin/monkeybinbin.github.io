<template>
  <section class="section">
    <div class="container aos-init" data-aos="fade-left" :key="0" v-if="articleInfo && articleInfo.id">
      <div class="row">
        <div class="col-12">
          <p class="text-black-50 small mb-0" v-if="articleInfo && articleInfo.createDate">{{articleInfo.createDate|parseDatetime}}</p>
          <h2>{{articleInfo.title}}</h2>
          <p class="text-black-50 ml-4 my-0" v-if="articleInfo && articleInfo.slug">{{articleInfo.slug}}</p>
          <hr class="article-divider my-4 mx-0">
          <div class="md-content" v-html="$options.filters.parseMd(mdContent)" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <hr />
          <div class="comments">
            <vue-disqus shortname="monkeybinbinblog"></vue-disqus>
          </div>
        </div>
      </div>
    </div>
    <div class="container aos-init" data-aos="fade-left" :key="1" v-else>
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
import constant from '../../constant'
import api from '../../services/api'

export default {
  name: 'Article',
  head () {
    const _head = {
      title: this.title,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.keywords.join() },
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:url', property: 'og:url', content: `${constant.domain}${constant.baseUrl}article/${this.id}/` },
        { hid: 'og:title', property: 'og:title', content: this.title }
      ]
    }
    if (this.description) {
      _head.meta.push({ hid: 'og:description', property: 'og:description', content: this.description })
    }
    return _head
  },
  async asyncData (context) {
    const { params } = context
    const { id } = params
    const posts = await import('~/static/posts/list.json')
    const post = _.find(posts, function (o) { return o.id === id })
    const keywords = [...constant.keywords]
    if (post) {
      keywords.push(post.tags)
    }

    let mdContent = ''
    if (post && process.server) {
      mdContent = await import(`~/static/posts/${id}/content.md`)
    }
    return {
      id,
      title: `${constant.title}-${post ? post.title : 'Page Not found!'}`,
      description: post && post.slug,
      keywords,
      articleInfo: post || {},
      mdContent: mdContent
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      errorMsg: '',
      articleInfo: {},
      mdContent: ''
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
      const [info, content] = await api.getArticleById(this.id)
      if (info.data && content.data) {
        this.articleInfo = info.data
        this.mdContent = content.data
        // 載入codepen embed的js
        $.getScript('//assets.codepen.io/assets/embed/ei.js')
      } else {
        this.errorMsg = info.message || content.message
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
</style>
