<script setup lang="ts">
const playerRoleOptions = [ 'ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ] as const;
const playerStatusOptions = [ 'ACTIVE', 'INACTIVE', 'REST', ] as const;
const playerRoleSelectOptions = [
  { code: 'ROLE_USER', name: '일반 사용자', },
  { code: 'ROLE_ADMIN', name: '관리자', },
  { code: 'ROLE_SUPER_ADMIN', name: '슈퍼 관리자', },
] as const;
const playerStatusSelectOptions = [
  { code: 'ACTIVE', name: '활성', },
  { code: 'INACTIVE', name: '비활성', },
  { code: 'REST', name: '휴면', },
] as const;

const initialValues: PlayerCreateDto = {
  name: '',
  discordId: '',
  role: 'ROLE_USER',
  status: 'ACTIVE',
};

const validationSchema = toTypedSchema(z.object({
  name: z.string().trim().min(1, '이름을 입력해 주세요.'),
  discordId: z.string().trim().min(1, '디스코드 ID를 입력해 주세요.'),
  status: z.enum(playerStatusOptions, '상태 값이 올바르지 않습니다.'),
  role: z.enum(playerRoleOptions, '권한 값이 올바르지 않습니다.'),
}));

const { handleSubmit, isSubmitting, resetForm, } = useForm<PlayerCreateDto>({
  validationSchema,
  initialValues,
});

const createPlayer = useCreateNewPlayer();

const onSubmitForm = handleSubmit((formValues) => {
  console.log(formValues);

  createPlayer.execute(formValues);
});

const onResetForm = () => {
  resetForm({
    values: initialValues,
  });
};

</script>

<template>
  <SectionPage title="플레이어 등록">
    <template #buttons>
      <Button label="목록으로" color="blue" icon-name="fa6-solid:arrow-left" is-link link="/players" />
    </template>

    <form
      @submit.prevent="onSubmitForm"
      @reset.prevent="onResetForm"
      class="p-5 border-2 border-solid border-slate-200 bg-white rounded-2 flex flex-col gap-3"
    >
      <FormInput name="name" label="이름" placeholder="플레이어 이름을 입력해 주세요." />
      <FormInput name="discordId" label="디스코드 ID" placeholder="숫자로 이루어진 랜덤한 ID 문자열" />
      <FormSelect
        name="status"
        label="상태"
        placeholder="상태를 선택해 주세요."
        :options="playerStatusSelectOptions"
        value-key="code"
        label-key="name"
      />
      <FormSelect
        name="role"
        label="권한"
        placeholder="권한을 선택해 주세요."
        :options="playerRoleSelectOptions"
        value-key="code"
        label-key="name"
      />

      <div class="mt-5 flex flex-row gap-2">
        <Button type="reset" label="초기화" mode="outline" color="red" button-class="flex-1 text-lg" />
        <Button :loading="isSubmitting" type="submit" label="플레이어 등록" color="blue" button-class="flex-1 text-lg" />
      </div>
    </form>
  </SectionPage>
</template>

<style scoped>

</style>
