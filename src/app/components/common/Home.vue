<script setup lang="ts">
const commonStore = useCommonStore();
const { navItems, } = storeToRefs(commonStore);
</script>

<template>
  <div class="grid grid-cols-2 h-full p-5 gap-5">
    <template v-for="item in navItems" :key="item.link">
      <div
        v-if="item.isPublic"
        :class="cn([
          item.colspan === 2 && 'col-span-2',
        ])"
      >
        <NuxtLink
          :to="item.link"
          class="h-full flex items-center justify-center gap-2 text-h3 border-2 border-solid border-stone-300 rounded-2 font-500 bg-stone-200/50 hover:bg-blue-100 hover:border-blue-200 hover:text-blue-600 transition-colors duration-200 ease-in-out"
        >
          <GetIcon v-if="item.icon" :icon-name="item.icon" class="size-7.5" />
          <span class="leading-1">
            {{ item.label }} 정보
          </span>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
