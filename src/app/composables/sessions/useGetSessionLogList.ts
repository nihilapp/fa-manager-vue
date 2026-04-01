interface UseGetSessionLogListOptions {
  query?: SessionLogQueryDto;
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetSessionLogList = (sessionId: number, options: UseGetSessionLogListOptions = {}) => {
  const sessionStore = useSessionStore();
  const {
    setSessionInfo,
    setSessionLogList,
    setSessionLogPageData,
    clearSessionLogList,
  } = sessionStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<SessionOutDto>>({
    api: `/sessions/${sessionId}/logs`,
    query,
    key: queryKeys.sessions.logsIndex({
      sessionId,
      ...query,
    }).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;
      const session = list.find((item) => String(item.id) === String(sessionId)) ?? null;

      if (session) {
        setSessionInfo(session);
        setSessionLogList(session.logs ?? []);
        setSessionLogPageData(pageData as ListPageData<SessionLogOutDto>);
      }
      else {
        clearSessionLogList();
      }

      callback?.(response);
    },
    onError: (error) => {
      clearSessionLogList();
      errorCallback?.(error);
    },
  });
};
