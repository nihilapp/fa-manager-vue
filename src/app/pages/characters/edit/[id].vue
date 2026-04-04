<script setup lang="ts">
const route = useRoute();
const characterId = computed(() => Number(route.params.id ?? 0));

useSetMeta({
  title: computed(() => (
    characterId.value
      ? `캐릭터 수정 #${characterId.value}`
      : '캐릭터 수정'
  )),
  url: computed(() => `/characters/edit/${route.params.id}`),
});
</script>

<template>
  <CharacterEditorForm mode="edit" :character-id="characterId" />
</template>

<style scoped>

</style>
