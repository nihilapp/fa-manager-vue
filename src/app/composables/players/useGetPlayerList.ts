type UseGetPlayerListCallback = (data: PlayerOutDto[], totalCnt: number) => void;
type UseGetPlayerListErrorCallback = (error: BaseResponse<null>) => void;

export async function useGetPlayerList(
  query?: PlayerQueryDto,
  callback?: UseGetPlayerListCallback,
  errorCallback?: UseGetPlayerListErrorCallback
): Promise<UseGetReturn<ListData<PlayerOutDto>>>;
export async function useGetPlayerList(
  callback?: UseGetPlayerListCallback,
  errorCallback?: UseGetPlayerListErrorCallback
): Promise<UseGetReturn<ListData<PlayerOutDto>>>;
export async function useGetPlayerList(
  queryOrCallback?: PlayerQueryDto | UseGetPlayerListCallback,
  callbackOrErrorCallback?: UseGetPlayerListCallback | UseGetPlayerListErrorCallback,
  errorCallback?: UseGetPlayerListErrorCallback
) {
  const playerStore = usePlayerStore();
  const query = typeof queryOrCallback === 'function'
    ? {}
    : (queryOrCallback ?? {});
  const callback = typeof queryOrCallback === 'function'
    ? queryOrCallback
    : callbackOrErrorCallback as UseGetPlayerListCallback | undefined;
  const resolvedErrorCallback = typeof queryOrCallback === 'function'
    ? callbackOrErrorCallback as UseGetPlayerListErrorCallback | undefined
    : errorCallback;

  return await useGet<ListData<PlayerOutDto>>({
    api: '/players',
    query,
    key: queryKeys.players.index(query).queryKey,
    onSuccess: (res) => {
      if (res.error || !res.data) {
        return;
      }

      const {
        list,
        ...pageData
      } = res.data;

      playerStore.setPlayerList(list, pageData);

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
