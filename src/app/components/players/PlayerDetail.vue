<script setup lang="ts">
const props = defineProps<{
  playerInfo: PlayerOutDto;
  characterList: CharacterOutDto[];
  characterPageData: ListPageData<CharacterOutDto> | null;
  playerSessionList: SessionOutDto[];
  playerSessionPageData: ListPageData<SessionOutDto> | null;
  playerCampaignList: CampaignOutDto[];
  playerCampaignPageData: ListPageData<CampaignOutDto> | null;
}>();
</script>

<template>
  <PlayerProfileDetail
    :page-title="`플레이어 [ ${props.playerInfo.name} ] 정보`"
    :player-info="props.playerInfo"
    :character-list="props.characterList"
    :character-page-data="props.characterPageData"
    :campaign-list="props.playerCampaignList"
    :campaign-page-data="props.playerCampaignPageData"
    :session-list="props.playerSessionList"
    :session-page-data="props.playerSessionPageData"
    back-to="/players"
  />
</template>

<style scoped>

</style>
