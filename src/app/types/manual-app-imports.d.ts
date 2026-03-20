type VueImports = typeof import('vue');
type PiniaImports = typeof import('pinia');
type NuxtAppImports = typeof import('nuxt/app');
type PiniaNuxtImports = typeof import('@pinia/nuxt/dist/runtime/composables');
type NuxtRouteAnnouncerComponent = typeof import('nuxt/app/components/nuxt-route-announcer')['default'];
type NuxtLayoutComponent = typeof import('nuxt/app/components/nuxt-layout')['default'];
type NuxtPageComponent = typeof import('nuxt/dist/pages/runtime/page')['default'];
type NuxtLinkComponent = typeof import('nuxt/app/components/nuxt-link')['default'];
type NuxtImgComponent = typeof import('@nuxt/image/dist/runtime/components/NuxtImg.vue')['default'];
type NuxtPictureComponent = typeof import('@nuxt/image/dist/runtime/components/NuxtPicture.vue')['default'];
type ClientOnlyComponent = typeof import('nuxt/app/components/client-only')['default'];

interface ManualGlobalComponents {
  NuxtRouteAnnouncer: NuxtRouteAnnouncerComponent;
  NuxtLayout: NuxtLayoutComponent;
  NuxtPage: NuxtPageComponent;
  NuxtLink: NuxtLinkComponent;
  NuxtImg: NuxtImgComponent;
  NuxtPicture: NuxtPictureComponent;
  ClientOnly: ClientOnlyComponent;
}

declare global {
  const ref: VueImports['ref'];
  const computed: VueImports['computed'];
  const reactive: VueImports['reactive'];
  const readonly: VueImports['readonly'];
  const shallowRef: VueImports['shallowRef'];
  const toRef: VueImports['toRef'];
  const toRefs: VueImports['toRefs'];
  const toValue: VueImports['toValue'];
  const unref: VueImports['unref'];
  const watch: VueImports['watch'];
  const watchEffect: VueImports['watchEffect'];
  const onMounted: VueImports['onMounted'];
  const onUnmounted: VueImports['onUnmounted'];
  const onBeforeMount: VueImports['onBeforeMount'];
  const onBeforeUnmount: VueImports['onBeforeUnmount'];
  const nextTick: VueImports['nextTick'];
  
  const defineStore: PiniaImports['defineStore'];
  const storeToRefs: PiniaImports['storeToRefs'];
  const usePinia: PiniaNuxtImports['usePinia'];
  
  const useRoute: NuxtAppImports['useRoute'];
  const useRouter: NuxtAppImports['useRouter'];
  const navigateTo: NuxtAppImports['navigateTo'];
  const useNuxtApp: NuxtAppImports['useNuxtApp'];
  const useRuntimeConfig: NuxtAppImports['useRuntimeConfig'];
  const useState: NuxtAppImports['useState'];
  const useHead: NuxtAppImports['useHead'];
  const useSeoMeta: NuxtAppImports['useSeoMeta'];
  const definePageMeta: NuxtAppImports['definePageMeta'];
  const defineNuxtPlugin: NuxtAppImports['defineNuxtPlugin'];
  
  const appConfig: typeof import('@app/config/app.config');
  type AppConfig = import('@app/types/common.types').AppConfig;
  
  type Ref<T = unknown> = import('vue').Ref<T>;
  type ComputedRef<T = unknown> = import('vue').ComputedRef<T>;
  type WritableComputedRef<T> = import('vue').WritableComputedRef<T>;
  type MaybeRef<T = unknown> = import('vue').MaybeRef<T>;
  type MaybeRefOrGetter<T = unknown> = import('vue').MaybeRefOrGetter<T>;
  type ComponentPublicInstance = import('vue').ComponentPublicInstance;
  type PropType<T = unknown> = import('vue').PropType<T>;
  type VNode = import('vue').VNode;
  
  type Pinia = import('pinia').Pinia;
  type Store = import('pinia').Store;
  type StoreGeneric = import('pinia').StoreGeneric;
  type StoreDefinition = import('pinia').StoreDefinition;
  type StateTree = import('pinia').StateTree;
  
  type UseRoute = NuxtAppImports['useRoute'];
  type UseRouter = NuxtAppImports['useRouter'];
  type UseNuxtApp = NuxtAppImports['useNuxtApp'];
  type UseRuntimeConfig = NuxtAppImports['useRuntimeConfig'];
  type DefineStore = PiniaImports['defineStore'];
  type StoreToRefs = PiniaImports['storeToRefs'];
  
  type AppRoute = ReturnType<NuxtAppImports['useRoute']>;
  type AppRouter = ReturnType<NuxtAppImports['useRouter']>;
  type AppNuxt = ReturnType<NuxtAppImports['useNuxtApp']>;
  type AppRuntimeConfig = ReturnType<NuxtAppImports['useRuntimeConfig']>;
}

declare module '@vue/runtime-core' {
  export interface GlobalComponents extends ManualGlobalComponents {
  }
}

declare module 'vue' {
  export interface GlobalComponents extends ManualGlobalComponents {
  }
}

export {};
