<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();

const cssVariants = cva(
  [],
  {
    variants: {},
    compoundVariants: [],
    defaultVariants: {},
  }
);

const playerStore = usePlayerStore();
const { playerInfo, } = storeToRefs(playerStore);

const sessionStore = useSessionStore();
const { playerSessionList, playerSessionPageData, } = storeToRefs(sessionStore);

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
      <div>
        <div>
          <div>플레이어 번호</div>
          <div>{{ playerInfo.id }}</div>
        </div>
        <div>
          <div>이름</div>
          <div>{{ playerInfo.name }}</div>
        </div>
        <div>
          <div>상태</div>
          <div>{{ playerInfo.status }}</div>
        </div>
      </div>

      <div>
        <div>
          <h3>참여 캠페인 리스트</h3>
          <div>{{ playerInfo.campaignMembers }}</div>
        </div>
        <div>
          <h3>캐릭터 리스트</h3>
          <div>{{ playerInfo.characters }}</div>
        </div>
        <div>
          <h3>참여 세션 리스트 총 {{ playerSessionPageData?.totalElements }}회</h3>
          <div />
        </div>
      </div>
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
