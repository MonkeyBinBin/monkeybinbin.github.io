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
import constant from '~/constant'

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
      api.getArticles(constant.articleListMaxLimit)
    ]).then(([posts]) => {
      return {
        posts,
        isAosInit: !process.server
      }
    }).catch(console.error)
  },
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>
