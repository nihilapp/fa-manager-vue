<script setup lang="ts">
import { Icon } from '@iconify/vue';

import type { IconName } from '@app/types/icons';

const props = defineProps<{
  iconName: IconName;
}>();
</script>

<template>
  <Icon
    :icon="iconName"
    :class="cn([
      '',
    ])"
  />
</template>

<style scoped>

</style>
