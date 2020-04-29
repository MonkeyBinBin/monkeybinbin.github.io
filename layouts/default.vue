<template>
  <div :class="!isShowGoTopButton && 'top'">
    <page-header/>
    <div class="container">
      <nuxt/>
      <button type="button" :class="['btn scrolltop-button', isShowGoTopButton && 'active']" @click="goTop">
        <font-awesome-icon :icon="['fas', 'arrow-up']" />
      </button>
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
  },
  data () {
    return {
      scrollPos: process.client ? window.scrollY : 0
    }
  },
  methods: {
    goTop: function () {
      $('html,body').animate({ scrollTop: 0 }, 500)
    },
    handleScroll: function () {
      this.scrollPos = window.scrollY
    }
  },
  computed: {
    isShowGoTopButton: function () {
      return this.scrollPos > 0
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped>
.container {
  // 100vh - header height(350px) - footer height(80px)
  min-height: calc(100vh - 430px);
  padding-top: 30px;
  padding-bottom: 30px;
}
.scrolltop-button {
  position: fixed;
  font-size: 22px;
  opacity: 0;
  z-index: 1;
  right: 3%;
  bottom: 90px;
  transition: opacity 0.5s;
  font-weight: bolder;
  color: white;
  background-color: $primary-color;
}
.scrolltop-button.active {
  opacity: .8;
}
</style>
