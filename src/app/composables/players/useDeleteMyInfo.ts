interface Options {
  callback?: (response: BaseApiResponse<null>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteMyInfo = (options: Options = {}) => {
  const playerStore = usePlayerStore();
  const {
    clearMyInfo,
    clearPlayerInfo,
  } = playerStore;

  return useDelete<null, undefined>({
    api: '/players/me',
    onSuccess: (response) => {
      const currentMyInfoId = playerStore.myInfo?.id;

      clearMyInfo();

      if (playerStore.playerInfo?.id === currentMyInfoId) {
        clearPlayerInfo();
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
