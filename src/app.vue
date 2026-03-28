<script setup lang="ts">
const route = useRoute();

if (route.path === '/block') {
  //
}
else {
  const myInfoRequest = await useGetMyPlayerInfo();
  await myInfoRequest.execute();
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
