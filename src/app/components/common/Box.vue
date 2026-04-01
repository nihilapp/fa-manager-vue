<script setup lang="ts">
const props = withDefaults(defineProps<{
  class?: string;
  borderStyle?: 'solid' | 'dashed' | 'none';
  borderColor?: 'slate' | 'stone';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}>(), {
  borderStyle: 'solid',
  borderColor: 'slate',
  padding: 'md',
});

const cssVariants = cva(
  [
    'rounded-2 bg-white',
  ],
  {
    variants: {
      borderStyle: {
        solid: 'border-2 border-solid',
        dashed: 'border border-dashed',
        none: 'border-0',
      },
      borderColor: {
        slate: 'border-slate-200',
        stone: 'border-stone-300',
      },
      padding: {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    compoundVariants: [],
    defaultVariants: {
      borderStyle: 'solid',
      borderColor: 'slate',
      padding: 'md',
    },
  }
);
</script>

<template>
  <div
    :class="cn([
      cssVariants({
        borderStyle: props.borderStyle,
        borderColor: props.borderColor,
        padding: props.padding,
      }),
      props.class,
    ])"
  >
    <slot />
  </div>
</template>

<style scoped>

</style>
