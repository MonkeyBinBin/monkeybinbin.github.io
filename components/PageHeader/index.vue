<template>
  <header class="intro text-center">
    <nuxt-link to="/" class="intro__avatar">
      <img alt="MonkeyBinBin" :src="avatar" class="img-thumbnail rounded-circle">
    </nuxt-link>
    <div class="intro__text">
      <h2 class="text-white">{{title}}</h2>
    </div>
    <page-nav />
  </header>
</template>

<script>
import avatar from '~/assets/img/avatar.jpg'
import PageNav from '~/components/PageNav'
import constant from '~/constant'
export default {
  name: 'PageHeader',
  data () {
    return {
      title: constant.title,
      avatar
    }
  },
  components: {
    PageNav
  }
}
</script>

<style lang="scss" scoped>
.intro {
  width: 100%;
  height: 350px;
  background: linear-gradient(45deg, #1de099, #1dc8cd);
  position: relative;
}

.intro__text {
  padding-top: 20px;
  text-align: center;
  vertical-align: top;
}

.intro__avatar {
  display: inline-block;
  margin-top: 50px;
  line-height: 0;
  padding: 0.25rem;
  position: relative;
  img {
    max-width: 7.5rem;
  }

  &::before {
    content: 'MonkeyBINBIN';
    position: absolute;
    right: -70%;
    bottom: 20px;
    color: #fff;
    font-weight: bolder;
  }
}
</style>
