import { isSessionInfoItem } from './session-guards';

interface UseUpdateSessionOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateSession = (sessionId: number, options: UseUpdateSessionOptions = {}) => {
  const sessionStore = useSessionStore();
  const { setSessionInfo, } = sessionStore;
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();
  const sessionInfoRequest = useGetSessionInfo(sessionId);

  return usePut<ListData<SessionOutDto>, SessionUpdateDto>({
    api: `/sessions/${sessionId}`,
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
