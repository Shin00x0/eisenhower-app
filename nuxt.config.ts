// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";


export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.API_KEY_SUPABASE,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.API_KEY_SUPABASE,
    },
  },

  modules: [
    'nuxt-vue3-google-signin', 
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
  ],

  googleSignIn: {
    clientId: process.env.ID_CLIENT || '',
  }

})