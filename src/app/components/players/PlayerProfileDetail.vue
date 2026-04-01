<script setup lang="ts">
const props = withDefaults(defineProps<{
  pageTitle: string;
  playerInfo: PlayerOutDto;
  characterList: CharacterOutDto[];
  characterPageData: ListPageData<CharacterOutDto> | null;
  campaignList: CampaignOutDto[];
  campaignPageData: ListPageData<CampaignOutDto> | null;
  sessionList: SessionOutDto[];
  sessionPageData: ListPageData<SessionOutDto> | null;
  backTo?: string | null;
  backLabel?: string;
}>(), {
  backTo: null,
  backLabel: '목록으로',
});

const playerStore = usePlayerStore();
const { getPlayerStatusInfo, } = playerStore;

const statusInfo = computed(() => getPlayerStatusInfo(props.playerInfo.status));

const characterTotal = computed(() => props.characterPageData?.totalElements ?? props.characterList.length);
const campaignTotal = computed(() => props.campaignPageData?.totalElements ?? props.campaignList.length);
const sessionTotal = computed(() => props.sessionPageData?.totalElements ?? props.sessionList.length);
</script>

<template>
  <SectionPage :title="props.pageTitle">
    <template v-if="props.backTo" #buttons>
      <Button
        :label="props.backLabel"
        color="blue"
        icon-name="fa6-solid:arrow-left"
        @run="navigateTo(props.backTo)"
      />
    </template>

    <div>
      <Box class="flex flex-row-1 text-md mb-5 divide-x-2 divide-slate-200 p-2">
        <div class="flex flex-row gap-2 items-center px-5">
          <span class="text-slate-500">
            플레이어 번호
          </span>
          <span class="text-blue-500">
            {{ props.playerInfo.id }}
          </span>
        </div>
        <div class="flex flex-row gap-2 items-center px-5">
          <span class="text-slate-500">
            플레이어 명
          </span>
          <span class="text-blue-500">
            {{ props.playerInfo.name }}
          </span>
        </div>
        <div class="flex flex-row gap-2 items-center px-5">
          <span class="text-slate-500">
            플레이어 상태
          </span>
          <StatusBadge
            :label="statusInfo.name"
            :color="statusInfo.color"
            class="px-2 py-0 rounded-1"
          />
        </div>
      </Box>

      <Box class="flex flex-row items-start justify-center divide-x-2 divide-slate-200 p-2">
        <InfoItem
          :title="`캐릭터 리스트 (${characterTotal}건)`"
          class="p-5 items-start min-w-0 flex-1"
          direction="col"
        >
          <template #content>
            <div class="flex flex-col gap-2 w-full">
              <NuxtLink
                v-for="character in props.characterList"
                :key="character.id"
                to="/characters"
                class="flex flex-col gap-1 rounded-2 border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <span class="font-700 text-blue-600">
                  {{ character.name }}
                </span>
                <span class="text-sm text-slate-500">
                  Lv.{{ character.currentLevel }} / {{ character.race }}
                </span>
              </NuxtLink>

              <div v-if="!props.characterList.length" class="text-sm text-slate-500">
                표시할 캐릭터가 없습니다.
              </div>
            </div>
          </template>
        </InfoItem>

        <InfoItem
          :title="`참여 캠페인 리스트 (${campaignTotal}건)`"
          class="p-5 items-start min-w-0 flex-1"
          direction="col"
        >
          <template #content>
            <div class="flex flex-col gap-2 w-full">
              <NuxtLink
                v-for="campaign in props.campaignList"
                :key="campaign.id"
                to="/campaigns"
                class="flex flex-col gap-1 rounded-2 border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <span class="font-700 text-blue-600">
                  {{ campaign.name }}
                </span>
                <span class="text-sm text-slate-500">
                  {{ campaign.status }}
                </span>
              </NuxtLink>

              <div v-if="!props.campaignList.length" class="text-sm text-slate-500">
                표시할 캠페인이 없습니다.
              </div>
            </div>
          </template>
        </InfoItem>

        <InfoItem
          :title="`참여 세션 리스트 (${sessionTotal}건)`"
          class="p-5 items-start min-w-0 flex-1"
          direction="col"
        >
          <template #content>
            <div class="flex flex-col gap-2 w-full">
              <NuxtLink
                v-for="session in props.sessionList"
                :key="session.id"
                to="/sessions"
                class="flex flex-col gap-1 rounded-2 border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <span class="font-700 text-blue-600">
                  {{ session.name }}
                </span>
                <span class="text-sm text-slate-500">
                  {{ session.campaign?.name ?? `캠페인 #${session.campaignId}` }}
                </span>
              </NuxtLink>

              <div v-if="!props.sessionList.length" class="text-sm text-slate-500">
                표시할 세션이 없습니다.
              </div>
            </div>
          </template>
        </InfoItem>
      </Box>
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
