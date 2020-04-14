import filter from 'lodash/filter'
import map from 'lodash/map'
import head from 'lodash/head'
import constant from '~/constant'
import contentful from '~/plugins/contentful.js'
const client = contentful.createClient()

const getArticles = (limit) => {
  const queryOptions = {
    content_type: process.env.CTF_BLOG_POST_TYPE_ID,
    select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.tags',
    order: '-fields.createDate'
  }

  if (limit && !isNaN(limit)) {
    queryOptions.limit = limit
  }

  return client.getEntries(queryOptions)
    .then(res => map(res.items, item => item.fields))
    .catch(() => Promise.resolve([]))
}

export default {
  getArticles,
  getArticlesWithTag: (tag) => {
    return getArticles()
      .then(res => {
        return filter(res, function (o) { return o.tags && o.tags.includes(tag) })
      })
      .catch(() => Promise.resolve([]))
  },
  getArticleById: (id) => {
    return client.getEntries({
      content_type: process.env.CTF_BLOG_POST_TYPE_ID,
      'fields.id': id,
      limit: 1
    })
      .then(res => {
        const data = head(res.items)
        if (data) {
          return data.fields
        } else {
          return { message: 'Page Not found!' }
        }
      })
      .catch(() => Promise.resolve({ message: 'Page Not found!' }))
  },
  getArticlesGroupByYearMonth: () => {
    return client.getEntries({
      content_type: process.env.CTF_BLOG_POST_TYPE_ID,
      select: 'fields.id,fields.createDate,fields.title',
      order: '-fields.createDate'
    })
      .then(res => {
        return res.items.reduce((prevValue, currentValue) => {
          const tmpCreateDate = new Date(currentValue.fields.createDate)
          const key = `${tmpCreateDate.getFullYear()} ${constant.months[tmpCreateDate.getMonth()]}`
          if (key in prevValue) {
            prevValue[key].push(currentValue.fields)
          } else {
            prevValue[key] = [currentValue.fields]
          }
          return prevValue
        }, {})
      })
  },
  getPrevAndNextArticleById: (id, createDate) => {
    const commonData = {
      content_type: process.env.CTF_BLOG_POST_TYPE_ID,
      select: 'fields.id,fields.createDate,fields.title',
      limit: 1,
      'fields.id[ne]': id
    }
    const prevArticle = client.getEntries({
      ...commonData,
      'fields.createDate[lt]': createDate,
      order: '-fields.createDate'
    })
      .then(res => head(map(res.items, item => item.fields)))
      .catch(() => Promise.resolve(null))
    const nextArticle = client.getEntries({
      ...commonData,
      'fields.createDate[gt]': createDate,
      order: 'fields.createDate'
    })
      .then(res => head(map(res.items, item => item.fields)))
      .catch(() => Promise.resolve(null))
    return Promise.all([prevArticle, nextArticle])
  }
}
