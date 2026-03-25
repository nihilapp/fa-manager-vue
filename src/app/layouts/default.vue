<script setup lang="ts">
import '@app/assets/styles/alt-body.css';
</script>

<template>
  <div data-app="nihil-app" class="flex h-full min-h-0 flex-col font-500 text-slate-700">
    <CommonHeader />
    <CommonContent>
      <slot />
    </CommonContent>
    <CommonFooter />
  </div>
</template>
