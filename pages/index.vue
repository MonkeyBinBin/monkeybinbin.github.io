<template>
  <section class="section">
    <div
      class="container aos-init"
      data-aos="fade-left"
    >
      <div
        v-for="(post, key) in posts"
        :key="key"
        class="row justify-content-center"
      >
        <div class="col-sm-10 col-md-8">
          <article-outline :post="post" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import ArticleOutline from '~/components/ArticleOutline'
import api from '~/services/api'
import constant from '~/constant'

export default {
  name: 'Pages',
  components: {
    ArticleOutline
  },
  asyncData ({ error }) {
    return Promise.all([
      api.getArticles(constant.articleListMaxLimit)
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
  }
}
</script>
