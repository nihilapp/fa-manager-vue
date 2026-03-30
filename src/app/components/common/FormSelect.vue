<script setup lang="ts">
type SelectOption = Record<string, unknown>;
type SelectValue = string | number | null;

const props = withDefaults(defineProps<{
  class?: string;
  label?: string;
  name?: string;
  labelClass?: string;
  inputClass?: string;
  description?: string;
  placeholder?: string;
  options?: readonly SelectOption[];
  valueKey?: string;
  labelKey?: string;
}>(), {
  class: '',
  label: '',
  name: '',
  labelClass: '',
  inputClass: '',
  description: '',
  placeholder: '선택해 주세요.',
  options: () => [],
  valueKey: 'value',
  labelKey: 'label',
});

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const VeeField = Field;

const modelValue = defineModel<SelectValue>('model-value', { default: null, });
const isOpen = ref(false);
const rootRef = useTemplateRef<HTMLLabelElement>('rootRef');
const inputId = computed(() => props.name || undefined);
const validationName = computed(() => props.name?.trim() || '');
const hasValidation = computed(() => validationName.value.length > 0);

const cssVariants = cva(
  [
    'relative flex w-full flex-col items-start gap-1',
  ],
  {
    variants: {},
    compoundVariants: [],
    defaultVariants: {},
  }
);

const triggerClassName = (hasError: boolean) => cn([
  'flex min-h-11 w-full items-center justify-between gap-3 rounded-2 border-2 border-solid bg-white px-3 py-2 text-left transition-colors outline-none',
  hasError
    ? 'border-red-400 focus:border-red-500'
    : 'border-slate-200 focus:border-blue-400',
  props.inputClass,
]);

const menuClassName = computed(() => cn([
  'absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-60 overflow-y-auto rounded-3 border border-slate-200 bg-white p-1 shadow-lg',
  !isOpen.value && 'hidden',
]));

const resolveOptionValue = (option: SelectOption): SelectValue => {
  const value = option[props.valueKey];

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
};

const resolveOptionLabel = (option: SelectOption) => {
  const label = option[props.labelKey];

  return typeof label === 'string'
    ? label
    : String(label ?? '');
};

const resolveSelectedLabel = (currentValue: unknown) => {
  const selectedOption = props.options.find((option) => resolveOptionValue(option) === currentValue);

  return selectedOption
    ? resolveOptionLabel(selectedOption)
    : props.placeholder;
};

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const selectOption = (value: SelectValue, onChange?: (nextValue: SelectValue) => void) => {
  if (onChange) {
    onChange(value);
  }
  else {
    modelValue.value = value;
  }

  closeMenu();
};

onClickOutside(rootRef, closeMenu);
</script>

<template>
  <label
    ref="rootRef"
    :class="cn([
      cssVariants({}),
      props.class,
    ])"
  >
    <span
      v-if="label"
      :class="cn([
        labelClass,
      ])"
    >
      {{ label }}
    </span>

    <VeeField
      v-if="hasValidation"
      :name="validationName"
      #default="{ value, errorMessage, handleBlur, handleChange }"
    >
      <div class="relative w-full">
        <button
          :id="inputId"
          v-bind="attrs"
          type="button"
          :class="triggerClassName(Boolean(errorMessage))"
          :aria-expanded="isOpen"
          aria-haspopup="listbox"
          @click="toggleOpen"
          @blur="handleBlur"
        >
          <span :class="cn([ value == null || value === '' ? 'text-stone-400' : 'text-stone-900', 'truncate' ])">
            {{ resolveSelectedLabel(value) }}
          </span>
          <GetIcon
            icon-name="mdi:chevron-down"
            :class="cn([
              'size-5 shrink-0 text-stone-500 transition-transform duration-200',
              isOpen && 'rotate-180',
            ])"
          />
        </button>

        <div
          :class="menuClassName"
          role="listbox"
        >
          <button
            v-for="(option, index) in options"
            :key="`${String(resolveOptionValue(option))}-${index}`"
            type="button"
            class="w-full rounded-2 px-3 py-2 text-left transition-colors hover:bg-slate-100"
            :class="resolveOptionValue(option) === value && 'bg-blue-50 text-blue-700'"
            @click="selectOption(resolveOptionValue(option), handleChange)"
          >
            {{ resolveOptionLabel(option) }}
          </button>
        </div>
      </div>

      <span
        v-if="errorMessage"
        class="text-sm text-red-500"
      >
        {{ errorMessage }}
      </span>
      <span
        v-else-if="description"
        class="text-sm text-stone-500"
      >
        {{ description }}
      </span>
    </VeeField>

    <template v-else>
      <div class="relative w-full">
        <button
          :id="inputId"
          v-bind="attrs"
          type="button"
          :class="triggerClassName(false)"
          :aria-expanded="isOpen"
          aria-haspopup="listbox"
          @click="toggleOpen"
        >
          <span :class="cn([ modelValue == null || modelValue === '' ? 'text-stone-400' : 'text-stone-900', 'truncate' ])">
            {{ resolveSelectedLabel(modelValue) }}
          </span>
          <GetIcon
            icon-name="mdi:chevron-down"
            :class="cn([
              'size-5 shrink-0 text-stone-500 transition-transform duration-200',
              isOpen && 'rotate-180',
            ])"
          />
        </button>

        <div
          :class="menuClassName"
          role="listbox"
        >
          <button
            v-for="(option, index) in options"
            :key="`${String(resolveOptionValue(option))}-${index}`"
            type="button"
            class="w-full rounded-2 px-3 py-2 text-left transition-colors hover:bg-slate-100"
            :class="resolveOptionValue(option) === modelValue && 'bg-blue-50 text-blue-700'"
            @click="selectOption(resolveOptionValue(option))"
          >
            {{ resolveOptionLabel(option) }}
          </button>
        </div>
      </div>

      <span
        v-if="description"
        class="text-sm text-stone-500"
      >
        {{ description }}
      </span>
    </template>
  </label>
</template>

<style scoped>

</style>
