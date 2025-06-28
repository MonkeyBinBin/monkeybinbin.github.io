<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 text-center">
            <div class="footer-brand">
              <span class="brand-text">MonkeyBinBin</span>
              <div class="brand-underline" />
            </div>
            <div class="footer-text">
              © 2025 MonkeyBinBin. <br class="d-block d-sm-none" />
              <span class="tech-badge">Built with Nuxt 3</span>
            </div>
            <div class="footer-glow" />
          </div>
        </div>
      </div>
    </div>
    <div class="footer-particles">
      <div v-for="n in 20" :key="n" class="particle" />
    </div>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
};
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use '~/assets/sass/helpers/variables' as *;

// 粒子樣式 mixin，產生 20 個不同狀態的粒子
@mixin footer-particles($count: 20) {
  @for $i from 1 through $count {
    &:nth-child(#{$i}) {
      left: math.random() * 100%;
      animation-delay: math.random() * 6s;
      animation-duration: (4 + math.random() * 4) * 1s;

      // 為粒子添加不同的顏色變化
      @if $i % 3 == 0 {
        background: rgba($footer-secondary, 0.8);
        box-shadow: 0 0 4px rgba($footer-secondary, 0.6);
      } @else if $i % 5 == 0 {
        background: rgba($footer-accent, 0.8);
        box-shadow: 0 0 4px rgba($footer-accent, 0.6);
      }
    }
  }
}

// 配色變數
$footer-primary: $primary-color; // #1dc8cd - 主要青色
$footer-secondary: $tertiary-color; // #1de099 - 次要綠色
$footer-accent: #6366f1; // 紫藍色作為強調色
$footer-dark: #0f172a; // 深色背景
$footer-gradient-start: rgba($footer-primary, 0.9);
$footer-gradient-middle: rgba($footer-accent, 0.8);
$footer-gradient-end: rgba($footer-secondary, 0.9);
$footer-text-primary: #fff;
$footer-text-secondary: rgba(255, 255, 255, 0.9);
$footer-glow: rgba($footer-primary, 0.4);

.footer {
  position: relative;
  background:
    linear-gradient(
      135deg,
      $footer-gradient-start 0%,
      $footer-gradient-middle 50%,
      $footer-gradient-end 100%
    ),
    linear-gradient(45deg, rgba($footer-dark, 0.9) 0%, rgba($footer-dark, 0.7) 100%);
  background-size:
    400% 400%,
    100% 100%;
  animation: gradient-shift 8s ease infinite;
  color: $footer-text-primary;
  font-size: 14px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba($footer-primary, 0.15) 0%,
      transparent 50%,
      rgba($footer-secondary, 0.15) 100%
    );
    background-size: 200% 200%;
    animation: shimmer 3s ease-in-out infinite;
  }
}

.footer-content {
  position: relative;
  z-index: 2;
  backdrop-filter: blur(10px);

  .row {
    height: 120px;
    position: relative;
  }
}

.footer-brand {
  margin-bottom: 16px;

  .brand-text {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(
      45deg,
      $footer-text-primary,
      rgba($footer-primary, 1),
      $footer-text-primary
    );
    background-size: 200% 200%;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text-shine 3s ease-in-out infinite;
    text-shadow: 0 0 20px $footer-glow;
    display: inline-block;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .brand-underline {
    width: 60px;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      $footer-primary,
      $footer-secondary,
      transparent
    );
    margin: 8px auto;
    border-radius: 2px;
    animation: underline-glow 2s ease-in-out infinite alternate;
  }
}

.footer-text {
  color: $footer-text-secondary;
  line-height: 1.6;

  .tech-badge {
    display: inline-block;
    background: rgba($footer-primary, 0.25);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    margin-left: 8px;
    border: 1px solid rgba($footer-primary, 0.4);
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
    color: $footer-text-primary;

    &:hover {
      background: rgba($footer-secondary, 0.3);
      border-color: rgba($footer-secondary, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($footer-primary, 0.3);
    }
  }
}

.footer-glow {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 100px;
  background: radial-gradient(
    ellipse,
    rgba($footer-primary, 0.4) 0%,
    rgba($footer-secondary, 0.2) 50%,
    transparent 70%
  );
  animation: glow-pulse 4s ease-in-out infinite;
}

.footer-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba($footer-primary, 0.8);
    border-radius: 50%;
    animation: particle-float 6s linear infinite;
    box-shadow: 0 0 4px rgba($footer-primary, 0.6);
    @include footer-particles(20);
  }
}

// 動畫效果
@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes shimmer {
  0%,
  100% {
    background-position: -200% -200%;
  }

  50% {
    background-position: 200% 200%;
  }
}

@keyframes text-shine {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes underline-glow {
  0% {
    box-shadow: 0 0 5px rgba($footer-primary, 0.5);
  }

  100% {
    box-shadow: 0 0 20px rgba($footer-secondary, 0.8);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translateX(-50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.2);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(100px) rotate(0deg);
    opacity: 0;
  }

  10%,
  90% {
    opacity: 1;
  }

  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .footer-brand .brand-text {
    font-size: 20px;
  }

  .footer-content .row {
    height: 100px;
  }

  .footer-text .tech-badge {
    display: block;
    margin: 8px auto 0;
    width: fit-content;
  }
}
</style>
