<script setup lang="ts">
const router = useRouter();
const characterStore = useCharacterStore();
const { characterList, characterPageData, } = storeToRefs(characterStore);

const currentPage = ref(0);
const pageSize = 10;

const getCharacterList = async (page: number) => {
  const { execute, } = useGetCharacterList({
    query: {
      page,
      size: pageSize,
    },
  });

  await execute();
};

const onChangePage = (page: number) => {
  currentPage.value = page;
  void getCharacterList(page);
};

const onClickAddCharacter = () => {
  void router.push('/characters/add-character');
};

onMounted(() => {
  void getCharacterList(currentPage.value);
});
</script>

<template>
  <SectionPage title="캐릭터 목록">
    <template #buttons>
      <Button label="캐릭터 생성" color="blue" icon-name="fa6-solid:plus" @run="onClickAddCharacter" />
    </template>

    <CharacterListTable
      :items="characterList"
      :pagination="characterPageData"
      @page-change="onChangePage"
    />
  </SectionPage>
</template>

<style scoped>

</style>
