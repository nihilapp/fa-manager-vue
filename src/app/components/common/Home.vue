<script setup lang='ts'>
const commonStore = useCommonStore();
const { navItems, } = storeToRefs(commonStore);
</script>

<template>
  <div class="grid grid-cols-2">
    <template v-for="item in navItems" :key="item.link">
      <div v-if="item.isPublic">
        {{ item.label }}
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
