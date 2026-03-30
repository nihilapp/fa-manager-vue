<script setup lang="ts">
import '@app/assets/styles/alt-body.css';
</script>

<template>
  <div data-app="nihil-app" class="flex h-full min-h-0 flex-col font-500 text-slate-700">
    <CommonHeader />
    <CommonContent>
      <div class="mx-auto w-full lg:max-w-300">
        <slot />
      </div>
    </CommonContent>
    <CommonFooter />
  </div>
</template>
