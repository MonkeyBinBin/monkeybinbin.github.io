import { defineNuxtPlugin } from '#app'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faHome, faSearch, faTag, faArrowUp, faCalendarAlt, faArrowRight } from '@fortawesome/free-solid-svg-icons'

// 註冊常用 icon
library.add(faUser, faHome, faSearch, faTag, faArrowUp, faCalendarAlt, faArrowRight)

export default defineNuxtPlugin((nuxtApp) => {
  // 全域註冊 FontAwesomeIcon 元件
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
