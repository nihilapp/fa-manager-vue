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
  <div>dashboard</div>
</template>

<style scoped>

</style>
