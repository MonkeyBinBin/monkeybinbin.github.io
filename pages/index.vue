<template>
  <section class="section">
    <div class="container">
      <div
        :class="isAosInit ? 'row justify-content-center aos-init' : 'row justify-content-center'"
        :data-aos="isAosInit ? 'fade-left' : undefined"
        v-for="(post, key) in posts"
        :key="key"
      >
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
import api from '~/services/api'

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
  asyncData () {
    return Promise.all([
      // fetch all blog posts sorted by creation date
      api.getArticles()
    ]).then(([posts]) => {
      // return data that should be available
      // in the template
      return {
        posts,
        isAosInit: !process.server
      }
    }).catch(console.error)
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
