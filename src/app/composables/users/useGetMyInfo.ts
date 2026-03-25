export async function useGetMyInfo(
  callback?: (data: UserOutDto) => void,
  errorCallback?: (error: BaseResponse<null>) => void
) {
  const route = useRoute();
  const userStore = useUserStore();

  return await useGet<UserOutDto>({
    api: '/users/me',
    key: queryKeys.users.me({}).queryKey,
    onSuccess: (res) => {
      userStore.setMyInfo(res.data);

      if (callback) {
        callback(res.data);
      }
    },
    onError: (error) => {
      userStore.clearMyInfo();

      if (errorCallback) {
        errorCallback(error);
      }

      if (import.meta.client && route.path !== '/block') {
        navigateTo('/block');
      }
    },
  });
}
