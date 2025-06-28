<template>
  <section class="tech-archive-section">
    <motion-div
      v-motion="{
        initial: { opacity: 0, x: 40 },
        enter: { opacity: 1, x: 0, transition: { duration: 0.6 } },
      }"
      class="tech-archive-container"
    >
      <div class="tech-archive-header">
        <h1 class="tech-archive-title"><span class="tech-accent">文章</span> 列表</h1>
        <div class="tech-divider" />
        <p class="tech-archive-subtitle">依據建立時間排序的所有文章，探索知識的時光軌跡</p>

        <!-- 年份選擇器 -->
        <div class="tech-year-selector">
          <button
            :class="['tech-year-btn', { active: selectedYear === null }]"
            @click="selectYear(null)"
          >
            全部年份
          </button>
          <button
            v-for="year in availableYears"
            :key="year"
            :class="['tech-year-btn', { active: selectedYear === year }]"
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <div class="tech-archive-grid">
        <div v-for="(monthPosts, key) in posts" :key="key" class="tech-timeline-group">
          <div class="tech-timeline-header">
            <div class="tech-timeline-marker">
              <font-awesome-icon :icon="['fas', 'calendar-alt']" class="tech-timeline-icon" />
            </div>
            <h3 class="tech-timeline-date">
              {{ key }}
            </h3>
            <div class="tech-timeline-line" />
          </div>

          <div class="tech-articles-container">
            <div
              v-for="(post, postKey) in monthPosts"
              :key="`post_${postKey}`"
              class="tech-article-card"
            >
              <nuxt-link
                v-if="post && post.id && typeof post.id === 'string'"
                :to="'/article/' + post.id"
                :title="post.title"
                class="tech-article-link"
              >
                <div class="tech-article-content">
                  <h4 class="tech-article-title">
                    {{ post.title }}
                  </h4>
                  <span class="tech-article-date">{{ post.createDate }}</span>
                </div>
                <div class="tech-article-arrow">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                </div>
              </nuxt-link>
              <div v-else class="tech-article-invalid">
                <div class="tech-article-content">
                  <h4 class="tech-article-title">
                    {{ post?.title || 'Untitled' }}
                  </h4>
                  <span class="tech-article-date">{{ post?.createDate || 'Unknown date' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 載入狀態指示器 -->
      <div v-if="isLoading && selectedYear === null" class="tech-loading-container">
        <div class="tech-loading-spinner">
          <font-awesome-icon :icon="['fas', 'spinner']" spin />
        </div>
        <p class="tech-loading-text">載入更多文章中...</p>
      </div>

      <!-- 無限滾動偵測元素 -->
      <div ref="loadMoreTrigger" class="tech-load-trigger" />
    </motion-div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useAsyncData, useError, useHead, useRoute, useRouter } from 'nuxt/app';
import apiModule from '~/services/api';
import config from '~/config';
import constant from '~/constant';

const route = useRoute();
const router = useRouter();

// 響應式資料
const selectedYear = ref(null);
const posts = ref({});
const availableYears = ref([]);
const isLoading = ref(false);
const hasMore = ref(true);
const currentSkip = ref(0);
const pageSize = config.articleListMaxLimit;
const loadMoreTrigger = ref(null);
let observer = null;

// 從路由參數取得初始年份
if (route.query.year && !isNaN(route.query.year)) {
  selectedYear.value = parseInt(route.query.year);
}

// 取得可用年份清單
const { data: yearsData } = await useAsyncData('available-years', async () => {
  try {
    const api = apiModule();
    return await api.getAvailableYears();
  } catch (error) {
    console.error('Failed to fetch available years:', error);
    return [];
  }
});

if (yearsData.value) {
  availableYears.value = yearsData.value;
}

// 合併文章資料的輔助函式
const mergePosts = (existingPosts, newPosts) => {
  const merged = { ...existingPosts };

  Object.keys(newPosts).forEach((monthKey) => {
    if (merged[monthKey]) {
      // 合併同月份的文章，避免重複
      const existingIds = new Set(merged[monthKey].map((post) => post.id));
      const newArticles = newPosts[monthKey].filter((post) => !existingIds.has(post.id));
      merged[monthKey] = [...merged[monthKey], ...newArticles];
    } else {
      merged[monthKey] = newPosts[monthKey];
    }
  });

  return merged;
};

// 取得文章資料的函式
const fetchPosts = async (year = null, skip = 0, isLoadMore = false) => {
  try {
    const api = apiModule();
    const limit = selectedYear.value === null ? pageSize : null; // 只有全部年份時才分頁
    const result = await api.getArticlesGroupByYearMonth(year, limit, skip);

    if (isLoadMore) {
      // 載入更多時合併資料
      posts.value = mergePosts(posts.value, result.posts);
    } else {
      // 初始載入或切換年份時直接設定
      posts.value = result.posts;
    }

    hasMore.value = result.hasMore;
    currentSkip.value = skip + (result.limit || 0);

    return result;
  } catch (error) {
    if (!isLoadMore) {
      throw useError({
        statusCode: 500,
        message: error.message || 'Failed to fetch articles',
      });
    } else {
      console.error('Failed to load more articles:', error);
      return { posts: {}, hasMore: false };
    }
  }
};

// 載入更多文章
const loadMorePosts = async () => {
  if (isLoading.value || !hasMore.value || selectedYear.value !== null) {
    return;
  }

  isLoading.value = true;

  try {
    await fetchPosts(null, currentSkip.value, true);
  } finally {
    isLoading.value = false;
  }
};

// 設定無限滾動觀察器
const setupIntersectionObserver = () => {
  if (!loadMoreTrigger.value || typeof IntersectionObserver === 'undefined') {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && selectedYear.value === null) {
        loadMorePosts();
      }
    },
    {
      rootMargin: '100px', // 提前 100px 觸發載入
    }
  );

  observer.observe(loadMoreTrigger.value);
};

// 清理觀察器
const cleanupObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

// 初始載入文章資料
await useAsyncData(`archives-${selectedYear.value || 'all'}`, () =>
  fetchPosts(selectedYear.value, 0, false)
);

// 年份選擇函式
const selectYear = async (year) => {
  selectedYear.value = year;
  currentSkip.value = 0;
  hasMore.value = true;

  // 更新 URL
  if (year) {
    await router.push({ query: { year } });
  } else {
    await router.push({ query: {} });
  }

  // 重新載入資料
  try {
    await fetchPosts(year, 0, false);
  } catch (error) {
    console.error('Failed to fetch posts for year:', year, error);
  }
};

// 監聽路由變化
watch(
  () => route.query.year,
  (newYear) => {
    const yearValue = newYear ? parseInt(newYear) : null;
    if (yearValue !== selectedYear.value) {
      selectedYear.value = yearValue;
      currentSkip.value = 0;
      hasMore.value = true;
      fetchPosts(yearValue, 0, false).catch((error) => {
        console.error('Failed to fetch posts for year:', yearValue, error);
      });
    }
  }
);

// 設定頁面標題和 meta 資訊
const title = ref(`所有文章列表 - ${constant.title}`);
const description = ref(
  '依據文章建立的時間，列出所有的文章連結，排列方式是利用文章建立的時間排序，由新到舊'
);

// 監聽選擇的年份變化，更新頁面標題
watch(selectedYear, (newYear) => {
  if (newYear) {
    title.value = `${newYear} 年文章列表 - ${constant.title}`;
    description.value = `${newYear} 年的所有文章，依據建立時間排序，由新到舊`;
  } else {
    title.value = `所有文章列表 - ${constant.title}`;
    description.value =
      '依據文章建立的時間，列出所有的文章連結，排列方式是利用文章建立的時間排序，由新到舊';
  }
});

// 生命週期鉤子
onMounted(async () => {
  await nextTick();
  setupIntersectionObserver();
});

onUnmounted(() => {
  cleanupObserver();
});

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    {
      property: 'og:url',
      content: `${constant.domain}${constant.baseUrl}archives`,
    },
  ],
  link: [{ rel: 'canonical', href: `${constant.domain}${constant.baseUrl}archives` }],
});
</script>

<style lang="scss" scoped>
@use '~/assets/sass/helpers/variables' as *;
@use '~/assets/sass/helpers/mixins' as *;

.tech-archive-section {
  position: relative;
  min-height: 100vh;
  padding: 60px 0;
  overflow: hidden;
}

.tech-archive-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1;
}

.tech-archive-header {
  text-align: center;
  margin-bottom: 80px;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
}

.tech-archive-title {
  font-size: 3.2rem;
  font-weight: 300;
  color: #2c3e50;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
}

.tech-accent {
  background: linear-gradient(135deg, $primary-color, $tertiary-color);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.tech-divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, $primary-color, $tertiary-color);
  margin: 0 auto 30px;
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(29, 200, 205, 0.3), transparent);
  }
}

.tech-archive-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.tech-year-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.tech-year-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(29, 200, 205, 0.2);
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(29, 200, 205, 0.1), transparent);
    transition: left 0.3s ease;
  }

  &:hover {
    border-color: rgba(29, 200, 205, 0.4);
    color: $primary-color;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(29, 200, 205, 0.15);

    &::before {
      left: 100%;
    }
  }

  &.active {
    background: linear-gradient(135deg, $primary-color, $tertiary-color);
    border-color: $primary-color;
    color: #fff;
    transform: translateY(-2px);
    box-shadow:
      0 8px 25px rgba(29, 200, 205, 0.3),
      0 0 20px rgba(29, 224, 153, 0.2);

    &::before {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}

.tech-archive-grid {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.tech-timeline-group {
  position: relative;
  opacity: 0;
  animation: fade-in-up 0.8s ease-out forwards;
  animation-delay: calc(var(--group-index) * 0.1s);
}

.tech-timeline-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  min-height: 50px; // 確保有足夠高度容納圖示
  padding-left: 30px;
}

.tech-timeline-marker {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, $primary-color, $tertiary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 25px rgba(29, 200, 205, 0.3),
    0 0 20px rgba(29, 224, 153, 0.2);
  position: relative;
  z-index: 2;
  flex-shrink: 0; // 防止被壓縮

  &::before {
    content: '';
    position: absolute;
    width: 60px;
    height: 60px;
    border: 2px solid rgba(29, 200, 205, 0.2);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

.tech-timeline-icon {
  color: #fff;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-timeline-date {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0 20px;
  letter-spacing: -0.01em;
}

.tech-timeline-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, rgba(29, 200, 205, 0.3), transparent);
  margin-left: 20px;
  border-radius: 1px;
}

.tech-articles-container {
  display: grid;
  gap: 20px;
  padding-left: 70px;

  @media (max-width: 768px) {
    padding-left: 0;
    gap: 16px;
  }
}

.tech-article-arrow {
  color: #94a3b8;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  margin-left: 16px;
}

.tech-article-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(29, 200, 205, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.02),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, $primary-color, $tertiary-color);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(29, 200, 205, 0.3);
    box-shadow:
      0 12px 30px rgba(29, 200, 205, 0.15),
      0 0 25px rgba(29, 224, 153, 0.1),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.95);

    &::before {
      opacity: 1;
    }

    .tech-article-arrow {
      transform: translateX(5px);
      color: $primary-color;
    }
  }
}

.tech-article-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  min-height: 80px;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
}

.tech-article-invalid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  opacity: 0.6;
  min-height: 80px;
}

.tech-article-content {
  flex: 1;
}

.tech-article-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px;
  line-height: 1.4;
  transition: color 0.3s ease;

  .tech-article-link:hover & {
    color: $primary-color;
  }
}

.tech-article-date {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 400;
  font-family: 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;
}

// 載入狀態指示器
.tech-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  margin-top: 40px;
}

.tech-loading-spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-color, $tertiary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(29, 200, 205, 0.3);

  svg {
    color: #fff;
    font-size: 1.5rem;
  }
}

.tech-loading-text {
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
}

.tech-load-trigger {
  height: 20px;
  width: 100%;
  margin-top: 40px;
}

// 動畫關鍵框架
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .tech-archive-section {
    padding: 60px 0;
  }

  .tech-archive-container {
    padding: 0 16px;
  }

  .tech-archive-header {
    margin-bottom: 60px;
  }

  .tech-archive-grid {
    gap: 40px;
  }

  .tech-timeline-header {
    align-items: center;
    gap: 15px;
    min-height: 36px; // 調整為配合較小的標記尺寸
    padding-left: 10px;
  }

  .tech-timeline-marker {
    width: 36px; // 進一步縮小標記大小
    height: 36px;
    flex-shrink: 0; // 防止被壓縮

    &::before {
      width: 44px; // 相應調整動畫邊框
      height: 44px;
    }

    .tech-timeline-icon {
      font-size: 0.8rem; // 進一步縮小圖示大小
    }
  }

  .tech-timeline-date {
    font-size: 1.5rem;
    margin: 0;
  }

  .tech-timeline-line {
    display: none;
  }

  .tech-article-link,
  .tech-article-invalid {
    padding: 20px;
    min-height: 70px;
  }

  .tech-article-title {
    font-size: 1.1rem;
  }

  .tech-article-date {
    font-size: 0.85rem;
  }
}

// 為每個時間軸群組設定不同的動畫延遲
.tech-timeline-group:nth-child(1) {
  --group-index: 1;
}

.tech-timeline-group:nth-child(2) {
  --group-index: 2;
}

.tech-timeline-group:nth-child(3) {
  --group-index: 3;
}

.tech-timeline-group:nth-child(4) {
  --group-index: 4;
}

.tech-timeline-group:nth-child(5) {
  --group-index: 5;
}

.tech-timeline-group:nth-child(6) {
  --group-index: 6;
}

.tech-timeline-group:nth-child(7) {
  --group-index: 7;
}

.tech-timeline-group:nth-child(8) {
  --group-index: 8;
}

.tech-timeline-group:nth-child(9) {
  --group-index: 9;
}

.tech-timeline-group:nth-child(10) {
  --group-index: 10;
}
</style>
