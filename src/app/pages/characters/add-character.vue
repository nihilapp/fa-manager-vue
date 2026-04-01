<script setup lang="ts">
useSetMeta({
  title: '캐릭터 생성',
  url: '/characters/add-character',
});

const router = useRouter();

const onClickBack = () => {
  void router.push('/characters');
};
</script>

<template>
  <SectionPage title="캐릭터 생성">
    <template #buttons>
      <Button label="목록으로" color="blue" icon-name="fa6-solid:arrow-left" @run="onClickBack" />
    </template>

    <Box border-style="dashed" border-color="stone" padding="lg" class="py-10 text-center text-stone-500">
      캐릭터 생성 화면은 후속 작업에서 연결할 예정입니다.
    </Box>
  </SectionPage>
</template>

<style scoped>

</style>
