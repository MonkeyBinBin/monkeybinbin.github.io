<template>
  <div>
    <page-header/>
    <div class="container">
      <nuxt/>
    </div>
    <page-footer/>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader'
import PageFooter from '~/components/PageFooter'

export default {
  components: {
    PageHeader,
    PageFooter
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 430px);
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>
