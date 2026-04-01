<script setup lang="ts">
const route = useRoute();
const playerId = computed(() => +route.params.id!);

const playerInfoReq = useGetPlayerInfo(playerId.value);
const playerSessionListReq = useGetPlayerSessionList(playerId.value);
const playerCampaignListReq = useGetPlayerCampaignList(playerId.value);
const playerCharacterListReq = useGetCharacterList({
  query: {
    userId: playerId.value,
  },
});

const playerStore = usePlayerStore();
const { playerInfo, } = storeToRefs(playerStore);

const sessionStore = useSessionStore();
const { playerSessionPageData, playerSessionList, } = storeToRefs(sessionStore);

const campaignStore = useCampaignStore();
const { playerCampaignList, playerCampaignPageData, } = storeToRefs(campaignStore);

const characterStore = useCharacterStore();
const { characterList, characterPageData, } = storeToRefs(characterStore);

const pageTitle = computed(() => {
  const playerName = playerInfo.value?.name?.trim();

  return playerName
    ? `플레이어 [${playerName}] 정보`
    : '플레이어 정보';
});

useSetMeta({
  title: pageTitle,
  url: `/players/detail/${route.params.id}`,
});

onMounted(() => {
  void playerInfoReq.execute();
  void playerSessionListReq.execute();
  void playerCampaignListReq.execute();
  void playerCharacterListReq.execute();
});
</script>

<template>
  <PlayerProfileDetail
    v-if="playerInfo"
    :page-title="pageTitle"
    :player-info="playerInfo"
    :character-list="characterList"
    :character-page-data="characterPageData"
    :campaign-list="playerCampaignList"
    :campaign-page-data="playerCampaignPageData"
    :session-list="playerSessionList"
    :session-page-data="playerSessionPageData"
    back-to="/players"
  />

  <SectionPage v-else title="오류">
    <div class="text-red-500 font-900 text-h3 text-center">
      플레이어를 찾을 수 없습니다.
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
