<template>
  <div
    class="row aos-init"
    data-aos="fade-left"
  >
    <div class="col-12 text-center">
      <h1 class="not-found-title">{{error.statusCode}}</h1>
      <p
        class="text-black-50"
        v-if="error.statusCode === 404"
      >Page not found</p>
      <p
        class="text-black-50"
        v-else
      >Oops, the page you're looking for doesn't exist.</p>
      <nuxt-link
        to="/"
        class="btn btn-dark"
      >回首頁</nuxt-link>
    </div>
  </div>
</template>

<script>
import AOS from 'aos'

export default {
  name: 'Error',
  props: ['error'],
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
