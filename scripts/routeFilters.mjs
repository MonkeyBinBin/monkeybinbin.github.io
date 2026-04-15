// 排除 Contentful 取資料失敗時，generateRoutes 寫入的序列化殘留（[object Object]、undefined），
// 避免 Nitro prerender 與 sitemap 產生對不存在路徑的引用。
export function filterValidRoutes(routes) {
  if (!Array.isArray(routes)) return [];
  return routes.filter(
    (route) =>
      typeof route === 'string' &&
      route.length > 0 &&
      !route.includes('[object Object]') &&
      !route.includes('undefined'),
  );
}
