<script setup lang="ts">
const props = defineProps<{
  class?: string;
  title: string;
  content?: string | number | boolean;
  direction?: 'row' | 'col';
}>();

const slots = defineSlots<{
  default(): void;
  content(): void;
}>();

const cssVariants = cva(
  [
    'flex-1 shrink-0 min-w-0 flex gap-2 items-center justify-center',
  ],
  {
    variants: {
      direction: {
        row: 'flex-row',
        col: 'flex-col',
      },
    },
    compoundVariants: [],
    defaultVariants: {
      direction: 'row',
    },
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
    <div class="font-700 p-2 py-1 rounded-2 border-2 border-blue-100 bg-blue-50 text-blue-500">
      {{ title }}
    </div>
    <slot v-if="slots.content" name="content" />
    <div v-else>
      {{ content }}
    </div>
  </div>
</template>

<style scoped>

</style>
