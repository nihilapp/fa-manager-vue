<script setup lang="ts">
const props = withDefaults(defineProps<{
  items?: CharacterOutDto[];
  pagination?: ListPageData<CharacterOutDto> | null;
}>(), {
  items: () => [],
  pagination: null,
});

const emit = defineEmits<{
  pageChange: [page: number];
}>();

type CharacterListRow = CharacterOutDto & {
  beyondLink?: string | null;
};

const columns = useColumns<CharacterListRow>([
  ColumnBuilder.column<CharacterListRow>('name', '이름')
    .start()
    .build(),
  ColumnBuilder.column<CharacterListRow>('classes', '클래스')
    .start()
    .slot('classes')
    .width(280)
    .build(),
  ColumnBuilder.column<CharacterListRow>('currentLevel', '현재 레벨')
    .center()
    .width(120)
    .build(),
  ColumnBuilder.column<CharacterListRow>('currentExp', '현재 경험치')
    .end()
    .width(140)
    .build(),
  ColumnBuilder.column<CharacterListRow>('currentCurrencyGp', '자금')
    .end()
    .slot('funds')
    .width(140)
    .build(),
  ColumnBuilder.column<CharacterListRow>('beyondLink', '비욘드 링크')
    .center()
    .slot('beyondLink')
    .width(160)
    .build(),
]);

const onChangePage = (page: number) => {
  emit('pageChange', page);
};

const getClassText = (row: CharacterListRow) => {
  if (!row.classes.length)
    return '-';

  return row.classes
    .map((characterClass) => `${characterClass.className} Lv.${characterClass.level}`)
    .join(' / ');
};

const getFundsText = (value: number | null | undefined) => {
  return `${value ?? 0} GP`;
};

const getBeyondLink = (row: CharacterListRow) => {
  return row.beyondLink?.trim() || '';
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
    <template #classes="{row}">
      <span class="block w-full truncate">
        {{ getClassText(row as CharacterListRow) }}
      </span>
    </template>

    <template #funds="{value}">
      <span class="block w-full truncate text-right">
        {{ getFundsText(value as number | null | undefined) }}
      </span>
    </template>

    <template #beyondLink="{row}">
      <div class="flex w-full justify-center">
        <Button
          v-if="getBeyondLink(row as CharacterListRow)"
          label="열기"
          mode="ghost"
          color="blue"
          button-class="min-h-8 min-w-0 px-2.5 py-1 text-xs"
          icon-name="fa6-solid:link"
          icon-class="size-3.5"
          is-link
          :link="getBeyondLink(row as CharacterListRow)"
        />
        <span v-else class="text-stone-400">
          -
        </span>
      </div>
    </template>
  </DataTable>
</template>

<style scoped>

</style>
