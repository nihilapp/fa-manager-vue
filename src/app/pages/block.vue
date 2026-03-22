<script setup lang='ts'>
definePageMeta({
  layout: 'main',
});

useSetMeta({
  title: '접근 제한',
  url: '/block',
  robots: 'noindex, nofollow',
});
</script>

<template>
  <section class="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
    <p class="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
      Community Access Only
    </p>
    <h2 class="mb-4 text-h3 font-bold text-stone-900">
      이 웹앱은 환상서고 전용 공간입니다.
    </h2>
    <p class="text-base leading-7 text-stone-600">
      환상서고 회원만 이용 가능합니다.
    </p>
  </section>
</template>

<style scoped>

</style>
