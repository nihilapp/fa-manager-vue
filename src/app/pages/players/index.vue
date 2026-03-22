<script setup lang="ts">
import type { DataTableColumn } from '@app/types/common.types';

useSetMeta({
  title: '플레이어 목록',
  url: '/players',
});

const items = [
  { id: 1, name: 'nihil', data: [ 2, 34, ], role: 'master', note: '기본 테스트 데이터', },
  { id: 2, name: 'levan', data: [ 1, ], role: 'player', note: '이름이 짧은 경우', },
  { id: 3, name: 'avery-long-player-name', data: [ 5, 8, 13, 21, ], role: 'observer', note: '이름이 긴 경우', },
];

const tableCases: {
  title: string;
  description: string;
  columns: DataTableColumn[];
}[] = [
  {
    title: '기본 유동 폭',
    description: '모든 컬럼이 동일하게 공간을 나눠 가집니다.',
    columns: [
      { key: 'id', label: '아이디', align: 'justify-start', },
      { key: 'name', label: '이름', align: 'justify-center', },
      { key: 'role', label: '역할', align: 'justify-center', },
      { key: 'data', label: '데이터', slotName: 'data', align: 'justify-end', },
    ],
  },
  {
    title: '일부 고정 폭',
    description: '`id`, `data` 컬럼만 고정 폭으로 두고 나머지는 유동 폭을 유지합니다.',
    columns: [
      { key: 'id', label: '아이디', width: 80, align: 'justify-start', },
      { key: 'name', label: '이름', align: 'justify-center', },
      { key: 'role', label: '역할', align: 'justify-center', },
      { key: 'data', label: '데이터', width: 180, slotName: 'data', align: 'justify-end', },
    ],
  },
  {
    title: '문자열 단위 혼합 폭',
    description: '`rem`과 `px`를 섞어서 지정한 경우를 확인합니다.',
    columns: [
      { key: 'id', label: '아이디', width: '6rem', align: 'justify-start', },
      { key: 'name', label: '이름', width: '14rem', align: 'justify-center', },
      { key: 'role', label: '역할', align: 'justify-center', },
      { key: 'data', label: '데이터', width: '220px', slotName: 'data', align: 'justify-end', },
    ],
  },
  {
    title: '전부 고정 폭',
    description: '모든 컬럼에 `width`를 주면 각 셀이 지정한 값으로만 배치됩니다.',
    columns: [
      { key: 'id', label: '아이디', width: 80, align: 'justify-start', },
      { key: 'name', label: '이름', width: 240, align: 'justify-center', },
      { key: 'role', label: '역할', width: 140, align: 'justify-center', },
      { key: 'data', label: '데이터', width: 220, slotName: 'data', align: 'justify-end', },
    ],
  },
];
</script>

<template>
  <section class="flex flex-col gap-6 p-6">
    <div class="flex flex-col gap-4">
      <article
        v-for="tableCase in tableCases"
        :key="tableCase.title"
        class="rounded-1"
      >
        <DataTable :items="items" :columns="tableCase.columns">
          <template #data="{ value }">
            <span>{{ Array.isArray(value) ? value.join(', ') : value }}</span>
          </template>
        </DataTable>
      </article>
    </div>
  </section>
</template>

<style scoped>

</style>
