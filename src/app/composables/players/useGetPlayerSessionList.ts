interface Options {
  query?: SessionQueryDto;
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetPlayerSessionList = (playerId: number, options: Options = {}) => {
  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  const sessionStore = useSessionStore();
  const {
    setPlayerSessionList,
    setPlayerSessionPageData,
    clearPlayerSessionList,
  } = sessionStore;

  return useGet<ListData<SessionOutDto>>({
    api: `/players/${playerId}/sessions`,
    query,
    key: queryKeys.players.sessions({
      playerId,
      ...query,
    }).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setPlayerSessionList(list);
      setPlayerSessionPageData(pageData);

      if (callback) {
        callback(response);
      }
    },
    onError: (error) => {
      clearPlayerSessionList();

      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};
