import { isSessionInfoItem } from './session-guards';

interface UseGetSessionLogInfoOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetSessionLogInfo = (
  sessionId: number,
  logId: number,
  options: UseGetSessionLogInfoOptions = {}
) => {
  const sessionStore = useSessionStore();
  const {
    setSessionInfo,
    setSessionLogInfo,
    clearSessionLogInfo,
  } = sessionStore;

  return useGet<ListData<SessionOutDto>>({
    api: `/sessions/${sessionId}/logs/${logId}`,
    key: queryKeys.sessions.logsDetail({
      sessionId,
      logId,
    }).queryKey,
    onSuccess: (response) => {
      const session = extractItemById<SessionOutDto>(response.data, sessionId, isSessionInfoItem);
      const matchedLog = session?.logs.find((item) => item.id === logId) ?? null;

      if (session) {
        setSessionInfo(session);
      }

      setSessionLogInfo(matchedLog);
      options.callback?.(response);
    },
    onError: (error) => {
      clearSessionLogInfo();
      options.errorCallback?.(error);
    },
  });
};
