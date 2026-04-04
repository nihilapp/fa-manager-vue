<script setup lang="ts">
const playerStore = usePlayerStore();
const { isAdmin, playerList, playerPageData, } = storeToRefs(playerStore);

const currentPage = ref(0);
const pageSize = 10;

const getPlayerList = async (page: number) => {
  const { execute, } = useGetPlayerList({
    query: {
      page,
      size: pageSize,
    },
  });

  await execute();
};

const onChangePage = (page: number) => {
  currentPage.value = page;
  void getPlayerList(page);
};

const onClickDetail = async (playerId: number) => {
  await navigateTo(`/players/detail/${playerId}`);
};

const onClickEdit = async (playerId: number) => {
  await navigateTo(`/players/detail/${playerId}`);
};

onMounted(() => {
  void getPlayerList(currentPage.value);
});
</script>

<template>
  <SectionPage title="플레이어 목록">
    <template #buttons>
      <Button label="플레이어 등록" color="blue" icon-name="fa6-solid:plus" is-link link="/players/add-player" />
    </template>

    <PlayerListTable
      :items="playerList"
      :pagination="playerPageData"
      :is-admin="isAdmin"
      @page-change="onChangePage"
      @detail="onClickDetail"
      @edit="onClickEdit"
    />
  </SectionPage>
</template>

<style scoped>

</style>
