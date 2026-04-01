interface UseGetMySessionListOptions {
  query?: SessionQueryDto;
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetMySessionList = (options: UseGetMySessionListOptions = {}) => {
  const sessionStore = useSessionStore();
  const {
    setMySessionList,
    setMySessionPageData,
    clearMySessionList,
  } = sessionStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<SessionOutDto>>({
    api: '/sessions/mine',
    query,
    key: queryKeys.sessions.mine(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setMySessionList(list);
      setMySessionPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearMySessionList();
      errorCallback?.(error);
    },
  });
};
