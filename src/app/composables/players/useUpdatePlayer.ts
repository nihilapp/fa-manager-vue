interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdatePlayer = (id: number, options: Options = {}) => {
  const playerStore = usePlayerStore();
  const {
    setPlayerInfo,
    setMyInfo,
  } = playerStore;
  const playerList = useGetPlayerList();

  return usePut<PlayerOutDto, PlayerUpdateDto>({
    api: `/players/${id}`,
    onSuccess: async (response) => {
      setPlayerInfo(response.data);

      if (playerStore.myInfo?.id === id) {
        setMyInfo(response.data);
      }

      await playerList.refetch();

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
