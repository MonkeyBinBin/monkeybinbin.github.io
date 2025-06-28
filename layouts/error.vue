<template>
  <motion-div
    v-motion="{
      initial: { opacity: 0, x: 40 },
      enter: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    }"
    class="row"
  >
    <div class="col-12 text-center">
      <h1 class="not-found-title">
        {{ error.statusCode }}
      </h1>
      <p v-if="error.statusCode === 404" class="text-black-50">Page not found</p>
      <p v-else class="text-black-50">Oops, the page you're looking for doesn't exist.</p>
      <nuxt-link to="/" class="btn btn-dark" title="回首頁"> 回首頁 </nuxt-link>
    </div>
  </motion-div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.not-found-title {
  color: $primary-color;
  font-size: 200px;
}
</style>
