interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdatePlayer = (id: number, options: Options = {}) => {
  const playerList = useGetPlayerList();

  return usePut<PlayerOutDto, PlayerUpdateDto>({
    api: `/players/${id}`,
    onSuccess: async (response) => {
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
