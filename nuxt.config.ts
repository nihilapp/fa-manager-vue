import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';
import tsconfigPaths from 'vite-tsconfig-paths';

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
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  css: [ '@/app/assets/styles/tailwind.css', ],

  vite: {
    optimizeDeps: {
      include: [
        '@iconify/vue',
        'clsx',
        'tailwind-merge',
        'luxon',
        '@lukemorales/query-key-factory',
        'lodash-es',
        'class-variance-authority',
      ],
    },
    plugins: [
      tailwindcss(),
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
    },
  ],

  imports: {
    autoImport: true,
    dirs: [
      'app/composables',
      'app/composables/**',
      'app/utils',
      'app/utils/**',
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
    ],
    presets: [
      {
        from: 'lodash-es',
        imports: [
          [ 'default', '_', ] as [string, string],
        ],
      },
      {
        from: 'luxon',
        imports: [ 'DateTime', ],
      },
      {
        from: 'uuid',
        imports: [
          [ 'v4', 'uuidv4', ] as [string, string],
        ],
      },
      {
        from: 'class-variance-authority',
        imports: [ 'cva', ],
      },
      {
        from: '@iconify/vue',
        imports: [ 'Icon', ],
      },
    ],
  },

  nitro: {
    imports: {
      autoImport: true,
      dirs: [],
      imports: [
        {
          name: 'RESPONSE_CODE',
          from: '@server/constant/response-code',
        },
        {
          name: 'RESPONSE_MESSAGE',
          from: '@server/constant/response-message',
        },
        {
          name: 'usersTable',
          from: '@server/db/table/users.table',
        },
        {
          name: 'campaignsTable',
          from: '@server/db/table/campaigns.table',
        },
        {
          name: 'campaignMembersTable',
          from: '@server/db/table/campaigns.table',
        },
        {
          name: 'sessionsTable',
          from: '@server/db/table/sessions.table',
        },
        {
          name: 'sessionPlayersTable',
          from: '@server/db/table/sessions.table',
        },
        {
          name: 'sessionLogsTable',
          from: '@server/db/table/sessions.table',
        },
        {
          name: 'charactersTable',
          from: '@server/db/table/characters.table',
        },
        {
          name: 'characterClassesTable',
          from: '@server/db/table/characters.table',
        },
        {
          name: 'currencyTransactionsTable',
          from: '@server/db/table/currency-transactions.table',
        },
        {
          name: 'docsTable',
          from: '@server/db/table/docs.table',
        },
        {
          name: 'logHistoriesTable',
          from: '@server/db/table/logHistories.table',
        },
        {
          name: 'commonColumns',
          from: '@server/db/table/common',
        },
        {
          name: 'statusEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'campaignRoleEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'sessionRoleEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'userRoleEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'userStatusEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'docVisibilityEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'docStatusEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'characterStatusEnum',
          from: '@server/db/table/common',
        },
        {
          name: 'transactionTypeEnum',
          from: '@server/db/table/common',
        },
      ],
      presets: [
        {
          from: 'drizzle-orm',
          imports: [
            'count',
            'sql',
            'and',
            'or',
            'eq',
            'ne',
            'gt',
            'gte',
            'lt',
            'lte',
            'inArray',
            'notInArray',
            'between',
            'notBetween',
            'isNull',
            'isNotNull',
            'ilike',
            'asc',
            'desc',
            'getTableColumns',
          ],
        },
        {
          from: 'drizzle-orm/pg-core',
          imports: [
            'pgTable',
            'bigint',
            'varchar',
            'text',
            'integer',
            'char',
            'timestamp',
            'jsonb',
            'index',
            'uniqueIndex',
            'primaryKey',
            'pgEnum',
          ],
        },
        {
          from: 'lodash-es',
          imports: [
            [ 'default', '_', ] as [string, string],
          ],
        },
        {
          from: 'luxon',
          imports: [ 'DateTime', ],
        },
        {
          from: 'uuid',
          imports: [
            [ 'v4', 'uuidv4', ] as [string, string],
          ],
        },
      ],
    },
  },
});
