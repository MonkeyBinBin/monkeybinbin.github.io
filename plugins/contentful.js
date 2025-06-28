import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createClient } from 'contentful'

// 移除頂層呼叫 useRuntimeConfig，避免 Nuxt instance is unavailable 錯誤
// 若需要建立 client，請於 plugin 內部或 setup function 內呼叫

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const client = createClient({
    space: config.public.ctfSpaceId,
    accessToken: config.public.ctfCdaAccessToken
  })
  nuxtApp.provide('contentfulClient', client)
})
