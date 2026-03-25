<script setup lang="ts">
const props = withDefaults(defineProps<{
  iconName?: IconName;
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  mode?: 'fill' | 'ghost' | 'outline';
  buttonClass?: string;
  iconClass?: string;
}>(), {
  disabled: false,
  loading: false,
  type: 'button',
  mode: 'fill',
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

const buttonModeClass = computed(() => {
  switch (props.mode) {
    case 'ghost':
      return 'border-transparent bg-transparent text-gray-100 hover:bg-stone-700/60 hover:text-white';
    case 'outline':
      return 'border-stone-500 bg-transparent text-gray-100 hover:border-stone-300 hover:bg-stone-800 hover:text-white';
    case 'fill':
    default:
      return 'border-stone-700 bg-stone-700 text-white hover:border-stone-600 hover:bg-stone-600';
  }
});

const buttonClassName = computed(() => cn(
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-2 border px-3 py-2 text-sm font-500 leading-none transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-60',
  !hasLabel.value && 'min-w-10 px-2.5',
  buttonModeClass.value,
  props.loading && 'opacity-80',
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
      v-if="iconName"
      :icon-name="iconName"
      :class="iconClassName"
    />
    <span v-if="hasLabel" class="truncate">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<style scoped>

</style>
