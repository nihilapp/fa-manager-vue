<script setup lang="ts">
const route = useRoute();

const playerInfoReq = useGetPlayerInfo(+route.params.id!);
const playerSessionListReq = useGetPlayerSessionList(+route.params.id!);

const playerStore = usePlayerStore();
const { playerInfo, } = storeToRefs(playerStore);

console.log(playerInfo.value);

useSetMeta({
  title: `플레이어 [${playerInfo.value?.name}] 정보`,
  url: `/players/detail/${route.params.id}`,
});

onMounted(() => {
  playerInfoReq.execute();
  playerSessionListReq.execute();
});
</script>

<template>
  <PlayerDetail />
</template>

<style scoped>

</style>
