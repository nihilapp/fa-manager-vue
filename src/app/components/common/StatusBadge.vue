<script setup lang="ts">
const props = withDefaults(defineProps<{
  class?: string;
  color?: 'gray' | 'red' | 'rose' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'black';
  icon?: IconName;
  label: string;
  iconClass?: string;
}>(), {
  color: 'gray',
});

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const cssVariants = cva(
  [
    'inline-flex min-h-7 items-center gap-1.5 rounded-2 border px-2.5 py-1 text-xs font-700 leading-none tracking-[0.04em] whitespace-nowrap transition-colors duration-200 ease-in-out',
  ],
  {
    variants: {
      color: {
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
        color: 'gray',
        class: 'border-stone-200 bg-stone-100 text-stone-700',
      },
      {
        color: 'red',
        class: 'border-red-200 bg-red-50 text-red-700',
      },
      {
        color: 'rose',
        class: 'border-rose-200 bg-rose-50 text-rose-700',
      },
      {
        color: 'orange',
        class: 'border-orange-200 bg-orange-50 text-orange-700',
      },
      {
        color: 'yellow',
        class: 'border-amber-200 bg-amber-50 text-amber-700',
      },
      {
        color: 'green',
        class: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      },
      {
        color: 'blue',
        class: 'border-sky-200 bg-sky-50 text-sky-700',
      },
      {
        color: 'purple',
        class: 'border-violet-200 bg-violet-50 text-violet-700',
      },
      {
        color: 'pink',
        class: 'border-pink-200 bg-pink-50 text-pink-700',
      },
      {
        color: 'black',
        class: 'border-black-200 bg-black-100 text-black-800',
      },
    ],
    defaultVariants: {
      color: 'gray',
    },
  }
);

const badgeClassName = computed(() => cn(
  cssVariants({
    color: props.color,
  }),
  attrs.class,
  props.class
));
</script>

<template>
  <div :class="badgeClassName">
    <GetIcon
      v-if="icon"
      :icon-name="icon"
      :class="cn([
        'size-3.5 shrink-0',
        iconClass,
      ])"
    />
    <span class="truncate">
      {{ label }}
    </span>
  </div>
</template>

<style scoped></style>
