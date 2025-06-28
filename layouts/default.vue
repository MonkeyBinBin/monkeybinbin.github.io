<template>
  <div :key="hydrated ? 'hydrated' : 'ssr'" class="layout-inner">
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
import PageHeader from '~/components/PageHeader';
import PageFooter from '~/components/PageFooter';
export default {
  components: {
    PageHeader,
    PageFooter,
  },
  data() {
    return {
      scrollPos: 0, // SSR/CSR 一致
      hydrated: false, // 標記是否已 client hydration
    };
  },
  computed: {
    isShowGoTopButton: function () {
      return this.scrollPos > 0;
    },
  },
  mounted() {
    this.hydrated = true; // hydration 完成後才顯示 goTop 按鈕
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll(); // 初始化 scrollPos

    // 防止第三方擴充功能修改類別造成的 hydration 錯誤
    this.$nextTick(() => {
      const layoutElement = this.$el;
      if (layoutElement && layoutElement.classList) {
        // 確保 layout-inner 類別存在
        if (!layoutElement.classList.contains('layout-inner')) {
          layoutElement.classList.add('layout-inner');
        }
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    goTop: function () {
      // 使用原生 JavaScript 實現平滑滾動
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    handleScroll: function () {
      this.scrollPos = window.scrollY;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;

.layout-inner {
  height: 100vh;
}

.container {
  // 100vh - header height(350px) - footer height(80px)
  min-height: calc(100vh - 430px);
  padding-bottom: 30px;
}

.scrolltop-button {
  // 基本定位與尺寸
  position: fixed;
  right: 30px;
  bottom: 160px; // 避免被 footer (120px) 遮住，額外留出空間
  width: 56px;
  height: 56px;
  border-width: 0;
  border-radius: 50%;
  opacity: 0;
  z-index: 999;
  cursor: pointer;

  // 科技感背景與效果
  background: linear-gradient(
    135deg,
    $scrolltop-gradient-start 0%,
    $scrolltop-gradient-middle 50%,
    $scrolltop-gradient-end 100%
  );
  background-size: 200% 200%;
  animation: gradient-flow 3s ease infinite;

  // 外框光暈效果
  box-shadow:
    0 0 20px $scrolltop-shadow-primary,
    0 0 40px $scrolltop-shadow-secondary,
    inset 0 1px 0 $scrolltop-inner-highlight;

  // 文字樣式
  color: $scrolltop-text-color;
  font-size: 22px;
  font-weight: bold;

  // 過渡效果
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 玻璃質感效果
  backdrop-filter: blur(10px);

  // 內部光暈
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    pointer-events: none;
    transition: all 0.3s ease;
  }

  // hover 效果
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow:
      0 5px 25px $scrolltop-shadow-hover-primary,
      0 10px 50px $scrolltop-shadow-hover-secondary,
      inset 0 1px 0 $scrolltop-inner-highlight-hover;

    &::before {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
    }
  }

  // 按下效果
  &:active {
    transform: translateY(-1px) scale(0.98);
    box-shadow:
      0 2px 15px $scrolltop-shadow-active-primary,
      0 5px 30px $scrolltop-shadow-active-secondary,
      inset 0 1px 0 $scrolltop-inner-highlight;
  }
}

.scrolltop-button.active {
  opacity: 0.9;

  // 脈衝動畫
  animation:
    gradient-flow 3s ease infinite,
    pulse 2s ease-in-out infinite;
}

// 科技感動畫效果
@keyframes gradient-flow {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow:
      0 0 20px $scrolltop-shadow-primary,
      0 0 40px $scrolltop-shadow-secondary,
      inset 0 1px 0 $scrolltop-inner-highlight;
  }

  50% {
    box-shadow:
      0 0 30px $scrolltop-shadow-hover-primary,
      0 0 60px $scrolltop-shadow-hover-secondary,
      inset 0 1px 0 $scrolltop-inner-highlight-hover;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .scrolltop-button {
    width: 48px;
    height: 48px;
    right: 20px;
    bottom: 140px; // 手機版 footer 較小
    font-size: 18px;
  }
}
</style>
