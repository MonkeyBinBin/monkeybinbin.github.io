const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
const webpack = require('webpack')
const config = require('./config')

const baseUrl = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/blog/' : '/'
const description = '使用 Nuxt.js、 Bootstrap 4 建立的blog。分享與紀錄一些程式開發的東西。'

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
    'highlight.js/styles/mono-blue.css',
    // 載入aos樣式
    'aos/dist/aos.css'
  ],
  modules: [
    // 'bootstrap-vue/nuxt'
    // have custom bootstrap CSS,需設定css載入
    ['bootstrap-vue/nuxt', { css: false }]
  ],
  plugins: [
    '~/plugins/filters.js',
    '~/plugins/disqus.js',
    { src: '~/plugins/ga.js', ssr: false }
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
      let data = require('./static/posts/list.json')
      return data.map((post) => {
        return {
          route: `/article/${post.id}`,
          payload: post
        }
      })
    }
  }
}
