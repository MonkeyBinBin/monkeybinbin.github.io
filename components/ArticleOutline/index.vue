<template>
  <div class="article">
    <div
      v-if="post && post.tags"
      class="tags"
    >
      <span
        class="small text-secondary article__date"
        v-if="post.createDate"
      >
        <font-awesome-icon :icon="['fas', 'calendar-alt']" />
        {{post.createDate|parseDatetime}}
      </span>
      <nuxt-link
        v-for="tag in post.tags"
        :key="tag"
        :to="'/tag/'+tag"
        :class="['small', markedTag && tag === markedTag && 'marked']"
      >
        <font-awesome-icon :icon="['fas', 'tag']" />
        {{ tag }}
      </nuxt-link>
    </div>
    <h2>
      <nuxt-link :to="'/article/'+post.id">
        {{ post.title }}
      </nuxt-link>
    </h2>
    <hr class="article__divider my-4 mx-0">
    <p
      class="article__slug text-black-50 ml-4"
      v-if="post.slug"
    >{{post.slug}}</p>
    <div class="text-right" v-if="isShowMore">
      <nuxt-link
        :to="'/article/'+post.id"
        class="more"
      >
        more
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleOutline',
  props: {
    post: {
      type: Object,
      required: true
    },
    markedTag: {
      type: String,
      default: ''
    },
    isShowMore: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.article {
  margin-bottom: 50px;

  &__slug {
    text-indent: 1em;
  }

  &__date {
    font-weight: bolder;
    &::after {
      content: "\B7";
      padding-right: 0.5em;
      padding-left: 0.5em;
    }
  }

  &__divider {
    background-color: $primary-color;
    width: 80px;
    height: 2px;
  }
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
  @include link-animation($primary-color);
}
.more {
  color: $primary-color;
  text-transform: uppercase;
  &:hover {
    text-decoration: none;
  }
  @include link-animation($primary-color);
}
.tags /deep/ .marked {
  color: $marked-primary-color;
  background-color: $marked-secondary-color;
  @include link-animation($marked-primary-color);
}
.article /deep/ h2 a {
  color: black;
  text-decoration: none;
  @include link-animation(black);
}
</style>
