declare global {
  type Ref<T = unknown> = import('vue').Ref<T>;
  type ComputedRef<T = unknown> = import('vue').ComputedRef<T>;
  type WritableComputedRef<T> = import('vue').WritableComputedRef<T>;
  type MaybeRef<T = unknown> = import('vue').MaybeRef<T>;
  type MaybeRefOrGetter<T = unknown> = import('vue').MaybeRefOrGetter<T>;
  type ComponentPublicInstance = import('vue').ComponentPublicInstance;
  type PropType<T = unknown> = import('vue').PropType<T>;
  type VNode = import('vue').VNode;
  type AppConfig = import('@app/types/common.types').AppConfig;
}

export {};
