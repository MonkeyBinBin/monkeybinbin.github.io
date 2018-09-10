<template>
  <div class="article-container">
    <div v-if="post && post.tags" class="tags">
      <span class="small text-secondary article-create-date" v-if="post.createDate">{{post.createDate|parseDatetime}}</span>
      <nuxt-link v-for="tag in post.tags" :key="tag" :to="'/tag/'+tag" :class="['small', markedTag && tag === markedTag && 'marked']">{{ tag }}</nuxt-link>
    </div>
    <h2>
      {{ post.title }}
    </h2>
    <hr class="article-divider my-4 mx-0">
    <p class="text-black-50 ml-4" v-if="post.slug">{{post.slug}}</p>
    <div class="text-right">
      <nuxt-link :to="'/article/'+post.id" class="more">
        more
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    post: {
      type: Object,
      required: true
    },
    markedTag: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #1dc8cd;
$secondary-color: lighten(saturate($primary-color, 25), 50);
$marked-primary-color: #c91414;
$marked-secondary-color: lighten(saturate($marked-primary-color, 25), 50);

.article-container {
  margin-bottom: 50px;
}
.tags /deep/ a {
  color: $primary-color;
  background-color: $secondary-color;
  padding: 4px;
  font-weight: bolder;
  &:not(:last-child) {
    margin-right: 5px;
  }
  &:hover {
    text-decoration: none;
  }
  &::before {
    content: '#';
  }
}
.article-create-date {
  &::after{
    content: "\B7";
    padding-right: .5em;
    padding-left: .5em;
  }
}
.more {
  color: $primary-color;
  text-transform: uppercase;
}
.tags /deep/ .marked {
  color: $marked-primary-color;
  background-color: $marked-secondary-color;
}
</style>
