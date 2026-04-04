<script setup lang="ts">
const route = useRoute();
const characterId = computed(() => Number(route.params.id ?? 0));
const isLoading = ref(true);

const characterStore = useCharacterStore();
const { characterInfo, } = storeToRefs(characterStore);
const { clearCharacterInfo, } = characterStore;

const pageTitle = computed(() => {
  const characterName = characterInfo.value?.name?.trim();

  return characterName
    ? `캐릭터 [${characterName}] 정보`
    : '캐릭터 정보';
});

useSetMeta({
  title: pageTitle,
  url: computed(() => `/characters/detail/${route.params.id}`),
});

const loadCharacterInfo = async () => {
  isLoading.value = true;
  clearCharacterInfo();

  const request = useGetCharacterInfo(characterId.value, {
    callback: () => {
      isLoading.value = false;
    },
    errorCallback: () => {
      isLoading.value = false;
    },
  });

  await request.execute();
};

onMounted(() => {
  void loadCharacterInfo();
});

onBeforeUnmount(() => {
  clearCharacterInfo();
});
</script>

<template>
  <SectionPage v-if="isLoading" :title="pageTitle">
    <Box border="dashed" color="gray" class="p-6 py-10 text-center text-stone-500">
      캐릭터 정보를 불러오는 중입니다.
    </Box>
  </SectionPage>

  <CharacterProfileDetail
    v-else-if="characterInfo"
    :page-title="pageTitle"
    :character-info="characterInfo"
  />

  <SectionPage v-else title="오류">
    <div class="text-red-500 font-900 text-h3 text-center">
      캐릭터를 찾을 수 없습니다.
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
