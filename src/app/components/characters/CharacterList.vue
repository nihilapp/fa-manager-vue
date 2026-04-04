<script setup lang="ts">
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

const onClickCharacterDetail = (id: number) => {
  void navigateTo(`/characters/detail/${id}`);
};

const onClickCharacterEdit = (id: number) => {
  void navigateTo(`/characters/edit/${id}`);
};

onMounted(() => {
  void getCharacterList(currentPage.value);
});
</script>

<template>
  <SectionPage title="캐릭터 목록">
    <template #buttons>
      <Button label="캐릭터 생성" color="blue" icon-name="fa6-solid:plus" is-link link="/characters/add-character" />
    </template>

    <CharacterListTable
      :items="characterList"
      :pagination="characterPageData"
      @page-change="onChangePage"
      @detail="onClickCharacterDetail"
      @edit="onClickCharacterEdit"
    />
  </SectionPage>
</template>

<style scoped>

</style>
