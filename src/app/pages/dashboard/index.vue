<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

const cssVariants = cva(
  [],
  {
    variants: {},
    compoundVariants: [],
    defaultVariants: {},
  }
);
</script>

<template>
  <Dashboard />
</template>

<style scoped>

</style>
