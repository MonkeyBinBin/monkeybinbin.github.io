<template>
  <div
    class="row aos-init"
    data-aos="fade-left"
  >
    <div class="col-12 text-center">
      <h1 class="not-found-title">
        {{ error.statusCode }}
      </h1>
      <p
        v-if="error.statusCode === 404"
        class="text-black-50"
      >
        Page not found
      </p>
      <p
        v-else
        class="text-black-50"
      >
        Oops, the page you're looking for doesn't exist.
      </p>
      <nuxt-link
        to="/"
        class="btn btn-dark"
      >
        回首頁
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import AOS from 'aos'

export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.$nextTick(function () {
      AOS.init()
    })
  }
}
</script>

<style lang="scss" scoped>
.not-found-title {
  color: $primary-color;
  font-size: 200px;
}
</style>
