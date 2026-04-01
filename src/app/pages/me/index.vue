<script setup lang="ts">
const myInfoReq = useGetMyInfo();
const myCampaignListReq = useGetMyCampaignList();
const myCharacterListReq = useGetMyCharacterList();
const mySessionListReq = useGetMySessionList();

useSetMeta({
  title: '내 정보',
  url: '/me',
});

const playerStore = usePlayerStore();
const { myInfo, } = storeToRefs(playerStore);

const campaignStore = useCampaignStore();
const { myCampaignList, myCampaignPageData, } = storeToRefs(campaignStore);

const characterStore = useCharacterStore();
const { myCharacterList, myCharacterPageData, } = storeToRefs(characterStore);

const sessionStore = useSessionStore();
const { mySessionList, mySessionPageData, } = storeToRefs(sessionStore);

onMounted(() => {
  void myInfoReq.execute();
  void myCampaignListReq.execute();
  void myCharacterListReq.execute();
  void mySessionListReq.execute();
});

</script>

<template>
  <PlayerProfileDetail
    v-if="myInfo"
    page-title="내 정보"
    :player-info="myInfo"
    :character-list="myCharacterList"
    :character-page-data="myCharacterPageData"
    :campaign-list="myCampaignList"
    :campaign-page-data="myCampaignPageData"
    :session-list="mySessionList"
    :session-page-data="mySessionPageData"
  />

  <SectionPage v-else title="오류">
    <div class="text-red-500 font-900 text-h3 text-center">
      내 정보를 불러오지 못했습니다.
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
