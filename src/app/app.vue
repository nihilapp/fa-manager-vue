<script setup lang='ts'>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <VueQueryDevtools />
</template>
