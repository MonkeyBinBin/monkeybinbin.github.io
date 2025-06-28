import map from 'lodash/map';
import head from 'lodash/head';
import constant from '~/constant';
import { useNuxtApp } from '#app';

export default () => {
  // 透過 Nuxt inject 取得 contentful client
  const client = useNuxtApp().$contentfulClient;

  return {
    getArticles: (limit, skip = 0) => {
      const queryOptions = {
        content_type: process.env.CTF_BLOG_POST_TYPE_ID,
        select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList',
        order: '-fields.createDate',
      };

      if (limit && !isNaN(limit)) {
        queryOptions.limit = limit;
      }

      if (skip && !isNaN(skip)) {
        queryOptions.skip = skip;
      }

      return client
        .getEntries(queryOptions)
        .then((res) => ({
          items: map(res.items, (item) => item.fields),
          total: res.total,
          skip: res.skip,
          limit: res.limit,
        }))
        .catch(() => Promise.resolve({ items: [], total: 0, skip: 0, limit: 0 }));
    },
    // 專門用於路由生成的方法，不含分頁
    getArticlesForRoutes: () => {
      return client
        .getEntries({
          content_type: process.env.CTF_BLOG_POST_TYPE_ID,
          select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList',
          order: '-fields.createDate',
        })
        .then((res) => map(res.items, (item) => item.fields))
        .catch(() => Promise.resolve([]));
    },
    getArticlesWithTag: (tag, limit, skip = 0) => {
      const queryOptions = {
        content_type: process.env.CTF_BLOG_POST_TYPE_ID,
        select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList',
        order: '-fields.createDate',
        'fields.categoryList': tag,
      };

      if (limit && !isNaN(limit)) {
        queryOptions.limit = limit;
      }

      if (skip && !isNaN(skip)) {
        queryOptions.skip = skip;
      }

      return client
        .getEntries(queryOptions)
        .then((res) => ({
          items: map(res.items, (item) => item.fields),
          total: res.total,
          skip: res.skip,
          limit: res.limit,
        }))
        .catch(() => Promise.resolve({ items: [], total: 0, skip: 0, limit: 0 }));
    },
    getArticleById: (id) => {
      return client
        .getEntries({
          content_type: process.env.CTF_BLOG_POST_TYPE_ID,
          'fields.id': id,
          limit: 1,
        })
        .then((res) => {
          const data = head(res.items);
          if (data) {
            return data.fields;
          } else {
            return { message: 'Page Not found!' };
          }
        })
        .catch(() => Promise.resolve({ message: 'Page Not found!' }));
    },
    getArticlesGroupByYearMonth: (year = null, limit = null, skip = 0) => {
      const queryOptions = {
        content_type: process.env.CTF_BLOG_POST_TYPE_ID,
        select: 'fields.id,fields.createDate,fields.title',
        order: '-fields.createDate',
      };

      // 如果指定年份，加入年份過濾條件
      if (year && !isNaN(year)) {
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year + 1, 0, 1).toISOString();
        queryOptions['fields.createDate[gte]'] = startDate;
        queryOptions['fields.createDate[lt]'] = endDate;
      }

      // 分頁參數
      if (limit && !isNaN(limit)) {
        queryOptions.limit = limit;
      }

      if (skip && !isNaN(skip)) {
        queryOptions.skip = skip;
      }

      return client
        .getEntries(queryOptions)
        .then((res) => {
          const groupedPosts = res.items.reduce((prevValue, currentValue) => {
            const tmpCreateDate = new Date(currentValue.fields.createDate);
            const key = `${tmpCreateDate.getFullYear()} ${constant.months[tmpCreateDate.getMonth()]}`;
            if (key in prevValue) {
              prevValue[key].push(currentValue.fields);
            } else {
              prevValue[key] = [currentValue.fields];
            }
            return prevValue;
          }, {});

          return {
            posts: groupedPosts,
            total: res.total,
            skip: res.skip,
            limit: res.limit,
            hasMore: res.skip + res.items.length < res.total,
          };
        })
        .catch(() => Promise.resolve({ posts: {}, total: 0, skip: 0, limit: 0, hasMore: false }));
    },
    // 取得所有可用的年份清單
    getAvailableYears: () => {
      return client
        .getEntries({
          content_type: process.env.CTF_BLOG_POST_TYPE_ID,
          select: 'fields.createDate',
          order: '-fields.createDate',
        })
        .then((res) => {
          const years = new Set();
          res.items.forEach((item) => {
            const year = new Date(item.fields.createDate).getFullYear();
            years.add(year);
          });
          return Array.from(years).sort((a, b) => b - a); // 由新到舊排序
        })
        .catch(() => Promise.resolve([]));
    },
    getPrevAndNextArticleById: (id, createDate) => {
      const commonData = {
        content_type: process.env.CTF_BLOG_POST_TYPE_ID,
        select: 'fields.id,fields.createDate,fields.title',
        limit: 1,
        'fields.id[ne]': id,
      };
      const prevArticle = client
        .getEntries({
          ...commonData,
          'fields.createDate[lt]': createDate,
          order: '-fields.createDate',
        })
        .then((res) => head(map(res.items, (item) => item.fields)))
        .catch(() => Promise.resolve(null));
      const nextArticle = client
        .getEntries({
          ...commonData,
          'fields.createDate[gt]': createDate,
          order: 'fields.createDate',
        })
        .then((res) => head(map(res.items, (item) => item.fields)))
        .catch(() => Promise.resolve(null));
      return Promise.all([prevArticle, nextArticle]);
    },
  };
};
