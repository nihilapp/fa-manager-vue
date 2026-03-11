import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true, },

  srcDir: 'src/',
  serverDir: 'src/server/',

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  css: [ '~/app/assets/styles/tailwind.css', ],

  vite: {
    plugins: [
      tailwindcss() as any,
      tsconfigPaths(),
    ],
  },

  experimental: {
    normalizeComponentNames: true,
  },

  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
      global: true, // 하위 폴더 컴포넌트도 전역 사용
    },
  ],

  imports: {
    dirs: [
      '~/app/composables/**',
      '~/app/utils/**',
      '~/app/types/**', // 프론트엔드/백엔드 공용 타입 자동 임포트
      '~/common/**', // 공통 코드
    ],
  },

  nitro: {
    imports: {
      dirs: [
        './src/server/utils/**', // 서버 유틸 하위 폴더
        './src/server/db/**', // db 및 schema 등 자동 임포트
        './src/app/types/**', // 백엔드 공용 타입 자동 임포트 추가
        './src/common/**', // 공통 코드
      ],
    },
  },
});
