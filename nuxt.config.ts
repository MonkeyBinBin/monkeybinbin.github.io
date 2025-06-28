import { defineNuxtConfig } from 'nuxt/config'
import config from './config/index.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineNuxtConfig({
  app: {
    head: {
      title: config.title,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'author', content: 'MonkeyBinBin' },
        { property: 'og:type', content: 'article' },
        { name: 'description', content: config.description },
        { property: 'fb:app_id', content: config.fbId },
        { name: 'keywords', content: config.keywords.join() },
        { property: 'og:title', content: config.title },
        { property: 'og:site_name', content: config.title },
        { property: 'og:url', content: `${config.domain}/` },
        { property: 'og:image', content: `${config.domain}/img/share.jpg` },
        { property: 'og:image:width', content: '1080' },
        { property: 'og:image:height', content: '1080' },
        { property: 'og:description', content: config.description },
        { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: `${config.domain}/` }
      ],
      script: [
        // Google Tag Manager
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N24F89P');`,
          type: 'text/javascript'
        }
      ]
    }
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    'highlight.js/styles/vs.css',
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/sass/main.scss'
  ],
  runtimeConfig: {
    public: {
      baseUrl: '/',
      title: config.title,
      keywords: config.keywords,
      description: config.description,
      domain: config.domain,
      CTF_SPACE_ID: config.CTF_SPACE_ID,
      CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN,
      CTF_BLOG_POST_TYPE_ID: config.CTF_BLOG_POST_TYPE_ID,
      fbId: config.fbId,
      // 若未設定環境變數則 fallback 至 config 內的值
      ctfSpaceId: process.env.CTF_SPACE_ID || config.CTF_SPACE_ID,
      ctfCdaAccessToken: process.env.CTF_CDA_ACCESS_TOKEN || config.CTF_CDA_ACCESS_TOKEN
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use \'~/assets/sass/helpers/_variables.scss\' as *; @use \'~/assets/sass/helpers/_functions.scss\' as *; @use \'~/assets/sass/helpers/_mixins.scss\' as *;'
        }
      }
    },
    define: {
      'process.env': {
        baseUrl: '/',
        title: config.title,
        keywords: config.keywords,
        description: config.description,
        domain: config.domain,
        CTF_SPACE_ID: process.env.CTF_SPACE_ID || config.CTF_SPACE_ID,
        CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN || config.CTF_CDA_ACCESS_TOKEN,
        CTF_BLOG_POST_TYPE_ID: process.env.CTF_BLOG_POST_TYPE_ID || config.CTF_BLOG_POST_TYPE_ID
      }
    }
  },
  compatibilityDate: '2025-06-28',
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['motion-div'].includes(tag)
    }
  },
  nitro: {
    prerender: {
      routes: (() => {
        try {
          const routesPath = path.resolve(__dirname, 'scripts/generate-routes.json')

          if (fs.existsSync(routesPath)) {
            const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'))
            // 過濾掉無效的路徑
            return routes.filter(route =>
              typeof route === 'string' &&
              !route.includes('[object Object]') &&
              !route.includes('undefined')
            )
          }
        } catch (error) {
          console.warn('無法載入 generate-routes.json:', error.message)
        }
        return []
      })(),
      failOnError: false
    }
  },
  plugins: [
    '~/plugins/bootstrap-vue-next.js',
    '~/plugins/contentful.js',
    '~/plugins/filters.js',
    '~/plugins/disqus.js',
    '~/plugins/font-awesome.js',
    '~/plugins/motion.js'
  ]
})
