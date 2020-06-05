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
import api from '~/services/api'

export default {
  name: 'Tag',
  components: {
    ArticleOutline
  },
  data () {
    return {
      tagName: '',
      posts: []
    }
  },
  validate ({ params }) {
    return !!params.tag
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
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>
