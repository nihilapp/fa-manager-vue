<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

const route = useRoute();
const userStore = useUserStore();

onMounted(async () => {
  if (route.path === '/block') {
    return;
  }

  await userStore.getMyInfo();
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <VueQueryDevtools />
</template>
