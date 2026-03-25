<script setup lang="ts">
const props = defineProps<{
  iconName: IconName;
  class?: string;
}>();

const iconComponent = Icon;

</script>

<template>
  <component
    v-if="iconName"
    :is="iconComponent"
    :icon="iconName"
    :class="cn([
      'w-4 h-4',
      props.class,
    ])"
  />
  <component
    v-else
    :is="iconComponent"
    :icon="'fa6-solid:xmark'"
    :class="cn([
      'w-4 h-4',
      props.class,
    ])"
  />
</template>

<style scoped>

</style>
