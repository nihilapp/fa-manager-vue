import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const h3Path = fileURLToPath(new URL('./node_modules/.pnpm/h3@1.15.7/node_modules/h3', import.meta.url));

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true, },

  srcDir: 'src/',
  serverDir: 'src/server/',

  dir: {
    pages: 'app/pages',
    layouts: 'app/layouts',
    middleware: 'app/middleware',
    assets: 'app/assets',
    plugins: 'app/plugins',
  },

  alias: {
    '@src': fileURLToPath(new URL('./src', import.meta.url)),
    '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    '@server': fileURLToPath(new URL('./src/server', import.meta.url)),
    h3: h3Path,
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
      tailwindcss(),
      tsconfigPaths(),
    ],
  },

  experimental: {
    normalizeComponentNames: true,
    nitroAutoImports: false,
  },

  components: false,

  imports: {
    autoImport: false,
    scan: false,
    dirs: [
      'app/composables',
      'app/composables/**',
      'app/stores',
      'app/types',
      'app/types/**',
    ],
    imports: [
      {
        name: 'appConfig',
        from: '@app/config/app.config',
      },
      {
        name: 'RESPONSE_CODE',
        from: '@server/constant/response-code',
      },
      {
        name: 'RESPONSE_MESSAGE',
        from: '@server/constant/response-message',
      },
      {
        name: 'checkAndHandleApiError',
        from: '@app/utils/api-error-handler',
      },
      {
        name: 'queryKeys',
        from: '@app/utils/query-keys',
      },
      {
        name: 'cn',
        from: '@app/utils/cn',
      },
      {
        name: 'apiClient',
        from: '@app/utils/api-client',
      },
    ],
    presets: [
      {
        from: 'lodash-es',
        imports: [
          [ 'default', '_', ],
        ],
      },
      {
        from: 'luxon',
        imports: [ 'DateTime', ],
      },
      {
        from: 'uuid',
        imports: [
          [ 'v4', 'uuidv4', ],
        ],
      },
      {
        from: '@tanstack/vue-query',
        imports: [
          'useQuery',
          'useMutation',
          'useQueryClient',
          'useInfiniteQuery',
          'useQueries',
          'useIsFetching',
          'useIsMutating',
          'useMutationState',
          'keepPreviousData',
        ],
      },
    ],
  },

});
