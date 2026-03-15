import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true, },

  srcDir: 'src/',
  serverDir: 'src/server/',

  dir: {
    pages: 'app/pages',
    layouts: 'app/layouts',
    middleware: 'app/middleware',
    assets: 'app/assets',
  },

  alias: {
    '@src': fileURLToPath(new URL('./src', import.meta.url)),
    '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    '@server': fileURLToPath(new URL('./src/server', import.meta.url)),
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  css: [ '@/app/assets/styles/tailwind.css', ],

  vite: {
    plugins: [
      tailwindcss() as any,
      tsconfigPaths(),
    ],
  },

  experimental: {
    normalizeComponentNames: true,
  },

  components: false, // 컴포넌트 자동 등록 비활성화

  imports: {
    autoImport: false, // App 오토임포트 비활성화
  },

  nitro: {
    imports: false, // Nitro 오토임포트 비활성화
  },
});
