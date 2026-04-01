<script setup lang="ts">
const props = defineProps<{
  class?: string;
  title: string;
}>();

const cssVariants = cva(
  [
    'p-5',
  ],
  {
    variants: {},
    compoundVariants: [],
    defaultVariants: {},
  }
);

const slots = defineSlots<{
  default(): any;
  buttons(): any;
}>();
</script>

<template>
  <section
    :class="cn([
      cssVariants({}),
      props.class,
    ])"
  >
    <div class="mb-5 flex flex-row items-center justify-between">
      <h2 class="text-h3">
        {{ title }}
      </h2>
      <div v-if="slots.buttons" class="flex flex-row items-center justify-end">
        <slot name="buttons" />
      </div>
    </div>

    <slot />
  </section>
</template>

<style scoped>

</style>
