<template>
  <header class="intro text-center">
    <nuxt-link
      to="/"
      class="intro__avatar"
    >
      <img
        alt="MonkeyBinBin"
        src="~/assets/img/avatar.jpg"
        class="img-thumbnail rounded-circle"
      >
    </nuxt-link>
    <div class="intro__text">
      <h2 class="text-white">
        {{ title }}
      </h2>
    </div>
    <page-nav />
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
.intro {
  background: linear-gradient(45deg, $tertiary-color, $primary-color);
  height: 350px;
  position: relative;
  width: 100%;

  &__text {
    padding-top: 20px;
    text-align: center;
    vertical-align: top;
  }

  &__avatar {
    display: inline-block;
    line-height: 0;
    margin-top: 50px;
    padding: 0.25rem;
    position: relative;

    img {
      max-width: 7.5rem;
    }

    &::before {
      bottom: 20px;
      color: #fff;
      content: 'MonkeyBINBIN';
      font-weight: bolder;
      position: absolute;
      right: -70%;
    }
  }
}
</style>
