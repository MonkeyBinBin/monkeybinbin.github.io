import { defineNuxtPlugin } from '#app'
import VueDisqus from 'vue-disqus'

export default defineNuxtPlugin((nuxtApp) => {
  // 僅在客戶端執行，避免 SSR 時存取瀏覽器 location 物件的錯誤
  if (import.meta.client) {
    nuxtApp.vueApp.use(VueDisqus, {
      shortname: 'monkeybinbinblog'
    })
  }
})
