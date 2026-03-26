type UseGetUserListCallback = (data: UserOutDto[], totalCnt: number) => void;
type UseGetUserListErrorCallback = (error: BaseResponse<null>) => void;

export async function useGetUserList(
  query?: UserQueryDto,
  callback?: UseGetUserListCallback,
  errorCallback?: UseGetUserListErrorCallback
): Promise<UseGetReturn<ListData<UserOutDto>>>;
export async function useGetUserList(
  callback?: UseGetUserListCallback,
  errorCallback?: UseGetUserListErrorCallback
): Promise<UseGetReturn<ListData<UserOutDto>>>;
export async function useGetUserList(
  queryOrCallback?: UserQueryDto | UseGetUserListCallback,
  callbackOrErrorCallback?: UseGetUserListCallback | UseGetUserListErrorCallback,
  errorCallback?: UseGetUserListErrorCallback
) {
  const userStore = useUserStore();
  const query = typeof queryOrCallback === 'function'
    ? {}
    : (queryOrCallback ?? {});
  const callback = typeof queryOrCallback === 'function'
    ? queryOrCallback
    : callbackOrErrorCallback as UseGetUserListCallback | undefined;
  const resolvedErrorCallback = typeof queryOrCallback === 'function'
    ? callbackOrErrorCallback as UseGetUserListErrorCallback | undefined
    : errorCallback;

  return await useGet<ListData<UserOutDto>>({
    api: '/users',
    query,
    key: queryKeys.users.index(query).queryKey,
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
      if (resolvedErrorCallback) {
        resolvedErrorCallback(error);
      }
    },
  });
}
