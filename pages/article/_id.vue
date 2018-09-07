<template>
  <section class="section">
    <div class="container aos-init" data-aos="fade-left">
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
  </section>
</template>

<script>
import AOS from 'aos'
import constant from '../../constant'
import api from '../../services/api'

export default {
  name: 'Article',
  head () {
    
    return {
      title: this.title,
      meta: [
        { hid: 'keywords', name: 'keywords', content: this.keywords.join() },
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:description', property: 'og:description', content: this.description }
      ]
    }
  },
  async asyncData (context) {
    const { params } = context
    const { id } = params
    const posts = await import('~/static/posts/list.json')
    const post = _.find(posts, function (o) { return o.id === id })
    const mdContent = await import(`~/static/posts/${id}/content.md`)
    const keywords = [...constant.keywords, ...post.tags]
    return {
      title: `${constant.title}-${post.title}`,
      description: post.slug,
      keywords,
      articleInfo: post,
      mdContent: process.server ? mdContent : ''
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
  },
  updated: function () {
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
</style>
