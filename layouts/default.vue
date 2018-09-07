<template>
  <div>
    <page-header/>
    <div class="container">
      <nuxt/>
    </div>
    <page-footer/>
    <button type="button" :class="['btn scrolltop-button', isShowGoTopButton && 'active']" @click="goTop">↑</button>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader'
import PageFooter from '~/components/PageFooter'
const offsetTopShowGoTopButton = 350
export default {
  components: {
    PageHeader,
    PageFooter
  },
  data () {
    return {
      isShowGoTopButton: false
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll)
    // 設定初始值
    this.isShowGoTopButton = window.scrollY >= offsetTopShowGoTopButton
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll: function (e) {
      this.isShowGoTopButton = window.scrollY >= offsetTopShowGoTopButton
    },
    goTop: function () {
      // window.scrollTo(0, 0)

      // with animation
      $('html,body').animate({ scrollTop: 0 }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
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
  background-color: #1dc8cd;
}
.scrolltop-button.active {
  opacity: .8;
}
</style>
