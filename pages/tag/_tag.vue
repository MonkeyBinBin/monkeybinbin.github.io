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
import axios from 'axios'
import ArticleItem from '~/components/ArticleItem'
import pathHelper from '../../helpers/path'

export default {
  name: 'Tag',
  data () {
    return {
      tagName: this.$route.params.tag,
      posts: []
    }
  },
  async asyncData ({params}) {
    const { tag } = params
    // server render
    const posts = await import('~/static/posts/list.json')
    return {
      posts: _.filter(posts, function(o) { return o.tags && o.tags.includes(tag) })
    }
  },
  async mounted () {
    const tag = this.tagName
    const posts = await axios.get(`${pathHelper.getBaseUrl()}posts/list.json`).then(res => res.data).catch(() => [])
    this.posts = _.filter(posts, function(o) { return o.tags && o.tags.includes(tag) })
  },
  updated: function () {
    this.$nextTick(function () {
      AOS.init()
    })
  },
  components: {
    ArticleItem
  }
}
</script>
