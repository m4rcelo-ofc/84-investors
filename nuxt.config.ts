// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 900],
    },
    display: 'swap',
  },

  app: {
    head: {
      title: '84 Capital - Dashboard',
      htmlAttrs: {
        lang: 'pt-BR',
        class: 'dark',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
})
