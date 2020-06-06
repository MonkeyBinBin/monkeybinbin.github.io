const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const map = require('lodash/map')

const baseUrl = '/'

const contentful = require('contentful')
const client = contentful.createClient(
  {
    space: config.CTF_SPACE_ID,
    accessToken: config.CTF_CDA_ACCESS_TOKEN
  }
)
const getArticles = () => {
  return client.getEntries({
    content_type: config.CTF_BLOG_POST_TYPE_ID,
    select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.categoryList',
    order: '-fields.createDate'
  })
    .then(res => map(res.items, item => item.fields))
    .catch(() => Promise.resolve([]))
}

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: config.title,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      { name: 'author', content: 'MonkeyBinBin' },
      { property: 'fb:app_id', content: config.fbId },
      { hid: 'keywords', name: 'keywords', content: config.keywords.join() },
      { hid: 'description', name: 'description', content: config.description },
      { hid: 'og:title', property: 'og:title', content: config.title },
      { hid: 'og:site_name', property: 'og:site_name', content: config.title },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: `${config.domain}${baseUrl}` },
      { hid: 'og:image', property: 'og:image', content: `${config.domain}${path.join(baseUrl, '/img/share.jpg')}` },
      { hid: 'og:image:width', property: 'og:image:width', content: '1080' },
      { hid: 'og:image:height', property: 'og:image:height', content: '1080' },
      { hid: 'og:description', property: 'og:description', content: config.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${baseUrl}favicon.ico` }
    ]
  },
  env: {
    baseUrl: baseUrl,
    title: config.title,
    keywords: config.keywords,
    domain: config.domain,
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN,
    CTF_BLOG_POST_TYPE_ID: config.CTF_BLOG_POST_TYPE_ID
  },
  router: {
    base: baseUrl
  },
  /*
  ** Customize the progress bar color
  */
  loading: {
    color: '#3B8070',
    height: '4px'
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    // 載入bootstrap
    'bootstrap/scss/bootstrap.scss',
    'bootstrap-vue/dist/bootstrap-vue.css',
    // 載入highlight.js樣式(可選擇不同theme)
    'highlight.js/styles/zenburn.css',
    // 載入aos樣式
    'aos/src/sass/aos.scss',
    // 主要css樣式(customer)
    '~/assets/sass/main.scss'
  ],
  modules: [
    ['@nuxtjs/google-tag-manager', { id: 'GTM-N24F89P' }],
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        }
      ]
    }]
  ],
  buildModules: [
    '@nuxtjs/sitemap',
    // global 載入sass的資源(variables、functions、mixins…)使用的套件相關設定在 styleResources
    '@nuxtjs/style-resources',
    '@nuxtjs/stylelint-module'
  ],
  styleResources: {
    // global 載入sass的資源(variables、functions、mixins…)
    scss: [
      path.resolve(__dirname, 'assets/sass/helpers/_variables.scss'),
      path.resolve(__dirname, 'assets/sass/helpers/_functions.scss'),
      path.resolve(__dirname, 'assets/sass/helpers/_mixins.scss')
    ]
  },
  sitemap: {
    path: '/sitemap.xml', // sitemap名稱，不用改
    hostname: process.env.DEPLOY_ENV === 'production' ? `${config.domain}` : 'http://localhost:3000/', // 網址
    cacheTime: 1000 * 60 * 15, // 站點路由更新頻率，只在 generate: false有用
    gzip: true, // 生成 .xml.gz 檔的 sitemap
    generate: true, // 允許使用 nuxt generate 生成
    // 靜態頁面路徑
    routes: async (callback) => {
      const posts = await getArticles()
      const routes = posts.map(post => {
        return {
          url: `/article/${post.id}`,
          changefreq: 'yearly',
          priority: 0.5,
          lastmodISO: post.createDate
        }
      })

      // tags
      const tags = posts.reduce((acc, post) => {
        return [...new Set([...acc, ...post.categoryList])]
      }, [])
      routes.push(...tags.map(tag => {
        return {
          url: `/tag/${tag}`,
          changefreq: 'monthly',
          priority: 0.5
        }
      }))
      callback(null, routes)
    }
  },
  plugins: [
    '~/plugins/bootstrap-vue.js',
    '~/plugins/filters.js',
    '~/plugins/disqus.js',
    '~/plugins/font-awesome.js'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.plugins.push(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(en|zh-tw)$/),
        new webpack.ProvidePlugin({
          '$': 'jquery',
          '_': 'lodash',
          'moment': 'moment'
        })
      )
    },
    // 增加打包檔案解析的設定
    analyze: false,
    extractCSS: process.env.DEPLOY_ENV === 'production',
    optimization: {
      minimize: process.env.DEPLOY_ENV === 'production'
    }
  },
  generate: {
    fallback: true,
    routes: async () => {
      const articles = await getArticles()
      let posts = []

      // 文章
      posts.push(...articles.map(post => {
        return `/article/${post.id}`
      }))

      // tags
      const tags = articles.reduce((acc, post) => {
        return [...new Set([...acc, ...post.categoryList])]
      }, [])
      posts.push(...tags.map(tag => {
        return `/tag/${tag}`
      }))

      return posts
    }
  }
}
