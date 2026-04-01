interface UseDeleteSessionOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteSession = (sessionId: number, options: UseDeleteSessionOptions = {}) => {
  const sessionStore = useSessionStore();
  const { clearSessionInfo, } = sessionStore;
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();

  return useDelete<ListData<SessionOutDto>>({
    api: `/sessions/${sessionId}`,
    onSuccess: async (response) => {
      clearSessionInfo();
      await refetchApiRequests(sessionListRequest, mySessionListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
