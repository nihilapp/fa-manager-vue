<script setup lang="ts">
const props = withDefaults(defineProps<{
  items?: PlayerOutDto[];
  pagination?: ListPageData<PlayerOutDto> | null;
  isAdmin?: boolean;
}>(), {
  items: () => [],
  pagination: null,
  isAdmin: false,
});

const emit = defineEmits<{
  pageChange: [page: number];
  detail: [id: number];
  edit: [id: number];
}>();

type PlayerListRow = PlayerOutDto;

const columns = useColumns<PlayerListRow>([
  ColumnBuilder.column<PlayerListRow>('id', '번호')
    .start()
    .width(88)
    .build(),
  ColumnBuilder.column<PlayerListRow>('name', '이름')
    .start()
    .build(),
  ColumnBuilder.column<PlayerListRow>('status', '상태')
    .center()
    .slot('status')
    .width(140)
    .build(),
  ColumnBuilder.column<PlayerListRow>('', '액션')
    .center()
    .slot('actions')
    .width(220)
    .build(),
]);

const statusLabelMap = computed(() => {
  const map = new Map<PlayerStatus, { name: string; color: StatusColor }>();
  map.set('ACTIVE', { name: '활성', color: 'green', });
  map.set('INACTIVE', { name: '비활성', color: 'gray', });
  map.set('REST', { name: '휴면', color: 'orange', });

  return map;
});

const onChangePage = (page: number) => {
  emit('pageChange', page);
};

const onClickDetail = (id: number) => {
  emit('detail', id);
};

const onClickEdit = (id: number) => {
  emit('edit', id);
};

</script>

<template>
  <DataTable
    :items="props.items"
    :columns="columns"
    show-pagination
    :page-button-count="5"
    :pagination="props.pagination"
    @page-change="onChangePage"
  >
    <template #status="{value}">
      <div class="w-full">
        <StatusBadge
          :label="statusLabelMap.get(value as PlayerStatus)!.name"
          :color="statusLabelMap.get(value as PlayerStatus)!.color"
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
          is-link
          :link="(`/players/detail/${row.id}`)"
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
          is-link
          :link="(`/players/detail/${row.id}`)"
          @run="onClickEdit(row.id)"
        />
      </div>
    </template>
  </DataTable>
</template>

<style scoped>

</style>
