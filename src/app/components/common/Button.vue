<script setup lang="ts">
const props = withDefaults(defineProps<{
  iconName?: IconName;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  mode?: 'fill' | 'ghost' | 'outline';
  color?: 'gray' | 'red' | 'blue' | 'black';
  buttonClass?: string;
  iconClass?: string;
}>(), {
  disabled: false,
  loading: false,
  type: 'button',
  mode: 'fill',
  color: 'gray',
});

const emit = defineEmits<{
  run: [event: MouseEvent];
}>();

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const slots = useSlots();

const isDisabled = computed(() => props.disabled || props.loading);
const hasLabel = computed(() => Boolean(props.label || slots.default));
const accessibleLabel = computed(() => props.ariaLabel ?? props.label);

const buttonVariants = cva(
  [
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-2 border px-3 py-2 text-sm font-500 leading-none transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-60',
  ],
  {
    variants: {
      mode: {
        fill: '',
        ghost: '',
        outline: '',
      },
      color: {
        gray: '',
        red: '',
        blue: '',
        black: '',
      },
      iconOnly: {
        true: 'min-w-10 px-2.5',
        false: '',
      },
      loading: {
        true: 'opacity-80',
        false: '',
      },
    },
    compoundVariants: [
      {
        mode: 'fill',
        color: 'gray',
        class: 'border-stone-700 bg-stone-700 text-white hover:border-stone-600 hover:bg-stone-600 focus-visible:ring-stone-300/80',
      },
      {
        mode: 'ghost',
        color: 'gray',
        class: 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-stone-300/80',
      },
      {
        mode: 'outline',
        color: 'gray',
        class: 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 focus-visible:ring-stone-300/80',
      },
      {
        mode: 'fill',
        color: 'red',
        class: 'border-red-600 bg-red-600 text-white hover:border-red-500 hover:bg-red-500 focus-visible:ring-red-200/90',
      },
      {
        mode: 'ghost',
        color: 'red',
        class: 'border-red-100 bg-red-50 text-red-700 hover:border-red-200 hover:bg-red-100 hover:text-red-800 focus-visible:ring-red-200/90',
      },
      {
        mode: 'outline',
        color: 'red',
        class: 'border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-800 focus-visible:ring-red-200/90',
      },
      {
        mode: 'fill',
        color: 'blue',
        class: 'border-sky-600 bg-sky-600 text-white hover:border-sky-500 hover:bg-sky-500 focus-visible:ring-sky-200/90',
      },
      {
        mode: 'ghost',
        color: 'blue',
        class: 'border-sky-100 bg-sky-50 text-sky-700 hover:border-sky-200 hover:bg-sky-100 hover:text-sky-800 focus-visible:ring-sky-200/90',
      },
      {
        mode: 'outline',
        color: 'blue',
        class: 'border-sky-200 bg-white text-sky-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:ring-sky-200/90',
      },
      {
        mode: 'fill',
        color: 'black',
        class: 'border-black-900 bg-black-900 text-white hover:border-black-700 hover:bg-black-700 focus-visible:ring-black-300/80',
      },
      {
        mode: 'ghost',
        color: 'black',
        class: 'border-black-100 bg-black-100 text-black-900 hover:border-black-200 hover:bg-black-200 hover:text-black-950 focus-visible:ring-black-300/80',
      },
      {
        mode: 'outline',
        color: 'black',
        class: 'border-black-300 bg-white text-black-900 hover:border-black-400 hover:bg-black-100 hover:text-black-950 focus-visible:ring-black-300/80',
      },
    ],
    defaultVariants: {
      mode: 'fill',
      color: 'gray',
      iconOnly: false,
      loading: false,
    },
  }
);

const buttonClassName = computed(() => cn(
  buttonVariants({
    mode: props.mode,
    color: props.color,
    iconOnly: !hasLabel.value,
    loading: props.loading,
  }),
  attrs.class,
  props.buttonClass
));

const iconClassName = computed(() => cn(
  'shrink-0',
  props.iconClass
));

const forwardedAttrs = computed(() => {
  const { class: className, ...restAttrs } = attrs;
  void className;

  return restAttrs;
});

const onClickButton = (event: MouseEvent) => {
  if (isDisabled.value) {
    event.preventDefault();
    return;
  }

  emit('run', event);
};
</script>

<template>
  <button
    v-bind="forwardedAttrs"
    :aria-busy="loading || undefined"
    :aria-label="!hasLabel ? accessibleLabel : undefined"
    :disabled="isDisabled"
    :type="type"
    :class="buttonClassName"
    @click="onClickButton"
  >
    <GetIcon
      v-if="props.iconName"
      :icon-name="props.iconName"
      :class="iconClassName"
    />
    <span v-if="hasLabel" class="truncate">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<style scoped>

</style>
