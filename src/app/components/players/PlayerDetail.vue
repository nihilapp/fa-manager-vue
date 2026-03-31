<script setup lang="ts">
const playerStore = usePlayerStore();
const { playerInfo, } = storeToRefs(playerStore);

const sessionStore = useSessionStore();
const { playerSessionPageData, } = storeToRefs(sessionStore);

const router = useRouter();

const onClickBack = () => {
  router.back();
};
</script>

<template>
  <SectionPage v-if="playerInfo" :title="`플레이어 [ ${playerInfo.name} ] 정보`">
    <template #buttons>
      <Button label="목록으로" color="blue" icon-name="fa6-solid:arrow-left" @run="onClickBack" />
    </template>

    <div>
      <Box class="flex flex-row-1 text-xl mb-5 divide-x-2 divide-slate-200">
        <InfoItem title="플레이어 번호" :content="playerInfo.id" />
        <InfoItem title="이름" :content="playerInfo.name" />
        <InfoItem title="상태">
          <template #content>
            {{ playerInfo.status }}
          </template>
        </InfoItem>
      </Box>

      <Box class="divide-x-2 divide-slate-200">
        <InfoItem title="참여 캠페인 리스트">
          <template #content>
            dis
          </template>
        </InfoItem>
        <InfoItem title="캐릭터 리스트">
          <template #content>
            dis
          </template>
        </InfoItem>
        <InfoItem :title="`참여 세션 리스트 (${playerSessionPageData?.totalElements}회)`">
          <template #content>
            dis
          </template>
        </InfoItem>
        <!-- <div> -->
        <!--   <h3>참여 캠페인 리스트</h3> -->
        <!--   <div>{{ playerInfo.campaignMembers }}</div> -->
        <!-- </div> -->
        <!-- <div> -->
        <!--   <h3>캐릭터 리스트</h3> -->
        <!--   <div>{{ playerInfo.characters }}</div> -->
        <!-- </div> -->
        <!-- <div> -->
        <!--   <h3>참여 세션 리스트 총 {{ playerSessionPageData?.totalElements }}회</h3> -->
        <!--   <div /> -->
        <!-- </div> -->
      </Box>
    </div>
  </SectionPage>

  <SectionPage v-else title="오류">
    <div class="text-red-500 font-900 text-h3 text-center">
      플레이어를 찾을 수 없습니다.
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
