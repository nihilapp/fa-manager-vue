<script setup lang="ts">
const commonStore = useCommonStore();
const { navItems, } = storeToRefs(commonStore);

const playerStore = usePlayerStore();
const { myInfo, } = storeToRefs(playerStore);

const route = useRoute();
const displayPlayerName = computed(() => myInfo.value?.name ?? '');
</script>

<template>
  <header class="bg-stone-800 flex flex-row items-center justify-between font-500 text-slate-700">
    <AppLogo />

    <div class="mr-5 flex flex-row gap-5 items-center">
      <nav>
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

      <NuxtLink
        to="/me"
        class="text-white flex flex-row items-center gap-2 p-2 px-3 hover:bg-stone-700 rounded-2 transition-colors duration-200 ease-in-out"
      >
        <GetIcon icon-name="fa6-regular:circle-user" class="w-6 h-6" />
        <ClientOnly fallback-tag="span" fallback="">
          <span>{{ displayPlayerName }}</span>
        </ClientOnly>
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>

</style>
