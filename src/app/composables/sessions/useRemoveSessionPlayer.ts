import { isSessionInfoItem } from './session-guards';

interface UseRemoveSessionPlayerOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useRemoveSessionPlayer = (
  sessionId: number,
  userId: number,
  options: UseRemoveSessionPlayerOptions = {}
) => {
  const sessionStore = useSessionStore();
  const { setSessionInfo, } = sessionStore;
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();
  const sessionInfoRequest = useGetSessionInfo(sessionId);

  return useDelete<ListData<SessionOutDto>>({
    api: `/sessions/${sessionId}/players/${userId}`,
    onSuccess: async (response) => {
      const session = extractItemById<SessionOutDto>(response.data, sessionId, isSessionInfoItem);

      if (session) {
        setSessionInfo(session);
      }

      await refetchApiRequests(sessionListRequest, mySessionListRequest, sessionInfoRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
