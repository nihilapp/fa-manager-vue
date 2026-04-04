<script setup lang="ts">
type CharacterEditorMode = 'create' | 'edit';

const props = withDefaults(defineProps<{
  mode?: CharacterEditorMode;
  characterId?: number;
  title?: string;
  submitLabel?: string;
  backTo?: string;
}>(), {
  mode: 'create',
  characterId: 0,
  title: '',
  submitLabel: '',
  backTo: '/characters',
});

const router = useRouter();

const characterStore = useCharacterStore();
const {
  clearCharacterInfo,
  createCharacterFormValidationSchema,
  createEmptyCharacterFormValues,
  getCharacterFormValuesFromInfo,
  buildCharacterSubmitPayload,
  resetCharacterCreateClassForms,
  syncCharacterCreateClassFormsFromInfo,
  addCharacterCreateClassForm,
  removeCharacterCreateClassForm,
  setCharacterEditorLoading,
} = characterStore;
const {
  characterInfo,
  characterCreateClassForms,
  characterStatusOptions,
  characterCampaignOptions,
  characterEditorLoading,
} = storeToRefs(characterStore);
const currencyStore = useCurrencyStore();
const { clearCharacterCurrencyTransactionList, } = currencyStore;
const submitErrorMessage = ref('');

const { handleSubmit, isSubmitting, resetForm, } = useForm<CharacterFormValues>({
  initialValues: createEmptyCharacterFormValues(),
  validationSchema: createCharacterFormValidationSchema(),
});

const isEditMode = computed(() => props.mode === 'edit');

const pageTitle = computed(() => {
  if (props.title.trim()) {
    return props.title.trim();
  }

  if (isEditMode.value) {
    const characterName = characterInfo.value?.name?.trim();

    return characterName
      ? `캐릭터 수정 [${characterName}]`
      : '캐릭터 수정';
  }

  return '캐릭터 생성';
});

const actionLabel = computed(() => {
  if (props.submitLabel.trim()) {
    return props.submitLabel.trim();
  }

  return isEditMode.value
    ? '캐릭터 수정'
    : '캐릭터 생성';
});

const createCharacterRequest = useCreateNewCharacter({
  errorCallback: (error) => {
    submitErrorMessage.value = String(error.message ?? '캐릭터 생성에 실패했습니다.');
  },
});
const updateCharacterRequest = props.characterId
  ? useUpdateCharacter(props.characterId, {
    errorCallback: (error) => {
      submitErrorMessage.value = String(error.message ?? '캐릭터 수정에 실패했습니다.');
    },
  })
  : null;

const onResetForm = () => {
  submitErrorMessage.value = '';
  resetForm({
    values: getCharacterFormValuesFromInfo(
      isEditMode.value
        ? characterInfo.value
        : null
    ),
  });

  if (isEditMode.value) {
    syncCharacterCreateClassFormsFromInfo(characterInfo.value);
    return;
  }

  resetCharacterCreateClassForms();
};

const syncCharacterClasses = async (characterId: number) => {
  const currentForms = characterCreateClassForms.value;
  const nextClasses = currentForms
    .map((item) => ({
      originalClassName: item.originalClassName.trim(),
      className: item.className.trim(),
      subClassName: item.subClassName.trim(),
      level: Number(item.level) || 1,
    }))
    .filter((item) => item.className);
  const existingClasses = characterInfo.value?.classes ?? [];
  const nextOriginalClassNames = new Set(nextClasses
    .map((item) => item.originalClassName.trim())
    .filter(Boolean));

  for (const existingClass of existingClasses) {
    if (nextOriginalClassNames.has(existingClass.className)) {
      continue;
    }

    const request = useDeleteCharacterClass(characterId, existingClass.className, {
      errorCallback: (error) => {
        submitErrorMessage.value = String(error.message ?? '캐릭터 클래스 삭제에 실패했습니다.');
      },
    });

    await request.execute();
  }

  for (let index = 0; index < nextClasses.length; index += 1) {
    const classPayload = nextClasses[index]!;
    const originalClassName = classPayload.originalClassName;

    if (!originalClassName) {
      const request = useCreateCharacterClass(characterId, {
        errorCallback: (error) => {
          submitErrorMessage.value = String(error.message ?? '캐릭터 클래스 생성에 실패했습니다.');
        },
      });

      await request.execute(classPayload);
      continue;
    }

    if (originalClassName !== classPayload.className) {
      const deleteRequest = useDeleteCharacterClass(characterId, originalClassName, {
        errorCallback: (error) => {
          submitErrorMessage.value = String(error.message ?? '캐릭터 클래스 삭제에 실패했습니다.');
        },
      });
      await deleteRequest.execute();

      const createRequest = useCreateCharacterClass(characterId, {
        errorCallback: (error) => {
          submitErrorMessage.value = String(error.message ?? '캐릭터 클래스 생성에 실패했습니다.');
        },
      });
      await createRequest.execute(classPayload);
      continue;
    }

    const updateRequest = useUpdateCharacterClass(characterId, originalClassName, {
      errorCallback: (error) => {
        submitErrorMessage.value = String(error.message ?? '캐릭터 클래스 수정에 실패했습니다.');
      },
    });
    await updateRequest.execute({
      subClassName: classPayload.subClassName,
      level: classPayload.level,
    });
  }
};

const onAddClassField = () => {
  addCharacterCreateClassForm();
};

const onRemoveClassField = (id: string) => {
  removeCharacterCreateClassForm(id);
};

const onSubmitForm = handleSubmit(async (formValues) => {
  submitErrorMessage.value = '';
  const payload = buildCharacterSubmitPayload(formValues);

  if (!isEditMode.value) {
    const response = await createCharacterRequest.execute(payload);
    const createdCharacterId = response?.data?.id;

    if (!createdCharacterId) {
      return;
    }

    await syncCharacterClasses(createdCharacterId);
    await router.push(`/characters/detail/${createdCharacterId}`);
    return;
  }

  if (!updateCharacterRequest || !props.characterId) {
    return;
  }

  await updateCharacterRequest.execute(payload);
  await syncCharacterClasses(props.characterId);
  await router.push(`/characters/detail/${props.characterId}`);
});

const loadCharacterInfo = async () => {
  if (!isEditMode.value || !props.characterId) {
    setCharacterEditorLoading(false);
    return;
  }

  setCharacterEditorLoading(true);
  clearCharacterInfo();

  const request = useGetCharacterInfo(props.characterId, {
    callback: () => {
      setCharacterEditorLoading(false);
    },
    errorCallback: () => {
      setCharacterEditorLoading(false);
    },
  });

  await request.execute();
};

const loadCampaignList = async () => {
  const request = useGetCampaignList({
    query: {
      page: 0,
      size: 100,
    },
  });

  await request.execute();
};

const loadCharacterCurrencyTransactions = async () => {
  if (!isEditMode.value || !props.characterId) {
    clearCharacterCurrencyTransactionList();
    return;
  }

  const request = useGetCharacterCurrencyTransactionList(props.characterId, {
    query: {
      page: 0,
      size: 500,
    },
  });

  await request.execute();
};

watch(() => characterInfo.value, (nextCharacterInfo) => {
  if (!isEditMode.value) {
    return;
  }

  if (!nextCharacterInfo || nextCharacterInfo.id !== props.characterId) {
    return;
  }

  resetForm({
    values: getCharacterFormValuesFromInfo(nextCharacterInfo),
  });
  syncCharacterCreateClassFormsFromInfo(nextCharacterInfo);
}, {
  immediate: true,
});

onMounted(() => {
  submitErrorMessage.value = '';
  void loadCampaignList();

  if (!isEditMode.value) {
    setCharacterEditorLoading(false);
    resetForm({
      values: createEmptyCharacterFormValues(),
    });
    resetCharacterCreateClassForms();
    clearCharacterCurrencyTransactionList();
    return;
  }

  void loadCharacterCurrencyTransactions();
  void loadCharacterInfo();
});

onBeforeUnmount(() => {
  clearCharacterCurrencyTransactionList();
  resetCharacterCreateClassForms();
  resetForm({
    values: createEmptyCharacterFormValues(),
  });
  setCharacterEditorLoading(false);

  if (isEditMode.value) {
    clearCharacterInfo();
  }
});
</script>

<template>
  <SectionPage :title="pageTitle">
    <template #buttons>
      <Button label="목록으로" color="blue" icon-name="fa6-solid:arrow-left" is-link :link="props.backTo" />
    </template>

    <div class="flex flex-col gap-5">
      <Box
        v-if="characterEditorLoading"
        border="dashed"
        color="gray"
        class="p-6 py-10 text-center text-stone-500"
      >
        캐릭터 정보를 불러오는 중입니다.
      </Box>

      <Box
        v-else-if="isEditMode && !characterInfo"
        border="dashed"
        color="gray"
        class="p-6 py-10 text-center text-red-500"
      >
        수정할 캐릭터 정보를 찾을 수 없습니다.
      </Box>

      <form
        v-else
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
          <Button
            type="submit"
            :loading="isSubmitting"
            :label="actionLabel"
            color="blue"
            button-class="flex-1 text-lg"
          />
        </div>
      </form>
    </div>
  </SectionPage>
</template>

<style scoped>

</style>
