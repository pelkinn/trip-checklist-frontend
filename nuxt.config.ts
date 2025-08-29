// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  srcDir: './src/',

  runtimeConfig: {
    public: {
      yandexMetrika: {
        id: 103233734,
      },
      apiBaseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Trip Checklist — Персональные чеклисты путешествий',
      meta: [
        { charset: 'utf-8' },
        { name: 'language', content: 'ru' },
        { 'http-equiv': 'content-language', content: 'ru' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Trip Checklist — создавайте персональные чеклисты для ваших путешествий. Организуйте поездки с помощью удобных списков.',
        },

        {
          property: 'og:title',
          content: 'Trip Checklist — Персональные чеклисты путешествий',
        },
        {
          property: 'og:description',
          content: 'Создавайте персональные чеклисты для ваших путешествий.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://trip-checklist.ru' },
        {
          property: 'og:image',
          content: 'https://trip-checklist.ru/pwa-192x192.png',
        },
      ],
      link: [
        { rel: 'icon', sizes: 'any', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.png' },
      ],
    },
  },

  css: ['~/assets/style/main.scss'],

  components: {
    dirs: ['~/components'],
  },

  plugins: ['~/plugins/vuetify'],

  modules: [
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    '~/modules/yandexMetrika',
    '@nuxtjs/sitemap',
    '@pinia/nuxt',
    async (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => {
        config.plugins!.push(
          vuetify({
            styles: {
              configFile: '/assets/style/settings.scss',
            },
          })
        )
      })
    },
  ],

  vite: {
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      navigateFallback: null,
    },
    manifest: {
      name: 'Trip Checklist',
      short_name: 'Trip Checklist',
      description: 'Персональные чеклисты путешествий',
      lang: 'ru',
      theme_color: '#667eea',
      background_color: '#667eea',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },

  site: {
    url: 'https://trip-checklist.ru',
    name: 'Trip Checklist — Персональные чеклисты путешествий',
  },
})
