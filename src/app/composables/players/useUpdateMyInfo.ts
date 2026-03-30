interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateMyInfo = (options: Options = {}) => {
  const playerStore = usePlayerStore();
  const {
    setMyInfo,
    setPlayerInfo,
  } = playerStore;

  return usePut<PlayerOutDto, PlayerUpdateDto>({
    api: '/players/me',
    onSuccess: (response) => {
      setMyInfo(response.data);

      if (playerStore.playerInfo?.id === response.data.id) {
        setPlayerInfo(response.data);
      }

      if (options.callback) {
        options.callback(response);
      }
    },
    onError: (error) => {
      if (options.errorCallback) {
        options.errorCallback(error);
      }
    },
  });
};
