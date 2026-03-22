<script setup lang="ts">
const startYear = 2026;
const nowYear = ref(DateTime.now().year);

const year = computed(() => {
  return (nowYear.value - startYear) > 0
    ? `${startYear}-${nowYear.value}`
    : startYear;
});
</script>

<template>
  <footer class="p-2 flex flex-col items-center justify-center bg-stone-800 text-white">
    <small>
      <a
        href="https://cafe.naver.com/fantasyarchive"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-row gap-1 items-center p-1 text-green-400 hover:underline hover:text-green-300"
      >
        <GetIcon icon-name="fa6-solid:link" />
        <span>환상서고 바로가기</span>
      </a>
    </small>
    <small>
      ©
      <span>{{ year }}. 환상서고. All rights reserved.</span>
    </small>
  </footer>
</template>

<style scoped>

</style>
