export async function useGetUserList(
  callback?: (data: UserOutDto[], totalCnt: number) => void,
  errorCallback?: (error: BaseResponse<null>) => void
) {
  const userStore = useUserStore();

  return await useGet<ListData<UserOutDto>>({
    api: '/users',
    key: queryKeys.users.index({}).queryKey,
    onSuccess: (res) => {
      const {
        list,
        ...pageData
      } = res.data;

      userStore.setUserList(list, pageData);

      if (callback) {
        callback(list, pageData.totalElements);
      }
    },
    onError: (error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
}
