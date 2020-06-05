<template>
  <section class="section">
    <div
      class="container aos-init"
      data-aos="fade-left"
    >
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <div class="section-header">
            <h3 class="section-title">
              文章列表
            </h3>
          </div>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8">
          <div
            v-for="(monthPosts, key) in posts"
            :key="key"
            class="archieve-list"
          >
            <div class="archieve-list__category">
              <h5>
                <font-awesome-icon
                  class="mr-2"
                  :icon="['fas', 'calendar-alt']"
                />{{ key }}
              </h5>
            </div>
            <div
              v-for="(post, postKey) in monthPosts"
              :key="`post_${postKey}`"
              class="archieve-list__article"
            >
              <nuxt-link :to="'/article/'+post.id">
                <span>{{ post.title }}</span><span class="archieve-list__date">
                  [ {{ post.createDate }} ]
                </span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AOS from 'aos'
import api from '~/services/api'

export default {
  name: 'Archives',
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  },
  async asyncData ({ params }) {
    return Promise.all([
      api.getArticlesGroupByYearMonth()
    ]).then(([posts]) => {
      return {
        posts
      }
    }).catch(console.error)
  }
}
</script>

<style lang="scss" scoped>
.archieve-list {
  padding-bottom: 10px;
  padding-top: 10px;

  &__category {
    padding-bottom: 5px;
  }

  &__article {
    a {
      @include link-animation($primary-color);

      color: $primary-color;

      &:hover {
        text-decoration: none;
      }
    }
  }

  &__date {
    font-size: small;
  }
}
</style>
