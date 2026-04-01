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
    'flex-1 shrink-0 min-w-0 flex gap-2 items-start',
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
      cssVariants({direction}),
      props.class,
    ])"
  >
    <div class="font-700 text-blue-500">
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
