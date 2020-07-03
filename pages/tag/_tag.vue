<template>
  <section class="section">
    <div
      class="container aos-init"
      data-aos="fade-left"
    >
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <h1 class="mb-5">
            Posts tagged with "{{ tagName }}"
          </h1>
        </div>
      </div>
      <div
        v-for="(post, key) in posts"
        :key="key"
        class="row justify-content-center"
      >
        <div class="col-sm-10 col-md-8">
          <article-outline
            :post="post"
            :marked-tag="tagName"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import ArticleOutline from '~/components/ArticleOutline'
import constant from '~/constant'
import api from '~/services/api'

export default {
  name: 'Tag',
  components: {
    ArticleOutline
  },
  asyncData ({ params, error }) {
    return Promise.all([
      api.getArticlesWithTag(params.tag)
    ]).then(([posts]) => {
      return {
        tagName: params.tag,
        posts
      }
    }).catch(reason => {
      error({ message: reason })
    })
  },
  data () {
    return {
      tagName: '',
      posts: []
    }
  },
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  },
  head () {
    const title = `${this.tagName} 相關文章 - ${constant.title}`
    const description = `所有與 ${this.tagName} 主題相關的文章`
    const head = {
      title,
      meta: [
        { hid: 'og:url', property: 'og:url', content: `${constant.domain}${constant.baseUrl}tag/${this.tagName}` },
        { hid: 'description', property: 'description', content: description },
        { hid: 'og:description', property: 'og:description', content: description },
        { hid: 'og:title', property: 'og:title', content: title }
      ],
      link: [
        { hid: 'canonical', rel: 'canonical', href: `${constant.domain}${constant.baseUrl}tag/${this.tagName}` }
      ]
    }
    if (this.posts && this.posts.length > 0) {
      const keywords = [...constant.keywords, `${this.tagName} 相關文章`]
      head.meta.push({ hid: 'keywords', name: 'keywords', content: [...new Set(keywords)].join() })
    }
    return head
  },
  validate ({ params }) {
    return !!params.tag
  }
}
</script>
