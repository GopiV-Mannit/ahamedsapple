// nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config'

require('dotenv').config();

export default defineNuxtConfig({

  modules: ['@vite-pwa/nuxt'],
  pwa: {
    manifest:{
      name: "Ahmeds_Apple",
      short_name: "Ahmeds_Apple",
      start_url: ".",
      display: "standalone",
      background_color: "#fff",
      description: "Ahmeds_Apple",
      icons: [
        {
          src: "icons/inner-logo_64x64.png",
          sizes: "64x64",
          type: "image/png"
        },
        {
          src: "icons/inner-logo_144x144.png",
          sizes: "144x144",
          type: "image/png"
        },
        {
          src: "icons/inner-logo_192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "icons/inner-logo_512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ], 
    },
    workbox:{
      navigateFallback:"/",

    },
    devOptions: {
      enabled: true, //PWA features are active during development , that why we are using true
      type: "module",
    },
  }
})


