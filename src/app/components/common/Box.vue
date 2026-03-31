<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

const cssVariants = cva(
  [
    'border-2 border-solid border-slate-200 rounded-2 bg-white p-5',
  ],
  {
    variants: {},
    compoundVariants: [],
    defaultVariants: {},
  }
);
</script>

<template>
  <div
    :class="cn([
      cssVariants({}),
      props.class,
    ])"
  >
    <slot />
  </div>
</template>

<style scoped>

</style>
