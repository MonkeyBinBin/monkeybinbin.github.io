<template>
  <section class="section">
    <div class="container">
      <div :class="isAosInit ? 'row justify-content-center aos-init' : 'row justify-content-center'" :data-aos="isAosInit ? 'fade-left' : undefined" v-for="(post, key) in posts" :key="key">
        <div class="col-sm-10 col-md-8">
          <article-item :post="post" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import ArticleItem from '~/components/ArticleItem'
import api from '../services/api'

export default {
  components: {
    ArticleItem
  },
  data () {
    return {
      posts: [],
      isAosInit: true
    }
  },
  async asyncData ({ params }) {
    // server render
    let resultData
    if (process.server) {
      const posts = await import('~/static/posts/list.json')
      resultData = {
        posts
      }
    } else {
      resultData = {}
    }
    return {
      ...resultData,
      isAosInit: !process.server
    }
  },
  async mounted () {
    const posts = await api.getArticles()
    this.posts = posts

    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>
