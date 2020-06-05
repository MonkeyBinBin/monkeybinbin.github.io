<template>
  <nav class="menu">
    <ul class="menu__container">
      <li class="menu__item">
        <nuxt-link
          class="menu__link"
          to="/"
        >
          HOME
        </nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link
          class="menu__link"
          to="/archives"
        >
          ARCHIVES
        </nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link
          class="menu__link"
          to="/about"
        >
          ABOUT
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.menu {
  margin: 0 auto;
  mask-image: linear-gradient(90deg,
  rgba(255, 255, 255, 0) 0%,
  #fff 25%,
  #fff 75%,
  rgba(255, 255, 255, 0) 100%);
  max-width: 960px;
  padding: 20px 0;

  &__container {
    background: linear-gradient(90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 25%,
    rgba(255, 255, 255, 0.2) 75%,
    rgba(255, 255, 255, 0) 100%);
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1),
      inset 0 0 1px rgba(255, 255, 255, 0.6);
    margin: 0;
    padding: 0;
    text-align: center;
  }

  &__item {
    display: inline-block;
  }

  &__link {
    color: #fffb;
    display: block;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    padding: 18px;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1),
        inset 0 0 1px rgba(255, 255, 255, 0.6);
      color: #fff;
    }
  }
}
</style>
