// eslint.config.mjs
import { fileURLToPath, URL } from 'node:url';

import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import vue from 'eslint-plugin-vue';
import vueA11y from 'eslint-plugin-vuejs-accessibility';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const sharedTsRules = {
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/interface-name-prefix': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_' },
  ],
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-shadow': 'warn',
  '@typescript-eslint/no-use-before-define': [
    'error',
    { functions: false, classes: true, variables: true },
  ],
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 기본 ESLint 설정
  js.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    jsx: true,
  }),

  // 기본 언어 옵션
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        es2021: true,
      },
    },
  },

  // 플러그인 등록
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
    },
  },

  // 공통 규칙 및 예외 처리
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: [
      '**/eslint.config.{js,mjs,ts}',
      'eslint.config.{js,mjs,ts}',
      '**/eslint.config.{js,mjs,ts}',
      'eslint.config.mjs',
    ],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
    rules: {
      // 일반 규칙 off
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-unexpected-multiline': 'off',
      'no-use-before-define': 'off',
      'spaced-comment': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'no-irregular-whitespace': 'error',
      'no-param-reassign': 'off',
      'eol-last': ['warn', 'always'],
      'no-plusplus': 'off',
      'no-restricted-syntax': 'off',
      'array-callback-return': 'off',
      'consistent-return': 'off',
      'no-nested-ternary': 'off',
      'no-shadow': 'off',
      'linebreak-style': 'off',
      'prefer-const': 'off',
      'max-len': 'off',
      'no-else-return': 'off',
      'no-lonely-if': 'off',
      'global-require': 'off',
      'class-methods-use-this': 'off',
      'no-useless-constructor': 'off',
      'no-useless-return': 'off',
      'lines-between-class-members': 'off',
      'arrow-body-style': 'off',
      'no-empty-function': 'off',
      'camelcase': 'off',
      'no-empty-pattern': 'off',
      'no-underscore-dangle': 'off',
      'function-call-argument-newline': 'off',
      'function-paren-newline': 'off',

      // stylistic 규칙
      '@stylistic/multiline-ternary': ['warn', 'always'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quotes': [
        'error',
        'single',
        { allowTemplateLiterals: 'always' },
      ],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/array-bracket-spacing': [
        'warn',
        'always',
        {
          arraysInArrays: true,
          singleValue: true,
          objectsInArrays: true,
        },
      ],
      '@stylistic/computed-property-spacing': 'off',
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: { multiline: true, consistent: true },
          ObjectPattern: { multiline: true, consistent: true },
          ImportDeclaration: { multiline: true, consistent: true },
          ExportDeclaration: { multiline: true, consistent: true },
        },
      ],
      '@stylistic/array-element-newline': 'off',
      '@stylistic/array-bracket-newline': 'off',
      '@stylistic/object-property-newline': 'off',
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always',
          functions: 'never',
          objects: 'always',
          imports: 'never',
          exports: 'never',
        },
      ],
      '@stylistic/comma-style': [
        'error',
        'last',
        {
          exceptions: {
            ObjectExpression: true,
            ArrayExpression: true,
            VariableDeclaration: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            ArrowFunctionExpression: true,
          },
        },
      ],
      '@stylistic/indent': [
        'error',
        2,
        {
          FunctionDeclaration: { parameters: 1 },
          FunctionExpression: { parameters: 1 },
          CallExpression: { arguments: 1 },
        },
      ],

    },
  },

  // ts 파일에만 적용되는 파서
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      ...sharedTsRules,
    },
  },

  // 사용자 플러그인/룰 병합
  {
    files: ['**/*.{js,mjs,ts,vue}', 'eslint.config.{js,mjs,ts}'],
    ignores: ['eslint.config.js'],
    plugins: {
      'vue': vue,
      'import-x': importX,
      'vuejs-accessibility': vueA11y,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
        }),
      ],
    },
    rules: {
      // ===== Vue 전용 규칙 =====
      'no-undef': 'off',
      // ===== import-x =====
      'import-x/extensions': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off', // TS 별칭/가상 모듈 환경이면 off 유지
      'import-x/no-dynamic-require': 'off',
      'import-x/prefer-default-export': 'off',
      'import-x/order': ['warn', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: true },
      }],
      'import-x/no-cycle': 'off',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'warn',
    },
  },

  // Vue SFC 전용 설정
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)),
        project: false,
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Vue 3 Composition API
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        watchPostEffect: 'readonly',
        watchSyncEffect: 'readonly',
        readonly: 'readonly',
        isRef: 'readonly',
        unref: 'readonly',
        toRef: 'readonly',
        toRefs: 'readonly',
        toRaw: 'readonly',
        markRaw: 'readonly',
        shallowRef: 'readonly',
        shallowReactive: 'readonly',
        triggerRef: 'readonly',

        // Vue 3 Lifecycle Hooks
        onMounted: 'readonly',
        onUpdated: 'readonly',
        onUnmounted: 'readonly',
        onBeforeMount: 'readonly',
        onBeforeUpdate: 'readonly',
        onBeforeUnmount: 'readonly',
        onActivated: 'readonly',
        onDeactivated: 'readonly',
        onErrorCaptured: 'readonly',
        onRenderTracked: 'readonly',
        onRenderTriggered: 'readonly',

        // Vue 3 Utilities
        nextTick: 'readonly',
        defineComponent: 'readonly',
        defineAsyncComponent: 'readonly',
        getCurrentInstance: 'readonly',
        inject: 'readonly',
        provide: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        defineSlots: 'readonly',
        withDefaults: 'readonly',
        withDirectives: 'readonly',

        // Nuxt 4 Composables
        useNuxtApp: 'readonly',
        useRuntimeConfig: 'readonly',
        useState: 'readonly',
        useCookie: 'readonly',
        useRequestHeaders: 'readonly',
        useRequestURL: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useHead: 'readonly',
        useSeoMeta: 'readonly',
        useSchemaOrg: 'readonly',
        useLazyFetch: 'readonly',
        useFetch: 'readonly',
        useAsyncData: 'readonly',
        useLazyAsyncData: 'readonly',
        navigateTo: 'readonly',
        abortNavigation: 'readonly',
        addRouteMiddleware: 'readonly',
        definePageMeta: 'readonly',
        defineNuxtComponent: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',

        // Server Side Functions
        useServerSeoMeta: 'readonly',
        useServerHead: 'readonly',
        useServerCookie: 'readonly',
        useServerRequestHeaders: 'readonly',
        useServerRequestURL: 'readonly',

        // Client Side Functions
        useClientOnly: 'readonly',
        useClientHead: 'readonly',
        useClientCookie: 'readonly',

        // Utility Functions
        $fetch: 'readonly',
        ofetch: 'readonly',
        createError: 'readonly',
        clearNuxtData: 'readonly',
        refreshCookie: 'readonly',
        preloadRouteComponents: 'readonly',
        prefetchComponents: 'readonly',
        onNuxtReady: 'readonly',
        useNuxtData: 'readonly',
        clearNuxtState: 'readonly',
      },
    },
    rules: {
      ...sharedTsRules,
      // ===== Vue 템플릿 스타일 =====
      // 모든 HTML 속성에 큰따옴표 사용 강제 (v-bind 내부 문자열은 작은따옴표로 쓰기 쉽게 유지)
      'vue/html-quotes': ['error', 'double', { avoidEscape: true }],

      // 속성명 케밥케이스 강제 (my-prop)
      'vue/attribute-hyphenation': ['error', 'always'],

      // 컴포넌트명 PascalCase 강제
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],

      // 멀티라인 태그의 닫는 괄호는 별도 줄에서 태그 시작 위치에 맞춤
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always',
        selfClosingTag: {
          singleline: 'never',
          multiline: 'always',
        },
      }],

      // HTML 태그 닫는 괄호 공백
      'vue/html-closing-bracket-spacing': ['error', {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always',
      }],

      // HTML 들여쓰기
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],

      // 자체 닫는 태그 규칙
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never', // <input>, <br> 등은 자체 닫기 금지
          normal: 'always', // <div></div> → <div />
          component: 'always', // <MyComponent></MyComponent> → <MyComponent />
        },
        svg: 'always',
        math: 'always',
      }],

      // 한 줄당 최대 속성 개수
      // 단일 라인은 제한 없이 허용, 한 번 줄바꿈이 생기면 모두 한 줄에 하나씩
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 100 },
        multiline: { max: 1 },
      }],

      // 멀티라인 속성은 첫 번째 속성부터 다음 줄에서 시작
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below',
      }],

      // 멀티라인 요소 내용 개행
      'vue/multiline-html-element-content-newline': ['error', {
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
      }],

      // 머스태시 보간 공백
      'vue/mustache-interpolation-spacing': ['error', 'always'],

      // 다중 공백 금지
      'vue/no-multi-spaces': 'error',

      // 속성 등호 주변 공백 금지
      'vue/no-spaces-around-equal-signs-in-attribute': 'error',

      // prop 이름 camelCase 강제
      'vue/prop-name-casing': ['error', 'camelCase'],

      // 기본 prop 필수 여부 (off)
      'vue/require-default-prop': 'off',

      // 명시적 emits 필수
      'vue/require-explicit-emits': 'error',

      // 한 줄 요소 내용 개행
      'vue/singleline-html-element-content-newline': ['error', {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
      }],

      // v-bind 단축 문법 강제 (:prop)
      'vue/v-bind-style': ['error', 'shorthand'],

      // v-on 단축 문법 강제 (@event)
      'vue/v-on-style': ['error', 'shorthand'],

      // v-slot 단축 문법 강제 (#slot)
      'vue/v-slot-style': ['error', 'shorthand'],

      // ===== Vue a11y =====
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/anchor-has-content': 'warn',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/aria-role': 'error',
      'vuejs-accessibility/heading-has-content': 'warn',
      'vuejs-accessibility/label-has-for': 'off',
      'vuejs-accessibility/no-autofocus': 'warn',
      'vuejs-accessibility/tabindex-no-positive': 'warn',
      'vue/match-component-file-name': ['warn', {
        extensions: ['vue'],
        shouldMatchCase: true,
      }],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/define-macros-order': ['error', {
        order: ['defineProps', 'defineEmits'],
      }],
      'vue/no-template-shadow': 'warn',
    },
  },

  // 전역 ignore
  {
    ignores: [
      '**/node_modules/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/.nitro/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.d.ts',
      '**/*.log',
      '**/pnpm-lock.yaml',
      '**/.git/**',
      '**/.cursor/**',
      '**/public/**',
    ],
  },
];
