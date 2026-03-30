interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetPlayerInfo = (id: number, options: Options = {}) => {
  const playerStore = usePlayerStore();

  return useGet<PlayerOutDto>({
    api: `/players/${id}`,
    key: queryKeys.players.detail({ id, }).queryKey,
    onSuccess: (response) => {
      playerStore.setPlayerInfo(response.data);

      if (options.callback) {
        options.callback(response);
      }
    },
    onError: (error) => {
      playerStore.clearPlayerInfo();

      if (options.errorCallback) {
        options.errorCallback(error);
      }
    },
  });
};
