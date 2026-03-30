interface Options {
  callback?: (response: BaseApiResponse<PlayerOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateNewPlayer = (options: Options = {}) => {
  const router = useRouter();
  const playerList = useGetPlayerList();

  return usePost<PlayerOutDto, PlayerCreateDto>({
    api: '/players',
    onSuccess: async (response) => {
      console.log('useCreateNewPlayer', response);
      await playerList.refetch();

      await router.push('/players');

      if (options.callback) {
        options.callback(response);
      }
    },
    onError: (error) => {
      if (options.errorCallback) {
        options.errorCallback(error);

        console.log('useCreateNewPlayer', error);
      }
    },
  });
};
