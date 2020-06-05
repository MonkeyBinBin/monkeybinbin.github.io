<template>
  <div class="article">
    <div
      v-if="post && post.categoryList"
      class="tags"
    >
      <span
        v-if="post.createDate"
        class="small text-secondary article__date"
      >
        <font-awesome-icon :icon="['fas', 'calendar-alt']" />
        {{ post.createDate|parseDatetime }}
      </span>
      <nuxt-link
        v-for="tag in post.categoryList"
        :key="tag"
        :to="'/tag/'+tag"
        :class="['small', 'tag-link', markedTag && tag === markedTag && 'marked']"
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
      v-if="post.slug"
      class="article__slug text-black-50 ml-4"
    >
      {{ post.slug }}
    </p>
    <div
      v-if="isShowMore"
      class="text-right"
    >
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

  /deep/ h2 a {
    @include link-animation(#000);

    color: #000;
    text-decoration: none;
  }

  &__slug {
    text-indent: 1em;
  }

  &__date {
    font-weight: bolder;

    &::after {
      content: '\B7';
      padding-left: 0.5em;
      padding-right: 0.5em;
    }
  }

  &__divider {
    background-color: $primary-color;
    height: 2px;
    width: 80px;
  }
}

.tag-link {
  @include link-animation($primary-color);

  background-color: $secondary-color;
  color: $primary-color;
  font-weight: bolder;
  padding: 4px;

  &:not(:last-child) {
    margin-right: 5px;
  }

  &:hover {
    text-decoration: none;
  }
}

.more {
  @include link-animation($primary-color);

  color: $primary-color;
  text-transform: uppercase;

  &:hover {
    text-decoration: none;
  }
}

.marked {
  @include link-animation($marked-primary-color);

  background-color: $marked-secondary-color;
  color: $marked-primary-color;
}
</style>
