<template>
  <nav class="tech-nav">
    <!-- 導航內容 -->
    <div class="nav-content">
      <ul class="nav-list">
        <li>
          <nuxt-link to="/" class="nav-item">
            <span class="icon">⌂</span>
            <span class="text">HOME</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/archives" class="nav-item">
            <span class="icon">⚏</span>
            <span class="text">ARCHIVES</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/about" class="nav-item">
            <span class="icon">◉</span>
            <span class="text">ABOUT</span>
          </nuxt-link>
        </li>
        <li>
          <a href="/feed.xml" class="nav-item" target="_blank" rel="noopener noreferrer">
            <svg
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"
                fill="currentColor"
              />
            </svg>
            <span class="text">RSS</span>
          </a>
        </li>
        <li>
          <button class="nav-item search-trigger" @click="$emit('toggle-search')">
            <svg
              class="icon-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                fill="currentColor"
              />
            </svg>
            <span class="text">SEARCH</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'PageNav',
  emits: ['toggle-search'],
};
</script>

<style lang="scss" scoped>
// 科技感顏色
$primary: #00d4ff;
$secondary: #ff6b6b;
$accent: #0f8;
$dark: #0a0e27;
$darker: #070b1f;

.tech-nav {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;
  position: relative;
}

// 導航內容
.nav-content {
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, rgba($dark, 0.9), rgba($darker, 0.95));
  backdrop-filter: blur(10px);
  border: 1px solid rgba($primary, 0.3);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgb(0 0 0 / 50%),
    inset 0 1px 0 rgb(255 255 255 / 10%),
    0 0 40px rgba($primary, 0.2),
    0 0 80px rgba($accent, 0.1);

  // 光線特效
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    background: linear-gradient(
      45deg,
      transparent 25%,
      rgba($primary, 0.4) 45%,
      rgba($primary, 0.5) 50%,
      rgba($primary, 0.4) 55%,
      transparent 75%
    );
    border-radius: 20px;
    z-index: -1;
    animation: light-beam 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba($primary, 0.08) 0%,
      transparent 25%,
      transparent 75%,
      rgba($primary, 0.08) 100%
    );
    border-radius: 16px;
    z-index: -1;
    animation: glow-pulse 5s ease-in-out infinite alternate;
  }
}

// 導航列表
.nav-list {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    flex: 1;
    min-width: 0; // 確保 flex 項目可以收縮
  }
}

// 導航項目
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // 垂直置中對齊
  padding: 20px 25px;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(145deg, rgb(255 255 255 / 5%), rgb(255 255 255 / 2%));
  border: 1px solid rgba($primary, 0.2);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%; // 讓導航項目填滿父容器的寬度
  height: 80px; // 設定固定高度以確保一致性
  box-sizing: border-box; // 確保 padding 包含在寬度內
  cursor: pointer;

  &.search-trigger {
    // 按鈕樣式重置
    appearance: none;
    font-family: inherit;
  }

  .icon {
    font-size: 24px;
    line-height: 1;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    color: $primary;
    transition: all 0.3s ease;
  }

  .icon-svg {
    width: 24px;
    height: 24px;
    margin-bottom: 8px;
    color: $primary;
    transition: all 0.3s ease;
  }

  .text {
    font-family: Orbitron, monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgb(255 255 255 / 80%);
    transition: all 0.3s ease;
    text-align: center; // 確保文字置中
    white-space: nowrap; // 防止文字換行
  }

  // 懸停效果
  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(145deg, rgba($primary, 0.1), rgba($primary, 0.05));
    border-color: rgba($primary, 0.5);
    box-shadow:
      0 8px 25px rgba($primary, 0.3),
      inset 0 1px 0 rgb(255 255 255 / 20%);

    .icon,
    .icon-svg {
      color: $accent;
      transform: scale(1.1);
    }

    .text {
      color: #fff;
    }
  }

  // 活躍狀態
  &.nuxt-link-active {
    background: linear-gradient(145deg, rgba($accent, 0.15), rgba($accent, 0.08));
    border-color: rgba($accent, 0.6);
    box-shadow:
      0 4px 20px rgba($accent, 0.3),
      inset 0 1px 0 rgb(255 255 255 / 15%);

    .icon,
    .icon-svg {
      color: $accent;
    }

    .text {
      color: #fff;
    }
  }
}

// 光線動畫
@keyframes light-beam {
  0% {
    opacity: 0.4;
    transform: rotate(0deg) scale(1);
  }

  33% {
    opacity: 0.7;
    transform: rotate(1deg) scale(1.01);
  }

  66% {
    opacity: 0.8;
    transform: rotate(-1deg) scale(1.02);
  }

  100% {
    opacity: 0.4;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes glow-pulse {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.01);
  }

  100% {
    opacity: 0.4;
    transform: scale(1);
  }
}

// 響應式設計
@media (width <= 768px) {
  .tech-nav {
    padding: 30px 15px;
  }

  .nav-content {
    padding: 20px;
  }

  .nav-list {
    flex-direction: column;
    gap: 20px;
  }

  .nav-item {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;

    .icon,
    .icon-svg {
      margin-bottom: 0;
      margin-right: 15px;
    }
  }
}

@media (width <= 480px) {
  .nav-item {
    padding: 15px 20px;

    .icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 12px;
    }

    .icon-svg {
      width: 20px;
      height: 20px;
      margin-right: 12px;
    }

    .text {
      font-size: 11px;
      letter-spacing: 1px;
    }
  }
}
</style>
