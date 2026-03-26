<script setup lang="ts">
const userStore = useUserStore();
const { isAdmin, userList, userPageData, } = storeToRefs(userStore);

const router = useRouter();

const currentPage = ref(0);

const { execute, } = await useGetUserList({
  page: currentPage.value,
  size: 10,
});

const columns = useColumns([
  ColumnBuilder.column('id', '번호')
    .start()
    .width(88)
    .build(),
  ColumnBuilder.column('name', '이름')
    .start()
    .build(),
  ColumnBuilder.column('status', '상태')
    .center()
    .slot('status')
    .width(140)
    .build(),
  ColumnBuilder.column('', '액션')
    .center()
    .slot('actions')
    .width(220)
    .build(),
]);

const statusLabelMap = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  REST: '휴면',
} as const;

function getStatusLabel(value: string) {
  return statusLabelMap[value as keyof typeof statusLabelMap] ?? value;
}

function getStatusBadgeColor(value: string): 'green' | 'gray' | 'yellow' {
  if (value === 'ACTIVE') {
    return 'green';
  }

  if (value === 'INACTIVE') {
    return 'gray';
  }

  return 'yellow';
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

onMounted(() => {
  execute();
});
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
          <StatusBadge
            :label="getStatusLabel(value)"
            :color="getStatusBadgeColor(value)"
            class="min-w-18 justify-center"
          />
        </div>
      </template>

      <template #actions="{row}">
        <div class="flex w-full gap-1.5">
          <Button
            icon-name="fa6-solid:magnifying-glass"
            label="상세보기"
            mode="ghost"
            color="blue"
            button-class="min-h-8 min-w-0 px-2.5 py-1 text-xs"
            icon-class="size-3.5"
            @run="onClickDetail(row.id)"
          />
          <Button
            v-if="isAdmin"
            icon-name="fa6-solid:pen-to-square"
            label="수정"
            mode="outline"
            color="gray"
            button-class="min-h-8 min-w-0 px-2.5 py-1 text-xs"
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
