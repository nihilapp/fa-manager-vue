<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col dvw-100 dvh-100 font-500 text-slate-700">
    <header class="bg-stone-800 text-white flex flex-row items-center justify-center">
      <AppLogo />
    </header>
    <main class="flex-1 shrink-0">
      <slot />
    </main>
    <CommonFooter />
  </div>
</template>
