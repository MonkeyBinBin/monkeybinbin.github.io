<template>
  <header class="intro text-center">
    <div class="intro__backdrop" />
    <div class="intro__content">
      <nuxt-link
        to="/"
        class="intro__avatar"
        title="回到首頁"
      >
        <div class="avatar-wrapper">
          <div class="avatar-glow" />
          <img
            alt="MonkeyBinBin"
            src="~/assets/img/avatar.jpg"
            class="avatar-image"
          >
          <div class="avatar-ring" />
        </div>
        <span class="avatar-label">MonkeyBINBIN</span>
      </nuxt-link>
      <div class="intro__text">
        <h1 class="main-title">
          {{ title }}
        </h1>
      </div>
      <page-nav />
    </div>
  </header>
</template>

<script>
import PageNav from '~/components/PageNav'
import constant from '~/constant'
export default {
  name: 'PageHeader',
  components: {
    PageNav
  },
  data () {
    return {
      title: constant.title
    }
  }
}
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;

// PageHeader 配色變數
$header-primary: $primary-color;           // #1dc8cd - 主要青色
$header-secondary: $tertiary-color;        // #1de099 - 次要綠色
$header-accent: #6366f1;                   // 紫藍色作為強調色
$header-dark: #0f172a;                     // 深色背景
$header-gradient-dark: rgba($header-dark, 0.95);
$header-gradient-primary: rgba($header-primary, 0.9);
$header-gradient-accent: rgba($header-accent, 0.85);
$header-gradient-secondary: rgba($header-secondary, 0.9);
$header-text-primary: #ffffff;
$header-text-glow: rgba($header-primary, 0.8);
$header-tech-cyan: rgba($header-primary, 0.5);

.intro {
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      linear-gradient(135deg,
        $header-gradient-dark 0%,
        $header-gradient-primary 25%,
        $header-gradient-accent 50%,
        $header-gradient-secondary 75%,
        $header-gradient-dark 100%
      ),
      radial-gradient(circle at 20% 80%, rgba($header-primary, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba($header-secondary, 0.3) 0%, transparent 50%);

    // 新增動態粒子效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 25% 25%, rgba($header-primary, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba($header-secondary, 0.1) 0%, transparent 40%);
      animation: float 6s ease-in-out infinite;
    }

    // 新增閃爍效果
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        repeating-linear-gradient(
          90deg,
          transparent 0%,
          rgba($header-primary, 0.03) 1px,
          transparent 2px,
          transparent 40px
        ),
        repeating-linear-gradient(
          0deg,
          transparent 0%,
          rgba($header-secondary, 0.03) 1px,
          transparent 2px,
          transparent 40px
        );
      animation: scan 4s linear infinite;
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  &__avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;

    &:hover {
      transform: translateY(-8px) scale(1.02);
      filter: brightness(1.2) contrast(1.1);
      text-decoration: none;

      .avatar-wrapper {
        .avatar-ring {
          transform: scale(1.2) rotate(180deg);
          opacity: 1;
          box-shadow: 0 0 30px rgba($header-primary, 0.6);
        }

        .avatar-glow {
          opacity: 1;
          transform: scale(1.3);
        }

        .avatar-image {
          transform: scale(1.08);
          box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.4),
            0 8px 15px rgba(0, 0, 0, 0.2),
            inset 0 0 0 2px rgba($header-text-primary, 0.9);
        }
      }

      .avatar-label {
        color: $header-text-primary;
        text-shadow: 0 0 20px $header-text-glow;
        transform: scale(1.05);

        &::before {
          width: 100%;
        }
      }
    }
  }

  &__text {
    text-align: center;

    .main-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.05em;
      line-height: 1.2;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;

      // 主要文字樣式：純白色，乾淨簡潔
      color: $header-text-primary;
      text-shadow:
        0 1px 2px rgba(0, 0, 0, 0.3),
        0 0 20px rgba($header-primary, 0.2);

      // 科技感邊框效果
      &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -8px;
        right: -8px;
        bottom: -4px;
        background: linear-gradient(90deg,
          transparent 0%,
          $header-tech-cyan 30%,
          rgba($header-primary, 0.7) 50%,
          $header-tech-cyan 70%,
          transparent 100%
        );
        border-radius: 4px;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: -1;
        animation: techScan 3s ease-in-out infinite;
      }

      // hover 時顯示科技感光效
      &:hover::before {
        opacity: 1;
      }

      // 文字下方的科技線條
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 2px;
        background: linear-gradient(90deg,
          transparent 0%,
          $header-primary 20%,
          $header-text-primary 50%,
          $header-secondary 80%,
          transparent 100%
        );
        opacity: 0.6;
        animation: techLine 2s ease-in-out infinite alternate;
      }
    }
  }
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 1rem;

  .avatar-image {
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    border: 4px solid rgba($header-text-primary, 0.95);
    box-shadow:
      0 12px 35px rgba(0, 0, 0, 0.3),
      0 6px 15px rgba(0, 0, 0, 0.15),
      inset 0 0 0 1px rgba($header-text-primary, 0.8);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    object-fit: cover;
    position: relative;
    z-index: 3;
  }

  .avatar-ring {
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    border: 3px solid transparent;
    border-radius: 50%;
    background: linear-gradient(45deg,
      rgba($header-primary, 0.8) 0%,
      rgba($header-accent, 0.8) 25%,
      rgba($header-secondary, 0.8) 50%,
      rgba($header-primary, 0.8) 75%,
      rgba($header-secondary, 0.8) 100%
    );
    background-clip: padding-box;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: 0.7;
    animation: rotate 8s linear infinite;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      right: 3px;
      bottom: 3px;
      background: transparent;
      border-radius: 50%;
    }
  }

  // 新增光暈效果
  .avatar-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba($header-primary, 0.4) 0%,
      rgba($header-secondary, 0.3) 30%,
      transparent 70%
    );
    opacity: 0;
    transition: all 0.4s ease;
    z-index: 0;
    animation: pulse 3s ease-in-out infinite;
  }
}

.avatar-label {
  color: rgba($header-text-primary, 0.95);
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-shadow:
    0 0 10px rgba($header-primary, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.4);
  position: relative;
  text-transform: uppercase;

  &::before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg,
      rgba($header-primary, 0.8) 0%,
      rgba($header-secondary, 0.8) 50%,
      rgba($header-primary, 0.8) 100%
    );
    transition: width 0.3s ease;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .intro {
    min-height: 350px;

    &__content {
      padding: 1.5rem 1rem;
      gap: 1rem;
    }
  }

  .avatar-wrapper {
    .avatar-image {
      width: 6rem;
      height: 6rem;
    }
  }

  .avatar-label {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .intro {
    min-height: 320px;

    &__content {
      padding: 1rem;
      gap: 0.8rem;
    }
  }

  .avatar-wrapper {
    margin-bottom: 0.8rem;

    .avatar-image {
      width: 5rem;
      height: 5rem;
    }
  }

  .avatar-label {
    font-size: 0.9rem;
  }
}

// 動畫關鍵幀
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 1;
  }
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

// 科技感動畫關鍵幀
@keyframes techScan {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }
  50% {
    opacity: 0.5;
    transform: scaleX(1);
  }
  100% {
    opacity: 0;
    transform: scaleX(0);
  }
}

@keyframes techLine {
  0% {
    opacity: 0.3;
    transform: translateX(-50%) scaleX(0.8);
  }
  100% {
    opacity: 0.8;
    transform: translateX(-50%) scaleX(1.2);
  }
}
</style>
