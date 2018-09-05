<template>
  <header class="text-center" id="intro">
    <a href="/" class="avatar">
      <img alt="MonkeyBinBin" :src="avatar" class="img-thumbnail rounded-circle">
    </a>
    <div class="intro-text">
      <h2 class="text-white">猴猴學語</h2>
    </div>
    <page-nav />
  </header>
</template>

<script>
import avatar from '~/assets/img/avatar.jpg'
import PageNav from '~/components/PageNav'
export default {
  name: 'PageHeader',
  data () {
    return {
      avatar
    }
  },
  components: {
    PageNav
  }
}
</script>

<style lang="scss" scoped>
#intro {
  width: 100%;
  height: 350px;
  background: linear-gradient(45deg, #1de099, #1dc8cd);
  position: relative;
}

#intro .intro-text {
  padding-top: 20px;
  text-align: center;
  vertical-align: top;
}

.avatar {
  display: inline-block;
  margin-top: 50px;
  line-height: 0;
  padding: 0.25rem;
}

.avatar img {
  max-width: 7.5rem;
}
</style>

