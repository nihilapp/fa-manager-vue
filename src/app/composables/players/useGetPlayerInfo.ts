interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetPlayerInfo = (id: number, options: Options = {}) => {
  const playerStore = usePlayerStore();
  const {
    setPlayerInfo,
    clearPlayerInfo,
  } = playerStore;

  return useGet<PlayerOutDto>({
    api: `/players/${id}`,
    key: queryKeys.players.detail({ id, }).queryKey,
    onSuccess: (response) => {
      setPlayerInfo(response.data);

      if (options.callback) {
        options.callback(response);
      }
    },
    onError: (error) => {
      clearPlayerInfo();

      if (options.errorCallback) {
        options.errorCallback(error);
      }
    },
  });
};
