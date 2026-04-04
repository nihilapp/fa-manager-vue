<script setup lang="ts">
const router = useRouter();
const characterStore = useCharacterStore();
const {
  createCharacterFormValidationSchema,
  createEmptyCharacterFormValues,
  buildCharacterSubmitPayload,
  resetCharacterCreateClassForms,
  addCharacterCreateClassForm,
  removeCharacterCreateClassForm,
  getCharacterCreateClassPayloads,
} = characterStore;
const {
  characterCreateClassForms,
  characterStatusOptions,
  characterCampaignOptions,
} = storeToRefs(characterStore);

const submitErrorMessage = ref('');
const createCharacter = useCreateNewCharacter({
  errorCallback: (error) => {
    submitErrorMessage.value = String(error.message ?? '캐릭터 생성에 실패했습니다.');
  },
});
const { handleSubmit, isSubmitting, resetForm, } = useForm<CharacterFormValues>({
  initialValues: createEmptyCharacterFormValues(),
  validationSchema: createCharacterFormValidationSchema(),
});

const loadCampaignList = async () => {
  const request = useGetCampaignList({
    query: {
      page: 0,
      size: 100,
    },
  });

  await request.execute();
};

const onResetForm = () => {
  submitErrorMessage.value = '';
  resetForm({
    values: createEmptyCharacterFormValues(),
  });
  resetCharacterCreateClassForms();
};

const onAddClassField = () => {
  addCharacterCreateClassForm();
};

const onRemoveClassField = (id: string) => {
  removeCharacterCreateClassForm(id);
};

const onSubmitForm = handleSubmit(async (formValues) => {
  submitErrorMessage.value = '';
  const response = await createCharacter.execute(buildCharacterSubmitPayload(formValues));

  const createdCharacterId = response?.data?.id;

  if (!createdCharacterId) {
    return;
  }

  const normalizedClasses = getCharacterCreateClassPayloads();

  for (const characterClass of normalizedClasses) {
    const request = useCreateCharacterClass(createdCharacterId);
    await request.execute(characterClass);
  }

  await router.push(`/characters/detail/${createdCharacterId}`);
});

onMounted(() => {
  resetForm({
    values: createEmptyCharacterFormValues(),
  });
  resetCharacterCreateClassForms();
  void loadCampaignList();
});

onBeforeUnmount(() => {
  resetForm({
    values: createEmptyCharacterFormValues(),
  });
  resetCharacterCreateClassForms();
});
</script>

<template>
  <SectionPage title="캐릭터 생성">
    <template #buttons>
      <Button label="목록으로" color="blue" icon-name="fa6-solid:arrow-left" is-link link="/characters" />
    </template>

    <form
      class="rounded-2 border-2 border-solid border-slate-200 bg-white p-5 flex flex-col gap-5"
      @submit.prevent="onSubmitForm"
      @reset.prevent="onResetForm"
    >
      <Box
        v-if="submitErrorMessage"
        border="dashed"
        color="red"
        class="p-5 text-sm text-red-600"
      >
        {{ submitErrorMessage }}
      </Box>

      <Box class="flex flex-col gap-4 p-6">
        <h3 class="text-h5 text-stone-900">
          기본 정보
        </h3>
        <div class="grid gap-4 md:grid-cols-2">
          <FormInput name="name" label="이름" placeholder="캐릭터 이름을 입력해 주세요." />
          <FormSelect
            name="campaignId"
            label="캠페인"
            placeholder="캠페인을 선택해 주세요."
            :options="characterCampaignOptions"
            value-key="id"
            label-key="name"
          />
          <FormSelect
            name="status"
            label="상태"
            placeholder="캐릭터 상태를 선택해 주세요."
            :options="characterStatusOptions"
            value-key="code"
            label-key="name"
          />
          <FormInput name="startLevel" type="number" label="시작 레벨" placeholder="기본값 1" />
        </div>
      </Box>

      <Box class="flex flex-col gap-4 p-6">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-h5 text-stone-900">
            클래스 정보
          </h3>
          <Button
            label="클래스 추가"
            mode="ghost"
            color="blue"
            icon-name="fa6-solid:plus"
            button-class="min-h-9 px-3 py-1.5"
            @run="onAddClassField"
          />
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="classItem in characterCreateClassForms"
            :key="classItem.id"
            class="rounded-2 border border-solid border-slate-200 bg-slate-50 p-4"
          >
            <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px_120px]">
              <FormInput
                v-model:input-value="classItem.className"
                label="클래스명"
                placeholder="예: 파이터"
              />
              <FormInput
                v-model:input-value="classItem.subClassName"
                label="서브 클래스명"
                placeholder="예: 배틀 마스터"
              />
              <FormInput
                v-model:input-value="classItem.level"
                type="number"
                label="클래스 레벨"
                placeholder="기본값 1"
              />
              <div class="flex items-end">
                <Button
                  label="삭제"
                  mode="outline"
                  color="red"
                  button-class="w-full"
                  @run="onRemoveClassField(classItem.id)"
                />
              </div>
            </div>
          </div>
        </div>
      </Box>

      <Box class="flex flex-col gap-4 p-6">
        <h3 class="text-h5 text-stone-900">
          시작 자금
        </h3>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <FormInput name="startCurrencyCp" type="number" label="CP" placeholder="구리화" />
          <FormInput name="startCurrencySp" type="number" label="SP" placeholder="은화" />
          <FormInput name="startCurrencyEp" type="number" label="EP" placeholder="전자화" />
          <FormInput name="startCurrencyGp" type="number" label="GP" placeholder="금화" />
          <FormInput name="startCurrencyPp" type="number" label="PP" placeholder="백금화" />
        </div>
      </Box>

      <div class="flex flex-col gap-3 md:flex-row">
        <Button type="reset" label="초기화" mode="outline" color="red" button-class="flex-1 text-lg" />
        <Button type="submit" :loading="isSubmitting" label="캐릭터 생성" color="blue" button-class="flex-1 text-lg" />
      </div>
    </form>
  </SectionPage>
</template>

<style scoped>

</style>
