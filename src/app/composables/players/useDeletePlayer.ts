interface Options {
  callback?: (response: BaseApiResponse<null>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeletePlayer = (id: number, options: Options = {}) => {
  const playerStore = usePlayerStore();
  const {
    clearPlayerInfo,
    clearMyInfo,
  } = playerStore;
  const playerList = useGetPlayerList();

  return useDelete<null, undefined>({
    api: `/players/${id}`,
    onSuccess: async (response) => {
      if (playerStore.playerInfo?.id === id) {
        clearPlayerInfo();
      }

      if (playerStore.myInfo?.id === id) {
        clearMyInfo();
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
