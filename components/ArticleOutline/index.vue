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
      class="text-right mt-5"
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
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.article {
  margin-bottom: 0; // 移除底部邊距，由父容器控制間距

  :deep(h1) {
    margin-bottom: 24px;

    a {
      @include link-animation(transparent);

      color: #2c3e50;
      font-size: 1.75rem;
      font-weight: 600;
      text-decoration: none;
      line-height: 1.3;
      display: block;
      transition: all 0.3s ease;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, $primary-color, $tertiary-color);
        transition: width 0.3s ease;
      }

      &:hover {
        color: $primary-color;
        transform: translateX(4px);

        &::after {
          width: 60px;
        }
      }
    }
  }

  &__slug {
    text-indent: 0;
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 0;
  }

  &__date {
    font-weight: 500;
    color: #64748b;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &::after {
      content: '•';
      padding-left: 0.5em;
      padding-right: 0.5em;
      color: #cbd5e1;
    }
  }

  &__divider {
    background: linear-gradient(90deg, $primary-color, $tertiary-color);
    height: 2px;
    width: 60px;
    margin: 20px 0;
    border: none;
    border-radius: 1px;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.tag-link {
  @include link-animation(transparent);

  background: linear-gradient(135deg, rgba(29, 200, 205, 0.1), rgba(29, 224, 153, 0.1));
  color: $primary-color;
  font-weight: 500;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(29, 200, 205, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: linear-gradient(135deg, $primary-color, $tertiary-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(29, 200, 205, 0.3);
    text-decoration: none;
  }
}

.more {
  @include link-animation(transparent);

  color: $primary-color;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 8px 16px;
  border: 2px solid $primary-color;
  border-radius: 24px;
  transition: all 0.3s ease;
  display: inline-block;
  letter-spacing: 0.5px;

  &:hover {
    background: linear-gradient(135deg, $primary-color, $tertiary-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 200, 205, 0.3);
    text-decoration: none;
  }
}

.marked {
  @include link-animation(transparent);

  background: linear-gradient(135deg, rgba(201, 20, 20, 0.1), rgba(201, 20, 20, 0.15));
  color: $marked-primary-color;
  border-color: rgba(201, 20, 20, 0.3);

  &:hover {
    background: linear-gradient(135deg, $marked-primary-color, #e74c3c);
    color: white;
    box-shadow: 0 4px 12px rgba(201, 20, 20, 0.3);
  }
}

// 響應式設計
@media (max-width: 768px) {
  .article {
    :deep(h1 a) {
      font-size: 1.5rem;
    }
  }

  .tags {
    gap: 6px;
  }

  .tag-link {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
}
</style>
