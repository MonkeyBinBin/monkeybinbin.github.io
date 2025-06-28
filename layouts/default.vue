<template>
  <div
    :key="hydrated ? 'hydrated' : 'ssr'"
    class="layout-inner"
  >
    <page-header />
    <div class="container">
      <NuxtPage />
      <button
        v-if="hydrated"
        type="button"
        :class="['btn scrolltop-button', isShowGoTopButton && 'active']"
        @click="goTop"
      >
        <font-awesome-icon :icon="['fas', 'arrow-up']" />
      </button>
    </div>
    <page-footer />
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
      scrollPos: 0, // SSR/CSR 一致
      hydrated: false // 標記是否已 client hydration
    }
  },
  computed: {
    isShowGoTopButton: function () {
      return this.scrollPos > 0
    }
  },
  mounted () {
    this.hydrated = true // hydration 完成後才顯示 goTop 按鈕
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll() // 初始化 scrollPos

    // 防止第三方擴充功能修改類別造成的 hydration 錯誤
    this.$nextTick(() => {
      const layoutElement = this.$el
      if (layoutElement && layoutElement.classList) {
        // 確保 layout-inner 類別存在
        if (!layoutElement.classList.contains('layout-inner')) {
          layoutElement.classList.add('layout-inner')
        }
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    goTop: function () {
      $('html,body').animate({ scrollTop: 0 }, 500)
    },
    handleScroll: function () {
      this.scrollPos = window.scrollY
    }
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
