<script setup lang="ts">
const props = withDefaults(defineProps<{
  pageTitle: string;
  characterInfo: CharacterOutDto;
  backTo?: string | null;
  backLabel?: string;
}>(), {
  backTo: '/characters',
  backLabel: '목록으로',
});

const statusOptions = {
  ACTIVE: {
    name: '활동 중',
    color: 'green',
  },
  RESTING: {
    name: '휴식 중',
    color: 'yellow',
  },
  RETIRED: {
    name: '은퇴',
    color: 'gray',
  },
  DECEASED: {
    name: '사망',
    color: 'red',
  },
} as const satisfies Record<CharacterStatus, { name: string; color: StatusColor }>;

const statusInfo = computed(() => statusOptions[props.characterInfo.status] ?? {
  name: props.characterInfo.status,
  color: 'gray',
});

const currencyItems = computed(() => [
  { label: 'CP', value: props.characterInfo.currentCurrencyCp ?? 0, },
  { label: 'SP', value: props.characterInfo.currentCurrencySp ?? 0, },
  { label: 'EP', value: props.characterInfo.currentCurrencyEp ?? 0, },
  { label: 'GP', value: props.characterInfo.currentCurrencyGp ?? 0, },
  { label: 'PP', value: props.characterInfo.currentCurrencyPp ?? 0, },
]);

const classSummaryItems = computed(() => {
  if (!props.characterInfo.classes.length) {
    return [ '등록된 클래스가 없습니다.', ];
  }

  return props.characterInfo.classes.map((item) => `${item.className} / ${item.subClassName} Lv.${item.level}`);
});

</script>

<template>
  <SectionPage :title="props.pageTitle">
    <template #buttons>
      <div class="flex flex-wrap gap-2">
        <Button
          v-if="props.backTo"
          :label="props.backLabel"
          color="blue"
          icon-name="fa6-solid:arrow-left"
          is-link
          :link="props.backTo"
        />
        <Button
          label="수정"
          mode="outline"
          color="gray"
          icon-name="fa6-solid:pen-to-square"
          is-link
          :link="(`/characters/edit/${props.characterInfo.id}`)"
        />
      </div>
    </template>

    <div class="flex flex-col gap-5">
      <Box class="flex flex-wrap gap-3 p-4">
        <div class="flex flex-row gap-2 items-center">
          <span class="text-slate-500">
            캐릭터 번호
          </span>
          <span class="text-blue-500">
            {{ props.characterInfo.id }}
          </span>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <span class="text-slate-500">
            캐릭터 명
          </span>
          <span class="text-blue-500">
            {{ props.characterInfo.name }}
          </span>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <span class="text-slate-500">
            상태
          </span>
          <StatusBadge
            :label="statusInfo.name"
            :color="statusInfo.color"
            class="px-2 py-0 rounded-1"
          />
        </div>
      </Box>

      <div class="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Box class="flex flex-col gap-4 p-6">
          <h3 class="text-h5 text-stone-900">
            기본 정보
          </h3>

          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-sm text-stone-500">
                오너
              </div>
              <div class="mt-1 font-700 text-stone-900">
                {{ props.characterInfo.user?.name ?? `플레이어 #${props.characterInfo.userId}` }}
              </div>
            </div>
            <div class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-sm text-stone-500">
                캠페인
              </div>
              <div class="mt-1 font-700 text-stone-900">
                {{ props.characterInfo.campaign?.name ?? '선택 안 함' }}
              </div>
            </div>
            <div class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-sm text-stone-500">
                시작 레벨
              </div>
              <div class="mt-1 font-700 text-stone-900">
                Lv.{{ props.characterInfo.startLevel }}
              </div>
            </div>
            <div class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-sm text-stone-500">
                현재 레벨
              </div>
              <div class="mt-1 font-700 text-stone-900">
                Lv.{{ props.characterInfo.currentLevel }}
              </div>
            </div>
            <div class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-sm text-stone-500">
                현재 경험치
              </div>
              <div class="mt-1 font-700 text-stone-900">
                {{ props.characterInfo.currentExp }}
              </div>
            </div>
            <div class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3">
              <div class="text-sm text-stone-500">
                종족
              </div>
              <div class="mt-1 font-700 text-stone-900">
                {{ props.characterInfo.race || '-' }}
              </div>
            </div>
          </div>
        </Box>

        <Box class="flex flex-col gap-4 p-6">
          <h3 class="text-h5 text-stone-900">
            클래스 정보
          </h3>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="className in classSummaryItems"
              :key="className"
              class="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
            >
              {{ className }}
            </span>
          </div>
        </Box>
      </div>

      <div class="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Box class="flex flex-col gap-4 p-6">
          <h3 class="text-h5 text-stone-900">
            현재 자금
          </h3>

          <div class="grid gap-3 grid-cols-2 md:grid-cols-5">
            <div
              v-for="currencyItem in currencyItems"
              :key="currencyItem.label"
              class="rounded-2 border border-solid border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div class="text-sm text-stone-500">
                {{ currencyItem.label }}
              </div>
              <div class="mt-1 font-700 text-stone-900">
                {{ currencyItem.value }}
              </div>
            </div>
          </div>
        </Box>

        <Box class="flex flex-col gap-4 p-6">
          <h3 class="text-h5 text-stone-900">
            참여 세션
          </h3>

          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="sessionPlayer in props.characterInfo.sessions"
              :key="sessionPlayer.sessionId"
              to="/sessions"
              class="rounded-2 border border-solid border-slate-200 px-4 py-3 hover:bg-slate-50"
            >
              <div class="font-700 text-blue-600">
                {{ sessionPlayer.session?.name ?? `세션 #${sessionPlayer.sessionId}` }}
              </div>
              <div class="text-sm text-slate-500">
                {{ sessionPlayer.session?.campaign?.name ?? (props.characterInfo.campaign?.name ?? '캠페인 정보 없음') }}
              </div>
            </NuxtLink>

            <div v-if="!props.characterInfo.sessions.length" class="text-sm text-stone-500">
              참여한 세션이 없습니다.
            </div>
          </div>
        </Box>
      </div>
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
