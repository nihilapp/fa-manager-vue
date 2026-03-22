<script setup lang="ts">
const navItems = [
  { label: '대시보드', link: '/dashboard', icon: '', isPublic: false, },
  { label: '플레이어', link: '/players', icon: '', isPublic: true, },
  { label: '캐릭터', link: '/characters', icon: '', isPublic: true, },
  { label: '캠페인', link: '/campaigns', icon: '', isPublic: true, },
  { label: '세션', link: '/sessions', icon: '', isPublic: true, },
];
</script>

<template>
  <header class="border-b border-stone-200 bg-white">
    <div class="flex items-center justify-between gap-4 px-4 py-3">
      <h1 class="text-lg font-semibold text-stone-900">
        FA 매니저
      </h1>
    </div>
    <nav class="px-4 pb-3">
      <ul class="flex flex-wrap gap-3 text-sm text-stone-700">
        <li v-for="item in navItems" :key="item.label">
          <NuxtLink :to="item.link" :key="item.link" class="hover:text-stone-950 hover:underline">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>

</style>
