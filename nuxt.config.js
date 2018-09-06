const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
const webpack = require('webpack')

const baseUrl = process.env.DEPLOY_ENV === 'GH_PAGES' ? '/blog/' : '/'

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '猴猴學語',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      { hid: 'author', name: 'author', content: 'MonkeyBinBin' },
      { hid: 'description', name: 'description', content: '使用 Nuxt.js、 Bootstrap 4 建立的blog。分享與紀錄一些程式開發的東西。' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: `${baseUrl}favicon.ico` }
    ]
  },
  env: {
    baseUrl: baseUrl
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
    '~/plugins/ga.js'
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
    },
    postcss: [
      require('autoprefixer')
    ],
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        '_': 'lodash',
        'moment': 'moment'
      })
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
