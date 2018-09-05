<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center aos-init" data-aos="fade-left" v-for="(post, key) in posts" :key="key">
        <div class="col-sm-10 col-md-8">
          <article-item :post="post" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import axios from 'axios'
import ArticleItem from '~/components/ArticleItem'
export default {
  components: {
    ArticleItem
  },
  data () {
    return {
      posts: []
    }
  },
  async asyncData ({ params }) {
    // server render
    const posts = await import('~/static/posts/list.json')
    return {
      posts
    }
  },
  async mounted () {
    const posts = await axios.get('/posts/list.json').then(res => res.data).catch(() => [])
    this.posts = posts
  },
  updated: function () {
    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>
