interface Options {
  callback?: (response: BaseApiResponse<null>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCheckPlayerAccess = (options: Options = {}) => {
  return useGet<null>({
    api: '/players/check',
    key: queryKeys.players.check({}).queryKey,
    onSuccess: (response) => {
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
