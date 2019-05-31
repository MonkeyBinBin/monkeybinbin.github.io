const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const map = require('lodash/map')

const baseUrl = '/'
const description = '使用 Nuxt.js、 Bootstrap 4 建立的blog。分享與紀錄一些程式開發的東西。'

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
    select: 'fields.id,fields.createDate,fields.title,fields.slug,fields.tags',
    order: '-fields.createDate'
  })
    .then(res => map(res.items, item => item.fields))
    .catch(() => Promise.resolve([]))
}

module.exports = {
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
      { hid: 'description', name: 'description', content: description },
      { hid: 'og:title', property: 'og:title', content: config.title },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: `${config.domain}${baseUrl}` },
      { hid: 'og:image', property: 'og:image', content: `${path.join(config.domain, baseUrl, '/img/fb.jpg')}` },
      { hid: 'og:image:width', property: 'og:image:width', content: '474' },
      { hid: 'og:image:height', property: 'og:image:height', content: '474' },
      { hid: 'og:description', property: 'og:description', content: description }
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
    base: baseUrl,
    // 換頁將網頁捲至最上方
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  /*
  ** Customize the progress bar color
  */
  loading: {
    color: '#3B8070',
    height: '4px'
  },
  css: [
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
    '@nuxtjs/sitemap',
    ['@nuxtjs/google-tag-manager', { id: 'GTM-N24F89P' }],
    // global 載入sass的資源(variables、functions、mixins…)使用的套件相關設定在 styleResources
    '@nuxtjs/style-resources',
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
    // 排除不要的頁面路由
    exclude: [
      '/tag'
    ],
    // 靜態頁面路徑
    routes: async (callback) => {
      const posts = await getArticles()
      const routes = posts.map(post => {
        return {
          url: '/article/' + post.id,
          changefreq: 'daily',
          priority: 0.8,
          lastmodISO: post.createDate
        }
      })
      callback(null, routes)
    }
  },
  plugins: [
    '~/plugins/bootstrap-vue.js',
    '~/plugins/filters.js',
    '~/plugins/disqus.js',
    // 改用google tag manager, ga設定在上面, 觸發事件需設為"History Change(記錄變更)"
    // { src: '~/plugins/ga.js', mode: 'client' },
    { src: '~/plugins/scrollspy.js', mode: 'client' },
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
      if (!isDev) {
        // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
        // for more information about purgecss.
        config.plugins.push(
          new PurgecssPlugin({
            // Specify the locations of any files you want to scan for class names.
            paths: glob.sync([
              path.join(__dirname, './pages/**/*.vue'),
              path.join(__dirname, './layouts/**/*.vue'),
              path.join(__dirname, './components/**/*.vue')
            ]),
            whitelist: [
              'html',
              'body',
              'ul',
              'ol',
              'pre',
              'code',
              'blockquote'
            ],
            whitelistPatterns: [/\bhljs\S*/, /\baos\S*/]
          })
        )
      }

      config.plugins.push(
        new webpack.ProvidePlugin({
          '$': 'jquery',
          '_': 'lodash',
          'moment': 'moment'
        })
      )

      // 增加text-loader載入md檔案(for server render)
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: 'text-loader'
        }
      )
    },
    postcss: {
      plugins: {},
      preset: {
        autoprefixer: {
          grid: true
        }
      }
    },
    // 增加打包檔案解析的設定
    analyze: false,
    extractCSS: process.env.DEPLOY_ENV === 'production',
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  },
  generate: {
    fallback: true,
    routes: async () => {
      const posts = await getArticles()
      return posts.map(post => {
        return {
          route: `/article/${post.id}`,
          payload: post
        }
      })
    }
  }
}
