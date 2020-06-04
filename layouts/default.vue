<template>
  <div :class="['layout-inner', !isShowGoTopButton && 'top']">
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
.layout-inner {
  height: 100vh;
}

.container {
  // 100vh - header height(350px) - footer height(80px)
  min-height: calc(100vh - 430px);
  padding-bottom: 30px;
  padding-top: 30px;
}

.scrolltop-button {
  background-color: $primary-color;
  bottom: 90px;
  color: #fff;
  font-size: 22px;
  font-weight: bolder;
  opacity: 0;
  position: fixed;
  right: 3%;
  transition: opacity 0.5s;
  z-index: 1;
}

.scrolltop-button.active {
  opacity: 0.8;
}
</style>
