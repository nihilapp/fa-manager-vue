interface UseCreateSessionLogOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateSessionLog = (sessionId: number, options: UseCreateSessionLogOptions = {}) => {
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();
  const sessionInfoRequest = useGetSessionInfo(sessionId);
  const sessionLogListRequest = useGetSessionLogList(sessionId);

  return usePost<ListData<SessionOutDto>, SessionLogCreateDto>({
    api: `/sessions/${sessionId}/logs`,
    onSuccess: async (response) => {
      await refetchApiRequests(sessionListRequest, mySessionListRequest, sessionInfoRequest, sessionLogListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
