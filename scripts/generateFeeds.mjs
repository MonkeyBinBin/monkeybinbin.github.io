// 此腳本負責生成 RSS/Atom feeds 和搜尋索引
// 會在 Nuxt build 完成後由 nitro:build:public-assets hook 呼叫
import path from 'path';
import fs from 'fs';
import { Feed } from 'feed';
import { createClient } from 'contentful';
import map from 'lodash/map.js';
import config from '../config/index.mjs';

const client = createClient({
  space: config.CTF_SPACE_ID,
  accessToken: config.CTF_CDA_ACCESS_TOKEN,
});

async function getArticles() {
  return client
    .getEntries({
      content_type: config.CTF_BLOG_POST_TYPE_ID,
      select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList,fields.articleContent',
      order: '-fields.createDate',
    })
    .then((res) => {
      console.log(`成功取得 ${res.total} 篇文章`);
      return map(res.items, (item) => item.fields);
    })
    .catch((err) => {
      console.error('取得文章時發生錯誤：', err.message);
      return Promise.resolve([]);
    });
}

function generateRSSFeed(articles) {
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.domain,
    link: config.domain,
    language: 'zh-TW',
    favicon: `${config.domain}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, MonkeyBinBin`,
    feedLinks: {
      rss2: `${config.domain}/feed.xml`,
      atom: `${config.domain}/atom.xml`,
      json: `${config.domain}/feed.json`,
    },
    author: {
      name: 'MonkeyBinBin',
      email: 'thisisbinbin@gmail.com',
      link: config.domain,
    },
  });

  // 只取最新 20 篇文章加入 RSS
  articles.slice(0, 20).forEach((article) => {
    if (!article.id || !article.title) return;

    const articleUrl = `${config.domain}/article/${article.id}`;
    const content = article.articleContent || '';
    const description = content.substring(0, 200).replace(/<[^>]*>/g, '');

    feed.addItem({
      title: article.title,
      id: articleUrl,
      link: articleUrl,
      description,
      content,
      date: new Date(article.createDate),
      category: (article.categoryList || []).map((tag) => ({ name: tag })),
    });
  });

  return feed;
}

export async function generateFeeds(outputDir) {
  console.log('開始產生 RSS Feed...');

  const articles = await getArticles();
  const feed = generateRSSFeed(articles);

  // 確保輸出目錄存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 輸出三種格式的 feed
  fs.writeFileSync(path.join(outputDir, 'feed.xml'), feed.rss2());
  fs.writeFileSync(path.join(outputDir, 'atom.xml'), feed.atom1());
  fs.writeFileSync(path.join(outputDir, 'feed.json'), feed.json1());

  console.log('✓ RSS Feed 已產生至 dist/：feed.xml, atom.xml, feed.json');

  return articles;
}

export async function generateSearchIndex(outputDir, articles = null) {
  console.log('開始產生搜尋索引...');

  // 如果沒有傳入 articles，重新取得
  if (!articles) {
    articles = await getArticles();
  }

  const searchIndex = articles.map((article) => {
    const content = article.articleContent || '';
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const excerpt = plainText.substring(0, 200);

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      tags: article.categoryList || [],
      excerpt,
      date: article.createDate,
    };
  });

  // 確保輸出目錄存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );

  console.log(`✓ 搜尋索引已產生至 dist/：search-index.json (${searchIndex.length} 篇文章)`);
}

// 主函數：同時生成 feeds 和搜尋索引
export async function generateAllFeeds(outputDir) {
  const articles = await generateFeeds(outputDir);
  await generateSearchIndex(outputDir, articles);
}
