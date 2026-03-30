<script setup lang="ts">
const route = useRoute();

if (route.path === '/block') {
  //
}
else {
  const myInfo = useGetMyInfo();
  await myInfo.execute();
}
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
