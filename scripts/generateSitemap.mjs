// 此腳本負責生成 sitemap.xml
// 會在 Nuxt build 完成後由 close hook 呼叫
import path from 'path';
import fs from 'fs';
import config from '../config/index.mjs';

const DOMAIN = config.domain;

/**
 * 根據路徑推算優先權：首頁最高，文章次之，其餘較低
 */
function getPriority(route) {
  if (route === '/') return '1.0';
  if (route.startsWith('/article/')) return '0.8';
  if (route.startsWith('/tag/')) return '0.6';
  if (route === '/archives') return '0.5';
  if (route === '/about') return '0.5';
  if (route.startsWith('/page/')) return '0.4';
  return '0.5';
}

function getChangeFreq(route) {
  if (route === '/') return 'daily';
  if (route.startsWith('/article/')) return 'monthly';
  if (route.startsWith('/tag/')) return 'weekly';
  if (route === '/archives') return 'weekly';
  return 'monthly';
}

/**
 * 產生 sitemap.xml 並寫入指定目錄
 * @param {string} outputDir - 輸出目錄（通常是 dist/）
 * @param {Array} articles - 從 Contentful 取得的文章陣列，用於取得 lastmod
 */
export function generateSitemap(outputDir, articles = []) {
  console.log('開始產生 sitemap.xml...');

  // 建立文章 id → createDate 的對照表，供 lastmod 使用
  const articleDateMap = new Map();
  articles.forEach((article) => {
    if (article.id && article.createDate) {
      articleDateMap.set(article.id, article.createDate);
    }
  });

  // 靜態頁面（不在 generate-routes.json 中但需要收錄）
  const staticRoutes = ['/', '/archives', '/about'];

  // 從 generate-routes.json 讀取動態路由
  let dynamicRoutes = [];
  const routesPath = path.resolve(outputDir, '../scripts/generate-routes.json');
  try {
    if (fs.existsSync(routesPath)) {
      const parsed = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
      dynamicRoutes = Array.isArray(parsed)
        ? parsed.filter(
            // 此過濾條件與 nuxt.config.ts Nitro prerender routes（第 123–129 行）相同，
            // 若需調整規則請同步更新兩處以維持 sitemap 與 prerender 一致
            (route) =>
              typeof route === 'string' &&
              route.length > 0 &&
              !route.includes('[object Object]') &&
              !route.includes('undefined')
          )
        : [];
    }
  } catch (err) {
    console.warn('無法載入 generate-routes.json，僅產生靜態頁面的 sitemap：', err.message);
  }

  // 合併所有路由並去重
  const allRoutes = [...new Set([...staticRoutes, ...dynamicRoutes])];

  const today = new Date().toISOString().split('T')[0];

  const urls = allRoutes.map((route) => {
    // 從文章路徑取出 id，查對照表取得 lastmod
    let lastmod = today;
    const articleMatch = route.match(/^\/article\/(.+)$/);
    if (articleMatch) {
      const articleDate = articleDateMap.get(articleMatch[1]);
      if (articleDate) {
        lastmod = new Date(articleDate).toISOString().split('T')[0];
      }
    }

    return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${getChangeFreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemap);
  console.log(`✓ sitemap.xml 已產生至 dist/（${allRoutes.length} 個網址）`);
}
