<script setup lang="ts">
const props = withDefaults(defineProps<{
  class?: string;
  label?: string;
  name?: string;
  type?: 'text' | 'number' | 'textarea';
  labelClass?: string;
  inputClass?: string;
  description?: string;
}>(), {
  label: '',
  name: '',
  type: 'text',
  labelClass: '',
  inputClass: '',
  description: '',
});

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
const VeeField = Field;

const inputValue = defineModel<string | number>('input-value', { default: '', });
const inputId = computed(() => props.name || undefined);
const validationName = computed(() => props.name?.trim() || '');
const hasValidation = computed(() => validationName.value.length > 0);

const cssVariants = cva(
  [
    'flex flex-col gap-1 w-full items-start',
  ],
  {
    variants: {},
    compoundVariants: [],
    defaultVariants: {},
  }
);

const fieldClassName = (hasError: boolean) => cn([
  'border-2 border-solid w-full p-2 bg-white rounded-2 transition-colors outline-none',
  hasError
    ? 'border-red-400 focus:border-red-500'
    : 'border-slate-200 focus:border-blue-400',
  props.inputClass,
]);
</script>

<template>
  <label
    :class="cn([
      cssVariants({}),
      props.class,
    ])"
  >
    <span
      v-if="label"
      :class="cn([
        '',
        labelClass,
      ])"
    >
      {{ label }}
    </span>

    <VeeField
      v-if="hasValidation"
      :name="validationName"
      #default="{ field, errorMessage }"
    >
      <template v-if="type === 'textarea'">
        <textarea
          :id="inputId"
          v-bind="{ ...field, ...attrs }"
          :class="fieldClassName(Boolean(errorMessage))"
        />
      </template>
      <template v-else>
        <input
          :id="inputId"
          :type="type"
          v-bind="{ ...field, ...attrs }"
          :class="fieldClassName(Boolean(errorMessage))"
        >
      </template>

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
      <textarea
        v-if="type === 'textarea'"
        :id="inputId"
        v-model="inputValue"
        v-bind="attrs"
        :class="fieldClassName(false)"
      />
      <input
        v-else
        :id="inputId"
        :type="type"
        v-model="inputValue"
        v-bind="attrs"
        :class="fieldClassName(false)"
      >

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
