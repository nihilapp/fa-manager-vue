import { isSessionInfoItem } from './session-guards';

interface UseGetSessionInfoOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetSessionInfo = (sessionId: number, options: UseGetSessionInfoOptions = {}) => {
  const sessionStore = useSessionStore();
  const {
    setSessionInfo,
    clearSessionInfo,
  } = sessionStore;

  return useGet<ListData<SessionOutDto>>({
    api: `/sessions/${sessionId}`,
    key: queryKeys.sessions.detail({
      id: sessionId,
    }).queryKey,
    onSuccess: (response) => {
      const session = extractItemById<SessionOutDto>(response.data, sessionId, isSessionInfoItem);

      if (session) {
        setSessionInfo(session);
      }

      options.callback?.(response);
    },
    onError: (error) => {
      clearSessionInfo();
      options.errorCallback?.(error);
    },
  });
};
