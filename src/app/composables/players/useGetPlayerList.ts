interface UseGetPlayerListOptions {
  query?: PlayerQueryDto;
  callback?: (response: BaseApiResponse<ListData<PlayerOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetPlayerList = (options: UseGetPlayerListOptions = {}) => {
  const playerStore = usePlayerStore();

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<PlayerOutDto>>({
    api: '/players',
    query,
    key: queryKeys.players.index(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      playerStore.setPlayerList(list, pageData);

      if (callback) {
        callback(response);
      }
    },
    onError: (error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};
