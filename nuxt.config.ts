// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/dist/css/dx.material.teal.dark.css',
    // 'devextreme/dist/css/dx.material.teal.dark.css'
    // 'devextreme/dist/css/dx.light.css'
  ],
  ssr: false,
  build: {
    transpile: ['vuetify'],
  },
  plugins: [
    '~/plugins/axios.js'
  ],
  components: true,
})
