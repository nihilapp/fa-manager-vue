<script setup lang='ts'>
import Home from '@app/components/common/Home.vue';
import { useSetMeta } from '@app/composables/useSetMeta';

useSetMeta({
  title: 'Home',
  url: '/',
});
</script>

<template>
  <Home />
</template>

<style scoped>
</style>
