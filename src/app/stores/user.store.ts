export const useUserStore = defineStore('userStore', () => {
  const userList = ref<UserOutDto[]>([]);
  const userPageData = ref<ListPageData<UserOutDto> | null>(null);
  const userListCount = ref(0);
  const userInfo = ref<UserOutDto | null>(null);
  const myInfo = ref<UserOutDto | null>(null);

  const isAdmin = computed(() => {
    const isDev = import.meta.env.DEV;

    return isDev || [ 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ].includes(myInfo.value?.role ?? '');
  });

  const setUserList = (
    list: UserOutDto[],
    pageData: ListPageData<UserOutDto>
  ) => {
    userList.value = list;
    userPageData.value = pageData;
    userListCount.value = pageData.totalElements;
  };

  const clearUserList = () => {
    userList.value = [];
    userPageData.value = null;
    userListCount.value = 0;
  };

  const setUserInfo = (user: UserOutDto | null) => {
    userInfo.value = user;
  };

  const setMyInfo = (user: UserOutDto | null) => {
    myInfo.value = user;
  };

  const clearMyInfo = () => {
    myInfo.value = null;
  };

  return {
    userList,
    userPageData,
    userListCount,
    userInfo,
    myInfo,
    isAdmin,

    setUserList,
    clearUserList,
    setUserInfo,
    setMyInfo,
    clearMyInfo,
  };
});
