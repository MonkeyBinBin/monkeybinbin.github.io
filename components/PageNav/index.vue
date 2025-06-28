<template>
  <nav class="tech-nav">
    <!-- 導航內容 -->
    <div class="nav-content">
      <ul class="nav-list">
        <li>
          <nuxt-link
            to="/"
            class="nav-item"
          >
            <span class="icon">⌂</span>
            <span class="text">HOME</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            to="/archives"
            class="nav-item"
          >
            <span class="icon">⚏</span>
            <span class="text">ARCHIVES</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link
            to="/about"
            class="nav-item"
          >
            <span class="icon">◉</span>
            <span class="text">ABOUT</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
// 科技感顏色
$primary: #00d4ff;
$secondary: #ff6b6b;
$accent: #00ff88;
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
  background: linear-gradient(135deg,
    rgba($dark, 0.9),
    rgba($darker, 0.95));
  backdrop-filter: blur(10px);
  border: 1px solid rgba($primary, 0.3);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 40px rgba($primary, 0.2),
    0 0 80px rgba($accent, 0.1);

  // 光線特效
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg,
      transparent 25%,
      rgba($primary, 0.4) 45%,
      rgba($primary, 0.5) 50%,
      rgba($primary, 0.4) 55%,
      transparent 75%);
    border-radius: 20px;
    z-index: -1;
    animation: lightBeam 3s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba($primary, 0.08) 0%,
      transparent 25%,
      transparent 75%,
      rgba($primary, 0.08) 100%);
    border-radius: 16px;
    z-index: -1;
    animation: glowPulse 5s ease-in-out infinite alternate;
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
  color: #ffffff;
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02));
  border: 1px solid rgba($primary, 0.2);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%; // 讓導航項目填滿父容器的寬度
  height: 80px; // 設定固定高度以確保一致性
  box-sizing: border-box; // 確保 padding 包含在寬度內

  .icon {
    font-size: 24px;
    margin-bottom: 8px;
    color: $primary;
    transition: all 0.3s ease;
  }

  .text {
    font-family: 'Orbitron', monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.3s ease;
    text-align: center; // 確保文字置中
    white-space: nowrap; // 防止文字換行
  }

  // 懸停效果
  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(145deg,
      rgba($primary, 0.1),
      rgba($primary, 0.05));
    border-color: rgba($primary, 0.5);
    box-shadow:
      0 8px 25px rgba($primary, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    .icon {
      color: $accent;
      transform: scale(1.1);
    }

    .text {
      color: #ffffff;
    }
  }

  // 活躍狀態
  &.nuxt-link-active {
    background: linear-gradient(145deg,
      rgba($accent, 0.15),
      rgba($accent, 0.08));
    border-color: rgba($accent, 0.6);
    box-shadow:
      0 4px 20px rgba($accent, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);

    .icon {
      color: $accent;
    }

    .text {
      color: #ffffff;
    }
  }
}

// 光線動畫
@keyframes lightBeam {
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

@keyframes glowPulse {
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
@media (max-width: 768px) {
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

    .icon {
      margin-bottom: 0;
      margin-right: 15px;
    }
  }
}

@media (max-width: 480px) {
  .nav-item {
    padding: 15px 20px;

    .icon {
      font-size: 20px;
      margin-right: 12px;
    }

    .text {
      font-size: 11px;
      letter-spacing: 1px;
    }
  }
}
</style>
