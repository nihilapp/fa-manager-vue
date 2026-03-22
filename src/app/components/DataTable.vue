<script setup lang="ts">
type DataTableRow = Record<string, any> & {
  id: string | number;
};

const props = withDefaults(defineProps<{
  items: DataTableRow[];
  columns: DataTableColumn[];
  pagination?: ListPageData<DataTableRow> | null;
  showPagination?: boolean;
  pageButtonCount?: number;
}>(), {
  pagination: null,
  showPagination: true,
  pageButtonCount: 10,
});

const emit = defineEmits<{
  pageChange: [page: number];
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
  const currentPage = raw.currentPage;
  const pageSize = raw.pageSize;

  if (currentPage === null || pageSize === null || pageSize <= 0)
    return null;

  const filteredElements = Math.max(raw.filteredElements ?? raw.totalElements ?? props.items.length, 0);
  const totalElements = Math.max(raw.totalElements ?? filteredElements, filteredElements);
  const totalPages = Math.max(raw.totalPages ?? Math.ceil(filteredElements / pageSize), 0);
  const firstPage = raw.firstPage ?? 0;
  const lastPage = raw.lastPage ?? Math.max(firstPage, totalPages - 1);
  const normalizedCurrentPage = Math.min(Math.max(currentPage, firstPage), lastPage);
  const prevPage = raw.prevPage ?? (normalizedCurrentPage > firstPage
    ? normalizedCurrentPage - 1
    : null);
  const nextPage = raw.nextPage ?? (normalizedCurrentPage < lastPage
    ? normalizedCurrentPage + 1
    : null);

  return {
    filteredElements,
    totalElements,
    currentPage: normalizedCurrentPage,
    pageSize,
    totalPages,
    firstPage,
    lastPage,
    hasPrev: raw.hasPrev ?? prevPage !== null,
    hasNext: raw.hasNext ?? nextPage !== null,
    prevPage,
    nextPage,
  };
});

const paginationEnabled = computed(() =>
  normalizedPagination.value !== null && normalizedPagination.value.totalPages > 0);

const filteredElements = computed(() =>
  normalizedPagination.value?.filteredElements ?? props.items.length);

const currentPage = computed(() =>
  normalizedPagination.value?.currentPage ?? 0);

const pageSize = computed(() =>
  normalizedPagination.value?.pageSize ?? null);

const totalPages = computed(() =>
  normalizedPagination.value?.totalPages ?? 0);

const firstPage = computed(() =>
  normalizedPagination.value?.firstPage ?? 0);

const lastPage = computed(() =>
  normalizedPagination.value?.lastPage ?? 0);

const hasPrev = computed(() =>
  normalizedPagination.value?.hasPrev ?? false);

const hasNext = computed(() =>
  normalizedPagination.value?.hasNext ?? false);

const prevPage = computed(() =>
  normalizedPagination.value?.prevPage ?? null);

const nextPage = computed(() =>
  normalizedPagination.value?.nextPage ?? null);

const startItem = computed(() => {
  if (!paginationEnabled.value || props.items.length === 0 || pageSize.value === null)
    return 0;

  return currentPage.value * pageSize.value + 1;
});

const endItem = computed(() => {
  if (!paginationEnabled.value || props.items.length === 0)
    return 0;

  return startItem.value + props.items.length - 1;
});

const pageGroupStart = computed(() =>
  Math.floor(currentPage.value / normalizedPageButtonCount.value) * normalizedPageButtonCount.value);

const pageNumbers = computed(() => {
  if (!paginationEnabled.value || totalPages.value <= 0)
    return [];

  const count = Math.min(
    normalizedPageButtonCount.value,
    totalPages.value - pageGroupStart.value
  );

  return Array.from({ length: count, }, (_, index) => pageGroupStart.value + index);
});

function goToPage(page: number) {
  if (!paginationEnabled.value)
    return;

  const nextPageIndex = Math.min(Math.max(page, firstPage.value), lastPage.value);

  if (nextPageIndex === currentPage.value)
    return;

  emit('pageChange', nextPageIndex);
}

function goToFirstPage() {
  goToPage(firstPage.value);
}

function goToPrevPage() {
  if (!hasPrev.value || prevPage.value === null)
    return;

  goToPage(prevPage.value);
}

function goToNextPage() {
  if (!hasNext.value || nextPage.value === null)
    return;

  goToPage(nextPage.value);
}

function goToLastPage() {
  goToPage(lastPage.value);
}

function normalizeColumnWidth(width?: DataTableColumn['width']) {
  if (width === undefined)
    return undefined;

  return typeof width === 'number'
    ? `${width}px`
    : width;
}

function getColumnClass(column: DataTableColumn, type: 'header' | 'cell') {
  const hasCustomWidth = column.width !== undefined;

  return cn([
    type === 'header'
      ? 'flex flex-row gap-1'
      : 'flex',
    hasCustomWidth
      ? 'shrink-0'
      : 'flex-1 min-w-0',
    type === 'header'
      ? column.headerStyle
      : column.cellStyle,
    column.align,
  ]);
}

function getColumnStyle(column: DataTableColumn) {
  const width = normalizeColumnWidth(column.width);

  if (!width)
    return undefined;

  return {
    flex: `0 0 ${width}`,
    width,
    minWidth: width,
  };
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- 테이블 -->
    <div class="rounded-1 border border-blue-500 text-stone-900">
      <div class="overflow-x-auto">
        <div role="table" class="min-w-full">
          <!-- 테이블 헤더 -->
          <div role="rowgroup">
            <div role="row" class="flex flex-row border-b border-blue-200 bg-blue-50 rounded-t-1">
              <div
                role="columnheader"
                v-for="column in columns"
                :key="column.key"
                :class="cn([
                  getColumnClass(column, 'header'),
                  'min-h-10 items-center border-r border-dashed border-blue-200 px-3 py-2 text-xs font-700 tracking-[0.08em] text-blue-700 uppercase last:border-r-0',
                ])"
                :style="getColumnStyle(column)"
              >
                <GetIcon v-if="column.icon" :icon-name="column.icon" />
                {{ column.label }}
              </div>
            </div>
          </div>

          <!-- 테이블 데이터 -->
          <div role="rowgroup">
            <!-- 테이블 행 -->
            <!-- 데이터가 존재할 경우 -->
            <template v-if="items.length > 0">
              <div
                role="row"
                v-for="item in items"
                :key="item.id"
                class="flex flex-row border-b border-stone-200 bg-white transition-colors duration-150 ease-in-out hover:bg-blue-50/60 last:border-b-0 last:rounded-b-1"
              >
                <!-- 테이블 셀 -->
                <div
                  role="cell"
                  v-for="column in columns"
                  :key="column.key"
                  :class="cn([
                    getColumnClass(column, 'cell'),
                    'min-h-10 items-center border-r border-dashed border-stone-200 bg-stone-50/70 px-3 py-2 text-sm text-stone-800 last:border-r-0',
                  ])"
                  :style="getColumnStyle(column)"
                >
                  <!-- 데이터가 가공되어야 할 경우 슬롯으로 접근하도록 함. -->
                  <template v-if="column.slotName">
                    <slot :name="column.slotName" :row="item" :value="item[column.key]" />
                  </template>

                  <!-- 데이터가 가공될 필요가 없으면 그냥 그림. -->
                  <template v-else>
                    <span>{{ item[column.key] ?? '-' }}</span>
                  </template>
                </div>
              </div>
            </template>

            <div
              v-else
              class="flex min-h-24 items-center justify-center bg-white px-4 py-8 text-sm text-stone-500"
            >
              데이터가 존재하지 않습니다.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이터 -->
    <div
      v-if="paginationEnabled"
      class="flex min-h-9 items-center justify-between px-3 py-2 text-sm text-stone-700"
    >
      <div class="flex flex-row gap-1 whitespace-nowrap">
        <span>{{ startItem }}</span>
        <span>-</span>
        <span>{{ endItem }}</span>
        <span> / {{ filteredElements }}</span>
      </div>
      <div class="flex flex-row gap-1">
        <button type="button" :disabled="!hasPrev" @click="goToFirstPage">
          처음
        </button>
        <button type="button" :disabled="!hasPrev" @click="goToPrevPage">
          이전
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          type="button"
          :disabled="page === currentPage"
          @click="goToPage(page)"
        >
          {{ page + 1 }}
        </button>
        <button type="button" :disabled="!hasNext" @click="goToNextPage">
          다음
        </button>
        <button type="button" :disabled="!hasNext" @click="goToLastPage">
          마지막
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
