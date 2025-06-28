<template>
  <div class="article">
    <div
      v-if="post && post.categoryList"
      class="tags"
    >
      <span
        v-if="post && post.createDate"
        class="small text-secondary article__date"
      >
        <font-awesome-icon :icon="['fas', 'calendar-alt']" />
        {{ formatDate(post.createDate) }}
      </span>
      <nuxt-link
        v-for="tag in post.categoryList"
        :key="tag"
        :to="'/tag/'+tag"
        :class="['small', 'tag-link', markedTag && tag === markedTag && 'marked']"
        :title="tag"
      >
        <font-awesome-icon :icon="['fas', 'tag']" />
        {{ tag }}
      </nuxt-link>
    </div>
    <h1>
      <nuxt-link
        v-if="post && post.id && typeof post.id === 'string'"
        :to="'/article/'+post.id"
        :title="post.title"
      >
        {{ post.title }}
      </nuxt-link>
      <span v-else>{{ post?.title || 'Untitled' }}</span>
    </h1>
    <hr class="article__divider my-4 mx-0">
    <p
      v-if="post && post.slug"
      class="article__slug text-black-50 ml-4"
    >
      {{ post.slug }}
    </p>
    <div
      v-show="isShowMore && post && post.id && typeof post.id === 'string'"
      class="text-right"
    >
      <nuxt-link
        :to="'/article/'+post.id"
        class="more"
        :title="post.title"
      >
        more
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
      validator (value) {
        // 在開發模式下，檢查 post 物件是否有效
        if (process.dev && value && typeof value.id !== 'string' && value.id !== undefined) {
          console.warn('ArticleOutline: Invalid post.id type:', typeof value.id, value.id)
          console.warn('Full post object:', value)
        }
        return true
      }
    },
    markedTag: {
      type: String,
      default: ''
    },
    isShowMore: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatDate (date) {
      return this.$filters && this.$filters.parseDatetime ? this.$filters.parseDatetime(date) : date
    }
  }
}
</script>

<style lang="scss" scoped>
.article {
  margin-bottom: 50px;

  :deep(h1 a) {
    @include link-animation(#000);

    color: #000;
    font-size: 2rem;
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
