<template>
  <div class="search-wrapper" :class="{ active: isSearchOpen }">
    <transition name="search-fade">
      <div v-if="isSearchOpen" class="search-panel">
        <div class="search-header">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜尋文章..."
            @input="handleSearch"
          />
          <button class="close-btn" @click="closeSearch">✕</button>
        </div>

        <div v-if="searchQuery" class="search-results">
          <div v-if="isLoading" class="loading">搜尋中...</div>
          <div v-else-if="searchResults.length === 0" class="no-results">找不到相關文章</div>
          <div v-else class="results-list">
            <nuxt-link
              v-for="result in searchResults"
              :key="result.item.id"
              :to="`/article/${result.item.id}`"
              class="result-item"
              @click="closeSearch"
            >
              <div class="result-title">{{ result.item.title }}</div>
              <div class="result-meta">
                <span class="result-date">{{ formatDate(result.item.date) }}</span>
                <span v-if="result.item.tags.length" class="result-tags">
                  {{ result.item.tags.join(', ') }}
                </span>
              </div>
              <div class="result-excerpt">{{ result.item.excerpt }}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="isSearchOpen" class="search-backdrop" @click="closeSearch" />
  </div>
</template>

<script>
import Fuse from 'fuse.js';

export default {
  name: 'Search',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      searchIndex: [],
      fuse: null,
      isLoading: false,
    };
  },
  computed: {
    isSearchOpen() {
      return this.isOpen;
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus();
        });
      } else {
        this.searchQuery = '';
        this.searchResults = [];
      }
    },
  },
  mounted() {
    this.loadSearchIndex();
  },
  methods: {
    async loadSearchIndex() {
      try {
        const response = await fetch('/search-index.json');
        this.searchIndex = await response.json();

        this.fuse = new Fuse(this.searchIndex, {
          keys: ['title', 'tags', 'excerpt'],
          threshold: 0.3,
          ignoreLocation: true,
        });
      } catch (error) {
        console.error('Failed to load search index:', error);
      }
    },
    closeSearch() {
      this.$emit('close');
    },
    handleSearch() {
      if (!this.searchQuery.trim() || !this.fuse) {
        this.searchResults = [];
        return;
      }

      this.isLoading = true;
      setTimeout(() => {
        this.searchResults = this.fuse.search(this.searchQuery).slice(0, 10);
        this.isLoading = false;
      }, 100);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;

$search-primary: $primary-color;
$search-secondary: $tertiary-color;
$search-dark: #0f172a;
$search-overlay: rgba(0, 0, 0, 0.7);

.search-wrapper {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;

  &.active {
    pointer-events: auto;
  }
}

.search-backdrop {
  position: fixed;
  inset: 0;
  background: $search-overlay;
  z-index: 998;
  backdrop-filter: blur(4px);
}

.search-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  background: linear-gradient(135deg, rgba($search-dark, 0.98), rgba($search-dark, 0.95));
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba($search-primary, 0.3);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba($search-primary, 0.2);
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba($search-primary, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba($search-primary, 0.6);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba($search-primary, 0.1);
  }
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.loading,
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba($search-primary, 0.2);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;

  &:hover {
    background: rgba($search-primary, 0.1);
    border-color: rgba($search-primary, 0.5);
    transform: translateX(-4px);
  }
}

.result-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.result-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.result-tags {
  color: rgba($search-secondary, 0.8);
}

.result-excerpt {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: all 0.3s ease;
}

.search-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.search-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (width <= 768px) {
  .search-panel {
    max-width: 100%;
  }
}
</style>
