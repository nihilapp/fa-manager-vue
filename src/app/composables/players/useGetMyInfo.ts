interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetMyInfo = (options: Options = {}) => {
  const route = useRoute();
  const playerStore = usePlayerStore();

  return useGet<PlayerOutDto>({
    api: '/players/me',
    key: queryKeys.players.me({}).queryKey,
    onSuccess: (response) => {
      playerStore.setMyInfo(response.data);

      if (options.callback) {
        options.callback(response);
      }
    },
    onError: (error) => {
      playerStore.clearMyInfo();

      if (options.errorCallback) {
        options.errorCallback(error);
      }
    },
  });
};
