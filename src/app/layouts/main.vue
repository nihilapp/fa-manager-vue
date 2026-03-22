<script setup lang='ts'>

</script>

<template>
  <div class="flex flex-col dvw-100 dvh-100">
    <header class="bg-stone-800 text-white">
      <h1 class="flex items-center justify-center gap-3 px-5 py-3">
        <NuxtLink to="/">
          <img src="@app/assets/images/fa-logo.png" alt="FA 로고" class="h-14">
          <span class="sr-only">
            FA 로고
          </span>
        </NuxtLink>
      </h1>
    </header>
    <main class="flex-1 shrink-0">
      <slot />
    </main>
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
        © 2026 환상서고. All rights reserved.
      </small>
    </footer>
  </div>
</template>

<style scoped>

</style>
