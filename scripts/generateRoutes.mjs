// 這個腳本會查詢所有文章、標籤、歸檔資訊，並輸出 Nuxt generate 需要的路徑陣列
import path from 'path';
import config from '../config/index.mjs';
import { createClient } from 'contentful';
import map from 'lodash/map.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 使用設定檔中的分頁設定
const POSTS_PER_PAGE = config.articleListMaxLimit;

const client = createClient({
  space: config.CTF_SPACE_ID,
  accessToken: config.CTF_CDA_ACCESS_TOKEN,
});

async function getArticles() {
  return client
    .getEntries({
      content_type: config.CTF_BLOG_POST_TYPE_ID,
      select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList',
      order: '-fields.createDate',
    })
    .then((res) => map(res.items, (item) => item.fields))
    .catch(() => Promise.resolve([]));
}

async function main() {
  const routes = new Set();

  // 取得所有文章
  const articles = await getArticles();
  console.log(`總共找到 ${articles.length} 篇文章`);

  // 計算分頁路由
  const totalPages = Math.ceil(articles.length / POSTS_PER_PAGE);

  // 新增分頁路由（第一頁是根路徑，其他頁面是 /page/2, /page/3...）
  for (let page = 2; page <= totalPages; page++) {
    routes.add(`/page/${page}`);
  }
  console.log(`產生 ${totalPages} 個分頁，其中 ${totalPages - 1} 個分頁路由`);

  articles.forEach((article, index) => {
    if (article.id && typeof article.id === 'string' && article.id.trim()) {
      const routePath = `/article/${article.id}`;
      routes.add(routePath);
    } else {
      // 若 id 不存在或格式錯誤，記錄警告避免產生無效路徑
      console.warn(`✗ 文章 ${index + 1} 的 id 欄位無效，已略過：`, {
        id: article.id,
        idType: typeof article.id,
        title: article.title || '未知標題',
        slug: article.slug || '未知 slug',
      });
    }
  });

  // 取得所有標籤並計算每個標籤的分頁
  const tags = new Set();
  const tagPostCounts = new Map();

  articles.forEach((article) => {
    if (Array.isArray(article.categoryList)) {
      article.categoryList.forEach((tag) => {
        tags.add(tag);
        tagPostCounts.set(tag, (tagPostCounts.get(tag) || 0) + 1);
      });
    }
  });

  // 為每個標籤產生路由（包含分頁）
  tags.forEach((tag) => {
    const postCount = tagPostCounts.get(tag) || 0;
    const tagPages = Math.ceil(postCount / POSTS_PER_PAGE);

    // 第一頁使用 /tag/標籤名稱
    routes.add(`/tag/${tag}`);

    // 其他頁面使用 /tag/標籤名稱/頁碼
    for (let page = 2; page <= tagPages; page++) {
      routes.add(`/tag/${tag}/${page}`);
    }

    console.log(`標籤 "${tag}": ${postCount} 篇文章，產生 ${tagPages} 個分頁`);
  });

  console.log(`總共產生 ${tags.size} 個標籤的路由`);

  // 歸檔頁面（可依需求擴充）
  routes.add('/archives');

  // 輸出路徑陣列
  const routesArr = Array.from(routes);
  fs.writeFileSync(
    path.resolve(__dirname, 'generate-routes.json'),
    JSON.stringify(routesArr, null, 2)
  );
  console.log('已產生 generate-routes.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
