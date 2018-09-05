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
          <div class="comments">
            <vue-disqus shortname="your_shortname_disqus"></vue-disqus>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import axios from 'axios'
export default {
  name: 'Article',
  data () {
    return {
      id: this.$route.params.id,
      errorMsg: '',
      mdContent: '',
      articleInfo: {}
    }
  },
  mounted () {
    this.getArticleInfo()
  },
  methods: {
    getArticleInfo: async function () {
      const articleId = this.id
      await axios.get(`/posts/list.json`)
        .then(res => {
          const posts = res.data
          this.articleInfo = _.find(posts, function (o) { return o.id === articleId })
          if (this.articleInfo && this.articleInfo.id) {
            this.getArticleContent()
          }
        })
        .catch(() => {
          this.errorMsg = '無法取得文章。'
        })
    },
    getArticleContent: async function () {
      await axios.get(`/posts/${this.id}/content.md`)
        .then(res => {
          this.mdContent = res.data
          // 載入codepen embed的js
          $.getScript('//assets.codepen.io/assets/embed/ei.js')
        })
        .catch(() => {
          this.errorMsg = '無法取得文章。'
        })
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
