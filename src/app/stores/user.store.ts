export const useUserStore = defineStore('userStore', () => {
  // 사용자 목록
  const userInfoList = ref<UserOutDto[]>([]);

  // 사용자 총계
  const userInfoListCount = ref(0);

  // 단일 사용자 정보
  const userInfo = ref<UserOutDto | null>(null);

  const getUserList = async (
    callback?: (data: UserOutDto[], totalCnt: number) => void,
    errorCallback?: (error: BaseResponse<ListData<UserOutDto>>) => void
  ) => {
    // query-key-factory를 사용하여 타입 안전한 쿼리 키 적용
    const key = queryKeys.users.list().queryKey;

    await useGet<ListData<UserOutDto>>({
      api: '/users',
      key,
      onSuccess: (res) => {
        userInfoList.value = res.data.list ?? [];
        userInfoListCount.value = res.data.totalElements ?? 0;

        if (callback) {
          callback(res.data.list ?? [], res.data.totalElements ?? 0);
        }
      },
      onError: (error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      },
    });
  };

  return {
    userInfoList,
    userInfoListCount,
    userInfo,

    getUserList,
  };
});
