<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center aos-init" data-aos="fade-left">
        <div class="col-sm-10 col-md-8">
          <h1 class="mb-5">Posts tagged with "{{tagName}}"</h1>
        </div>
      </div>
      <div class="row justify-content-center aos-init" data-aos="fade-left" v-for="(post, key) in posts" :key="key">
        <div class="col-sm-10 col-md-8">
          <article-item :post="post" :marked-tag="tagName" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import ArticleItem from '~/components/ArticleItem'
import api from '../../services/api'

export default {
  name: 'Tag',
  data () {
    return {
      tagName: this.$route.params.tag,
      posts: []
    }
  },
  async mounted () {
    this.posts = await api.getArticlesWithTag(this.tagName)

    this.$nextTick(function () {
      AOS.init()
    })
  },
  components: {
    ArticleItem
  }
}
</script>
