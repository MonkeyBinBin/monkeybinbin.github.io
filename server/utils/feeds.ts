// Server-side utility for generating RSS/Atom feeds
import { Feed } from 'feed';
import { createClient } from 'contentful';

// 非敏感設定值沿用 config/index.mjs 的預設，敏感 token 改由環境變數注入
const config = {
  title: '被程式設計的猴子 - 記錄日常工作、開發遇到的大小事',
  description: '來自台灣的工程師，目前偏好前端開發。本網站使用 Nuxt.js 與 Bootstrap 4 搭建而成。紀錄一些日常開發程式的大小事情。',
  domain: 'https://monkeybinbin.github.io',
  CTF_SPACE_ID: '64scck6nxm6l',
  CTF_BLOG_POST_TYPE_ID: 'post',
};

const client = createClient({
  space: config.CTF_SPACE_ID,
  accessToken: process.env.CTF_CDA_ACCESS_TOKEN || '',
});

interface Article {
  id: string;
  createDate: string;
  title: string;
  slug?: string;
  categoryList?: string[];
  articleContent?: string;
}

async function getArticles(): Promise<Article[]> {
  return client
    .getEntries({
      content_type: config.CTF_BLOG_POST_TYPE_ID,
      select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList,fields.articleContent',
      order: '-fields.createDate',
    })
    .then((res) => res.items.map((item) => item.fields as Article))
    .catch((err) => {
      console.error('取得文章時發生錯誤：', err.message);
      return [];
    });
}

export async function generateFeed() {
  const articles = await getArticles();

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

export async function generateSearchIndex() {
  const articles = await getArticles();

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

  return searchIndex;
}
