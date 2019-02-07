import filter from 'lodash/filter'
import map from 'lodash/map'
import head from 'lodash/head'
import contentful from '~/plugins/contentful.js'
const client = contentful.createClient()

const getArticles = () => {
  return client.getEntries({
    content_type: process.env.CTF_BLOG_POST_TYPE_ID,
    select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.tags',
    order: '-fields.createDate'
  })
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
      'fields.id': id
    })
      .then(res => head(res.items).fields)
      .catch(() => Promise.resolve({ message: 'Page Not found!' }))
    // const _info = axios.get(`${pathHelper.getBaseUrl()}posts/list.json?d=${dayCacheHash}`)
    //   .then(res => {
    //     const posts = res.data
    //     const article = _.find(posts, function (o) { return o.id === id })
    //     if (article && article.id) {
    //       return { data: article }
    //     } else {
    //       return { message: 'Page Not found!' }
    //     }
    //   })
    //   .catch(() => {
    //     return Promise.resolve({ message: 'Page Not found!' })
    //   })
    // const _content = axios.get(`${pathHelper.getBaseUrl()}posts/${id}/content.md`)
    //   .then(res => {
    //     return { data: res.data }
    //   })
    //   .catch(() => {
    //     return Promise.resolve({ message: 'Page Not found!' })
    //   })
    // return axios.all([_info, _content])
  }
}
