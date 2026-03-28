<script setup lang="ts">
const props = defineProps<{
  pagination: {
    filteredElements: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    firstPage: number;
    lastPage: number;
    hasPrev: boolean;
    hasNext: boolean;
    prevPage: number;
    nextPage: number;
  };
  itemsLength: number;
  pageButtonCount: number;
}>();

const emit = defineEmits<{
  pageChange: [page: number];
}>();

const startItem = computed(() => {
  if (props.itemsLength === 0)
    return 0;

  return props.pagination.currentPage * props.pagination.pageSize + 1;
});

const endItem = computed(() => {
  if (props.itemsLength === 0)
    return 0;

  return startItem.value + props.itemsLength - 1;
});

const pageNumbers = computed(() => {
  if (props.pagination.totalPages <= 0)
    return [];

  const pageGroupStart = Math.floor(props.pagination.currentPage / props.pageButtonCount) * props.pageButtonCount;
  const count = Math.min(
    props.pageButtonCount,
    props.pagination.totalPages - pageGroupStart
  );

  return Array.from({ length: count, }, (_, index) => pageGroupStart + index);
});

function emitPageChange(page: number) {
  const nextPage = Math.min(Math.max(page, props.pagination.firstPage), props.pagination.lastPage);

  if (nextPage === props.pagination.currentPage)
    return;

  emit('pageChange', nextPage);
}

function goToFirstPage() {
  emitPageChange(props.pagination.firstPage);
}

function goToPrevPage() {
  if (!props.pagination.hasPrev)
    return;

  emitPageChange(props.pagination.prevPage);
}

function goToNextPage() {
  if (!props.pagination.hasNext)
    return;

  emitPageChange(props.pagination.nextPage);
}

function goToLastPage() {
  emitPageChange(props.pagination.lastPage);
}
</script>

<template>
  <div class="flex flex-col gap-2 rounded-2 border border-stone-300 bg-white px-3 py-2 text-sm text-stone-600 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex-row md:items-center md:justify-between">
    <div class="flex flex-row gap-1 whitespace-nowrap text-xs font-500">
      <span class="text-stone-900">
        {{ startItem }}
      </span>
      <span>-</span>
      <span class="text-stone-900">
        {{ endItem }}
      </span>
      <span> / {{ pagination.filteredElements }}개</span>
    </div>
    <div class="flex flex-row flex-wrap items-center gap-1.5">
      <button
        type="button"
        :disabled="!pagination.hasPrev"
        class="min-h-8 rounded-full border border-stone-200 px-2.5 text-xs font-500 text-stone-600 transition-colors duration-200 ease-in-out hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 disabled:border-stone-100 disabled:text-stone-300"
        @click="goToFirstPage"
      >
        처음
      </button>
      <button
        type="button"
        :disabled="!pagination.hasPrev"
        class="min-h-8 rounded-full border border-stone-200 px-2.5 text-xs font-500 text-stone-600 transition-colors duration-200 ease-in-out hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 disabled:border-stone-100 disabled:text-stone-300"
        @click="goToPrevPage"
      >
        이전
      </button>
      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        :disabled="page === pagination.currentPage"
        :class="cn([
          'min-h-8 min-w-8 rounded-full border px-2.5 text-xs font-600 transition-colors duration-200 ease-in-out',
          page === pagination.currentPage
            ? 'border-sky-500 bg-sky-500 text-white'
            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900',
        ])"
        @click="emitPageChange(page)"
      >
        {{ page + 1 }}
      </button>
      <button
        type="button"
        :disabled="!pagination.hasNext"
        class="min-h-8 rounded-full border border-stone-200 px-2.5 text-xs font-500 text-stone-600 transition-colors duration-200 ease-in-out hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 disabled:border-stone-100 disabled:text-stone-300"
        @click="goToNextPage"
      >
        다음
      </button>
      <button
        type="button"
        :disabled="!pagination.hasNext"
        class="min-h-8 rounded-full border border-stone-200 px-2.5 text-xs font-500 text-stone-600 transition-colors duration-200 ease-in-out hover:border-stone-300 hover:bg-stone-100 hover:text-stone-900 disabled:border-stone-100 disabled:text-stone-300"
        @click="goToLastPage"
      >
        마지막
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
