<script setup lang="ts">
type BoxColor = 'default' | StatusColor;

const props = withDefaults(defineProps<{
  class?: string;
  border?: 'solid' | 'dashed' | 'none';
  color?: BoxColor;
}>(), {
  border: 'solid',
});

const cssVariants = cva(
  [
    'rounded-2 bg-white',
  ],
  {
    variants: {
      border: {
        solid: 'border-2 border-solid',
        dashed: 'border-2 border-dashed',
        none: 'border-0',
      },
      color: {
        default: '',
        gray: '',
        red: '',
        rose: '',
        orange: '',
        yellow: '',
        green: '',
        blue: '',
        purple: '',
        pink: '',
        black: '',
      },
    },
    compoundVariants: [
      {
        color: 'default',
        class: 'border-slate-200',
      },
      {
        color: 'gray',
        class: 'border-stone-200 bg-stone-50',
      },
      {
        color: 'red',
        class: 'border-red-200 bg-red-50',
      },
      {
        color: 'rose',
        class: 'border-rose-200 bg-rose-50',
      },
      {
        color: 'orange',
        class: 'border-orange-200 bg-orange-50',
      },
      {
        color: 'yellow',
        class: 'border-amber-200 bg-amber-50',
      },
      {
        color: 'green',
        class: 'border-emerald-200 bg-emerald-50',
      },
      {
        color: 'blue',
        class: 'border-sky-200 bg-sky-50',
      },
      {
        color: 'purple',
        class: 'border-violet-200 bg-violet-50',
      },
      {
        color: 'pink',
        class: 'border-pink-200 bg-pink-50',
      },
      {
        color: 'black',
        class: 'border-black-200 bg-black-100',
      },
    ],
    defaultVariants: {
      border: 'solid',
      color: 'default',
    },
  }
);
</script>

<template>
  <div
    :class="cn([
      cssVariants({
        border: props.border,
        color: props.color,
      }),
      props.class,
    ])"
  >
    <slot />
  </div>
</template>

<style scoped>

</style>
