<script setup lang="ts" generic="T extends { id: number }">
import Paginator from '@app/components/table/Paginator.vue';

const props = withDefaults(defineProps<{
  title?: string;
  items: T[];
  columns: DataTableColumn<T>[];
  pagination?: ListPageData<T> | null;
  showPagination?: boolean;
  pageButtonCount?: number;
  emptyMessage?: string;
}>(), {
  title: '',
  pagination: null,
  showPagination: true,
  pageButtonCount: 10,
  emptyMessage: '데이터가 존재하지 않습니다.',
});

const emit = defineEmits<{
  pageChange: [page: number];
}>();

defineSlots<{
  [K in string]: (scope: {
    row: T;
    value: any;
  }) => any;
}>();

const normalizedPageButtonCount = computed(() => {
  const count = Math.floor(props.pageButtonCount);

  return count > 0
    ? count
    : 10;
});

const normalizedPagination = computed(() => {
  if (!props.showPagination || !props.pagination)
    return null;

  const raw = props.pagination;
  if (raw.pageSize <= 0 || raw.totalPages <= 0)
    return null;

  const filteredElements = Math.max(raw.filteredElements, 0);
  const totalElements = Math.max(raw.totalElements, filteredElements);
  const totalPages = Math.max(raw.totalPages, 0);
  const firstPage = Math.max(raw.firstPage, 0);
  const lastPage = Math.max(raw.lastPage, firstPage);
  const normalizedCurrentPage = Math.min(Math.max(raw.currentPage, firstPage), lastPage);
  const prevPage = normalizedCurrentPage > firstPage
    ? normalizedCurrentPage - 1
    : 0;
  const nextPage = normalizedCurrentPage < lastPage
    ? normalizedCurrentPage + 1
    : 0;

  return {
    filteredElements,
    totalElements,
    currentPage: normalizedCurrentPage,
    pageSize: raw.pageSize,
    totalPages,
    firstPage,
    lastPage,
    hasPrev: raw.hasPrev,
    hasNext: raw.hasNext,
    prevPage,
    nextPage,
  };
});

const paginationEnabled = computed(() =>
  normalizedPagination.value !== null && normalizedPagination.value.totalPages > 0);

const hasAnyData = computed(() => {
  if (normalizedPagination.value)
    return normalizedPagination.value.filteredElements > 0;

  return props.items.length > 0;
});

const placeholderRowCount = computed(() => {
  const pageSize = normalizedPagination.value?.pageSize;

  if (!pageSize || !hasAnyData.value)
    return 0;

  return Math.max(pageSize - props.items.length, 0);
});

const placeholderRows = computed(() =>
  Array.from({ length: placeholderRowCount.value, }, (_, index) => `placeholder-${index}`));

function handlePageChange(page: number) {
  emit('pageChange', page);
}

function normalizeColumnWidth(width?: DataTableColumn<T>['width']) {
  if (width === undefined)
    return undefined;

  return typeof width === 'number'
    ? `${width}px`
    : width;
}

function getColumnClass(column: DataTableColumn<T>, type: 'header' | 'cell') {
  const hasCustomWidth = column.width !== undefined;

  return cn([
    type === 'header'
      ? 'flex flex-row gap-2 items-center'
      : 'flex items-center',
    hasCustomWidth
      ? 'shrink-0'
      : 'flex-1 min-w-0',
    type === 'header'
      ? column.headerStyle
      : column.cellStyle,
    column.align,
  ]);
}

function getColumnStyle(column: DataTableColumn<T>) {
  const width = normalizeColumnWidth(column.width);

  if (!width)
    return undefined;

  return {
    flex: `0 0 ${width}`,
    width,
    minWidth: width,
  };
}

function getColumnKey(column: DataTableColumn<T>) {
  return String(column.key);
}

function getCellValue(row: T, column: DataTableColumn<T>) {
  const { key, } = column;

  if (typeof key !== 'string')
    return undefined;

  if (!(key in row))
    return undefined;

  return row[key as keyof T];
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <figure class="overflow-hidden rounded-2 border border-stone-300 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div
        v-if="title"
        class="flex items-center justify-between border-b border-stone-200 bg-linear-to-r from-stone-50 to-white px-4 py-3"
      >
        <div id="table-title" class="flex flex-col gap-1">
          <span class="text-md font-700 text-stone-900">
            {{ title }}
          </span>
          <span class="text-xs text-stone-500">
            정리된 목록을 빠르게 훑고 필요한 액션으로 이동합니다.
          </span>
        </div>
      </div>
      <div role="table" aria-labelledby="table-title" class="overflow-hidden">
        <div role="rowgroup" class="border-b border-stone-200 bg-stone-50/90">
          <div role="row" class="flex flex-row gap-0 divide-x divide-dashed divide-stone-200">
            <div
              role="columnheader"
              v-for="column in columns"
              :key="getColumnKey(column)"
              :class="cn([
                getColumnClass(column, 'header'),
                'min-h-10 px-3 py-2 text-xs font-700 tracking-[0.08em] text-stone-500 uppercase',
              ])"
              :style="getColumnStyle(column)"
            >
              <GetIcon
                v-if="column.icon"
                :icon-name="column.icon"
                class="text-stone-400"
              />
              <span>{{ column.label }}</span>
            </div>
          </div>
        </div>

        <div role="rowgroup" class="divide-y divide-stone-100 bg-white">
          <template v-if="hasAnyData">
            <div
              role="row"
              v-for="item in items"
              :key="item.id"
              class="flex flex-row divide-x divide-dashed divide-stone-200 odd:bg-white even:bg-stone-50/70 transition-colors duration-200 ease-in-out hover:bg-sky-50/60"
            >
              <div
                role="cell"
                v-for="column in columns"
                :key="getColumnKey(column)"
                :class="cn([
                  getColumnClass(column, 'cell'),
                  'min-h-13 px-3 py-2 text-sm text-stone-700',
                ])"
                :style="getColumnStyle(column)"
              >
                <template v-if="column.slotName">
                  <slot :name="column.slotName" :row="item" :value="getCellValue(item, column)" />
                </template>

                <template v-else>
                  <span class="block w-full truncate">
                    {{ getCellValue(item, column) ?? '-' }}
                  </span>
                </template>
              </div>
            </div>

            <div
              role="row"
              v-for="placeholderRow in placeholderRows"
              :key="placeholderRow"
              class="flex flex-row divide-x divide-dashed divide-stone-200 odd:bg-white even:bg-stone-50/70"
              aria-hidden="true"
            >
              <div
                role="cell"
                v-for="column in columns"
                :key="`${placeholderRow}-${getColumnKey(column) || 'empty'}`"
                :class="cn([
                  getColumnClass(column, 'cell'),
                  'min-h-13 px-3 py-2 text-sm text-stone-300',
                ])"
                :style="getColumnStyle(column)"
              >
                <span class="block w-full select-none opacity-0">
                  placeholder
                </span>
              </div>
            </div>
          </template>

          <div
            v-else
            class="flex min-h-40 items-center justify-center px-4 py-8 text-center text-sm font-500 text-stone-500"
          >
            {{ emptyMessage }}
          </div>
        </div>
      </div>
    </figure>

    <!-- 페이지네이터 -->
    <Paginator
      v-if="paginationEnabled && normalizedPagination"
      :pagination="normalizedPagination"
      :items-length="items.length"
      :page-button-count="normalizedPageButtonCount"
      @page-change="handlePageChange"
    />
  </div>
</template>

<style scoped>

</style>
