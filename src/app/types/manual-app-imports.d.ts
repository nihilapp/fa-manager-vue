import {
  computed,
  customRef,
  defineComponent,
  defineAsyncComponent,
  effect,
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  h,
  inject,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  markRaw,
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onScopeDispose,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
  provide,
  proxyRefs,
  reactive,
  readonly,
  ref,
  resolveComponent,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  toRaw,
  toRef,
  toRefs,
  triggerRef,
  unref,
  useAttrs,
  useCssModule,
  useCssVars,
  useSlots,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect
} from 'vue';

import {useRouter, useRoute} from 'vue-router';
import {useFetch, useAsyncData, useRuntimeConfig, useHead, useSeoMeta} from '#app';
import {defineStore, storeToRefs} from 'pinia';
import _ from 'lodash-es';
import {DateTime} from 'luxon';
import {v4 as uuidv4} from 'uuid';

declare global {
  // Common Utils
  const _: typeof import('lodash-es');
  const DateTime: typeof import('luxon')['DateTime'];
  const uuidv4: typeof import('uuid')['v4'];

  // Pinia
  const defineStore: typeof import('pinia')['defineStore'];
  const storeToRefs: typeof import('pinia')['storeToRefs'];

  // Vue Core
  const computed: typeof import('vue')['computed'];
  const ref: typeof import('vue')['ref'];
  const reactive: typeof import('vue')['reactive'];
  const onMounted: typeof import('vue')['onMounted'];
  const onUnmounted: typeof import('vue')['onUnmounted'];
  const watch: typeof import('vue')['watch'];
  const watchEffect: typeof import('vue')['watchEffect'];
  const nextTick: typeof import('vue')['nextTick'];
  const defineComponent: typeof import('vue')['defineComponent'];
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent'];
  const h: typeof import('vue')['h'];
  const inject: typeof import('vue')['inject'];
  const provide: typeof import('vue')['provide'];
  const toRef: typeof import('vue')['toRef'];
  const toRefs: typeof import('vue')['toRefs'];
  const unref: typeof import('vue')['unref'];
  const shallowRef: typeof import('vue')['shallowRef'];
  const shallowReactive: typeof import('vue')['shallowReactive'];

  // Nuxt / Router
  const useRouter: typeof import('vue-router')['useRouter'];
  const useRoute: typeof import('vue-router')['useRoute'];
  const useFetch: typeof import('#app')['useFetch'];
  const useAsyncData: typeof import('#app')['useAsyncData'];
  const useRuntimeConfig: typeof import('#app')['useRuntimeConfig'];
  const useHead: typeof import('#app')['useHead'];
  const useSeoMeta: typeof import('#app')['useSeoMeta'];

  // Custom Composables (예시)
  const useSetMeta: typeof import('../composables/useSetMeta')['useSetMeta'];
}

export {};
