// 這個腳本會查詢所有文章、標籤、歸檔資訊，並輸出 Nuxt generate 需要的路徑陣列
import path from 'path'
import config from '../config/index.mjs'
import pkg from 'contentful'
import map from 'lodash/map.js'
import fs from 'fs'
import { fileURLToPath } from 'url'

const { createClient } = pkg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = createClient({
  space: config.CTF_SPACE_ID,
  accessToken: config.CTF_CDA_ACCESS_TOKEN
})

async function getArticles () {
  return client.getEntries({
    content_type: config.CTF_BLOG_POST_TYPE_ID,
    select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList',
    order: '-fields.createDate'
  })
    .then(res => map(res.items, item => item.fields))
    .catch(() => Promise.resolve([]))
}

async function main () {
  const routes = new Set()

  // 取得所有文章
  const articles = await getArticles()
  console.log(`總共找到 ${articles.length} 篇文章`)

  articles.forEach((article, index) => {
    if (article.id && typeof article.id === 'string' && article.id.trim()) {
      const routePath = `/article/${article.id}`
      routes.add(routePath)
    } else {
      // 若 id 不存在或格式錯誤，記錄警告避免產生無效路徑
      console.warn(`✗ 文章 ${index + 1} 的 id 欄位無效，已略過：`, {
        id: article.id,
        idType: typeof article.id,
        title: article.title || '未知標題',
        slug: article.slug || '未知 slug'
      })
    }
  })

  // 取得所有標籤
  const tags = new Set()
  articles.forEach(article => {
    if (Array.isArray(article.categoryList)) {
      article.categoryList.forEach(tag => tags.add(tag))
    }
  })
  tags.forEach(tag => routes.add(`/tag/${tag}`))

  // 歸檔頁面（可依需求擴充）
  routes.add('/archives')

  // 輸出路徑陣列
  const routesArr = Array.from(routes)
  fs.writeFileSync(path.resolve(__dirname, 'generate-routes.json'), JSON.stringify(routesArr, null, 2))
  console.log('已產生 generate-routes.json')
}

main().catch(e => { console.error(e); process.exit(1) })
