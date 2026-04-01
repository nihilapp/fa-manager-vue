interface UseGetSessionListOptions {
  query?: SessionQueryDto;
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetSessionList = (options: UseGetSessionListOptions = {}) => {
  const sessionStore = useSessionStore();
  const {
    setSessionList,
    setSessionPageData,
    clearSessionList,
  } = sessionStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<SessionOutDto>>({
    api: '/sessions',
    query,
    key: queryKeys.sessions.index(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setSessionList(list);
      setSessionPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearSessionList();
      errorCallback?.(error);
    },
  });
};
