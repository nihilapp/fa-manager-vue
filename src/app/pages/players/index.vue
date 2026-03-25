<script setup lang="ts">
useSetMeta({
  title: '플레이어 목록',
  url: '/players',
});

const userStore = useUserStore();
const { isAdmin, } = storeToRefs(userStore);
const router = useRouter();
const pageSize = 10;
const currentPage = ref(0);

const columns: DataTableColumn[] = [
  {
    key: 'id',
    label: '번호',
    align: 'justify-start',
    width: 88,
    headerStyle: 'justify-start',
    cellStyle: 'justify-start',
  },
  { key: 'name', label: '이름', align: 'justify-start', headerStyle: 'justify-start', cellStyle: 'justify-start', },
  {
    key: 'status',
    label: '상태',
    align: 'justify-center',
    slotName: 'status',
    width: 140,
    headerStyle: 'justify-center',
    cellStyle: 'justify-center',
  },
  {
    key: '',
    label: '액션',
    slotName: 'actions',
    width: 220,
    align: 'justify-center',
    headerStyle: 'justify-center',
    cellStyle: 'justify-center',
  },
];

const mockUserList = computed<UserOutDto[]>(() =>
  Array.from({ length: 25, }, (_, index) => {
    const id = index + 1;
    const statusCycle: UserStatus[] = [ 'ACTIVE', 'INACTIVE', 'REST', ];
    const roleCycle: UserRole[] = [ 'ROLE_USER', 'ROLE_ADMIN', 'ROLE_USER', 'ROLE_USER', ];

    return {
      id,
      discordId: `10000000000000${String(id).padStart(2, '0')}`,
      name: `테스트 플레이어 ${String(id).padStart(2, '0')}`,
      role: roleCycle[index % roleCycle.length]!,
      status: statusCycle[index % statusCycle.length]!,
      useYn: 'Y',
      deleteYn: 'N',
      creatorId: 1,
      createDate: `2026-03-${String((index % 28) + 1).padStart(2, '0')}T09:00:00`,
      updaterId: 1,
      updateDate: `2026-03-${String((index % 28) + 1).padStart(2, '0')}T18:00:00`,
      deleterId: null,
      deleteDate: null,
    };
  })
);

const userList = computed(() => {
  const start = currentPage.value * pageSize;

  return mockUserList.value.slice(start, start + pageSize);
});

const userPageData = computed<ListPageData<UserOutDto>>(() => {
  const totalElements = mockUserList.value.length;
  const totalPages = Math.max(Math.ceil(totalElements / pageSize), 1);
  const lastPage = Math.max(totalPages - 1, 0);
  const normalizedCurrentPage = Math.min(currentPage.value, lastPage);

  return {
    totalElements,
    filteredElements: totalElements,
    currentPage: normalizedCurrentPage,
    pageSize,
    totalPages,
    firstPage: 0,
    lastPage,
    hasPrev: normalizedCurrentPage > 0,
    hasNext: normalizedCurrentPage < lastPage,
    isFirst: normalizedCurrentPage === 0,
    isLast: normalizedCurrentPage === lastPage,
    isEmpty: totalElements === 0,
    prevPage: normalizedCurrentPage > 0
      ? normalizedCurrentPage - 1
      : null,
    nextPage: normalizedCurrentPage < lastPage
      ? normalizedCurrentPage + 1
      : null,
  };
});

const statusLabelMap = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  REST: '휴면',
} as const;

function getStatusLabel(value?: string) {
  if (!value)
    return '알 수 없음';

  return statusLabelMap[value as keyof typeof statusLabelMap] ?? '잠수';
}

function getStatusClass(value?: string) {
  if (value === 'ACTIVE')
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';

  if (value === 'INACTIVE')
    return 'border-stone-200 bg-stone-100 text-stone-600';

  return 'border-amber-200 bg-amber-50 text-amber-700';
}

function onChangePage(page: number) {
  currentPage.value = page;
}

async function onClickDetail(userId: string | number) {
  await router.push(`/players/${userId}`);
}

async function onClickEdit(userId: string | number) {
  await router.push(`/players/${userId}`);
}
</script>

<template>
  <div class="mx-auto w-full max-w-295 px-3 py-4 md:px-4 lg:px-6">
    <DataTable
      title="플레이어 리스트"
      :items="userList"
      :columns="columns"
      show-pagination
      :page-button-count="5"
      :pagination="userPageData"
      @page-change="onChangePage"
    >
      <template #status="{value}">
        <div class="w-full">
          <span
            :class="cn([
              'inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-700 tracking-[0.04em]',
              getStatusClass(value),
            ])"
          >
            {{ getStatusLabel(value) }}
          </span>
        </div>
      </template>

      <template #actions="{row}">
        <div class="flex w-full gap-1.5">
          <Button
            icon-name="fa6-solid:magnifying-glass"
            label="상세보기"
            mode="ghost"
            button-class="min-h-8 min-w-0 px-2.5 py-1 text-xs border-stone-200 bg-white text-stone-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            icon-class="size-3.5"
            @run="onClickDetail(row.id)"
          />
          <Button
            v-if="isAdmin"
            icon-name="fa6-solid:pen-to-square"
            label="수정"
            mode="outline"
            button-class="min-h-8 min-w-0 px-2.5 py-1 text-xs border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
            icon-class="size-3.5"
            @run="onClickEdit(row.id)"
          />
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
