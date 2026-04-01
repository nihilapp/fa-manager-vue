import { isSessionInfoItem } from './session-guards';

interface UseAddSessionPlayerOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useAddSessionPlayer = (sessionId: number, options: UseAddSessionPlayerOptions = {}) => {
  const sessionStore = useSessionStore();
  const { setSessionInfo, } = sessionStore;
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();
  const sessionInfoRequest = useGetSessionInfo(sessionId);

  return usePost<ListData<SessionOutDto>, SessionPlayerCreateDto>({
    api: `/sessions/${sessionId}/players`,
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
