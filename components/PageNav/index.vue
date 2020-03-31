<template>
  <nav class="menu">
    <ul class="menu__container">
      <li class="menu__item">
        <nuxt-link class="menu__link" to="/">HOME</nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link class="menu__link" to="/archives">ARCHIVES</nuxt-link>
      </li>
      <li class="menu__item">
        <nuxt-link class="menu__link" to="/about">ABOUT</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.menu {
  max-width: 960px;
  mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 25%,
    #ffffff 75%,
    rgba(255, 255, 255, 0) 100%
  );
  margin: 0 auto;
  padding: 20px 0;
}

.menu__container {
  padding: 0;
  margin: 0;
  text-align: center;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 25%,
    rgba(255, 255, 255, 0.2) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1),
    inset 0 0 1px rgba(255, 255, 255, 0.6);
}

.menu__item {
  display: inline-block;
}

.menu__link {
  padding: 18px;
  font-family: "Open Sans";
  text-transform: uppercase;
  color: #ffffffbb;
  font-size: 18px;
  text-decoration: none;
  display: block;
}

.menu__link:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1),
    inset 0 0 1px rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
  color:#ffffff;
}
</style>
