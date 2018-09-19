const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
const webpack = require('webpack')
const config = require('./config')

const baseUrl = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/blog/' : '/'
const description = '使用 Nuxt.js、 Bootstrap 4 建立的blog。分享與紀錄一些程式開發的東西。'

const posts = require('./static/posts/list.json')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: config.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      { name: 'author', content: 'MonkeyBinBin' },
      { property: 'fb:app_id', content: config.fbId },
      { hid: 'keywords', name: 'keywords', content: config.keywords.join() },
      { hid: 'description', name: 'description', content: description },
      { hid: 'og:title', property: 'og:title', content: config.title },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: `${config.domain}${baseUrl}` },
      { hid: 'og:image', property: 'og:image', content: `${config.domain}${path.join(baseUrl, '/img/fb.jpg')}` },
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
    domain: config.domain
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
    // 主要css樣式(customer)
    '~/assets/sass/main.scss',
    // 載入highlight.js樣式(可選擇不同theme)
    'highlight.js/styles/zenburn.css',
    // 載入aos樣式
    'aos/dist/aos.css'
  ],
  modules: [
    // 'bootstrap-vue/nuxt'
    // have custom bootstrap CSS,需設定css載入
    ['bootstrap-vue/nuxt', { css: false }],
    '@nuxtjs/sitemap',
    // global 載入sass的資源(variables、functions、mixins…)
    ['nuxt-sass-resources-loader', [
      path.resolve(__dirname, 'assets/sass/helpers/_variables.scss'),
      path.resolve(__dirname, 'assets/sass/helpers/_functions.scss'),
      path.resolve(__dirname, 'assets/sass/helpers/_mixins.scss')
    ]],
    ['@nuxtjs/google-tag-manager', { id: 'GTM-N24F89P' }]
  ],
  sitemap: {
    path: '/sitemap.xml', // sitemap名稱，不用改
    hostname: process.env.DEPLOY_ENV === 'GH_PAGES' ? `${config.domain}${baseUrl}` : 'http://localhost:3000/', // 網址
    cacheTime: 1000 * 60 * 15, // 站點路由更新頻率，只在 generate: false有用
    gzip: true, // 生成 .xml.gz 檔的 sitemap
    generate: true, // 允許使用 nuxt generate 生成
    // 排除不要的頁面路由
    exclude: [
      '/tag'
    ],
    // 靜態頁面路徑
    routes: (callback) => {
      const routes = posts.map(post => {
        return {
          url: '/article/' + post.id,
          changefreq: 'daily',
          priority: 0.8,
          lastmodISO: '2017-06-30T13:30:00.000Z'
        }
      })
      callback(null, routes)
    }
  },
  plugins: [
    '~/plugins/filters.js',
    '~/plugins/disqus.js',
    // { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/scrollspy.js', ssr: false }
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
            whitelistPatterns: [/\bhljs\S*/]
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
    postcss: [
      require('autoprefixer')
    ]
  },
  generate: {
    fallback: true,
    routes: () => {
      return posts.map(post => {
        return {
          route: `/article/${post.id}`,
          payload: post
        }
      })
    }
  }
}
