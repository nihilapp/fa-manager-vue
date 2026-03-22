<script setup lang="ts">
const commonStore = useCommonStore();
const { navItems, } = storeToRefs(commonStore);

const route = useRoute();
</script>

<template>
  <header class="bg-stone-800 flex flex-row items-center justify-between">
    <AppLogo />

    <nav class="mr-5">
      <ul class="flex flex-row gap-2">
        <li v-for="item in navItems" :key="item.label">
          <NuxtLink
            v-if="item.isPublic"
            :to="item.link"
            :class="cn([
              'flex flex-row gap-2 items-center text-gray-100 min-h-10 p-2 px-3 border border-stone-700 rounded-2 hover:bg-stone-700 hover:border-stone-700 hover:text-white transition-colors duration-200 ease-in-out',
              route.path.startsWith(item.link) && 'bg-white border-white text-stone-800 hover:bg-white hover:border-white hover:text-stone-800',
            ])"
          >
            <GetIcon :icon-name="item.icon as IconName" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>

</style>
