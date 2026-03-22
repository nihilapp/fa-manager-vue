export const useUserStore = defineStore('userStore', () => {
  const route = useRoute();

  // 사용자 목록
  const userList = ref<UserOutDto[]>([]);

  // 사용자 목록 페이지 메타
  const userPageData = ref<ListPageData<UserOutDto> | null>(null);

  // 사용자 총계
  const userInfoListCount = ref(0);

  // 단일 사용자 정보
  const userInfo = ref<UserOutDto | null>(null);

  const myInfo = ref<UserOutDto | null>(null);

  const isAdmin = computed(() => {
    const isDev = import.meta.env.DEV;

    return isDev || [ 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ].includes(myInfo.value?.role ?? '');
  });

  const getUserList = async (
    callback?: (data: UserOutDto[], totalCnt: number) => void,
    errorCallback?: (error: BaseResponse<ListData<UserOutDto>>) => void
  ) => {
    await useGet<ListData<UserOutDto>>({
      api: '/users',
      key: queryKeys.users.index({}).queryKey,
      onSuccess: (res) => {
        const {
          list,
          ...pageData
        } = res.data;

        userList.value = list ?? [];
        userPageData.value = pageData;
        userInfoListCount.value = pageData.totalElements ?? 0;

        if (callback) {
          callback(list ?? [], pageData.totalElements ?? 0);
        }
      },
      onError: (error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      },
    });
  };

  const getMyInfo = async () => {
    await useGet<UserOutDto>({
      api: '/users/me',
      key: queryKeys.users.me({}).queryKey,
      onSuccess: (res) => {
        myInfo.value = res.data ?? null;
      },
      onError: () => {
        myInfo.value = null;

        if (import.meta.client && route.path !== '/block') {
          navigateTo('/block');
        }
      },
    });
  };

  return {
    userList,
    userPageData,
    userInfoListCount,
    userInfo,
    myInfo,
    isAdmin,

    getUserList,
    getMyInfo,
  };
});
