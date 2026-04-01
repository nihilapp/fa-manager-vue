interface UseDeleteSessionLogOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteSessionLog = (
  sessionId: number,
  logId: number,
  options: UseDeleteSessionLogOptions = {}
) => {
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();
  const sessionInfoRequest = useGetSessionInfo(sessionId);
  const sessionLogListRequest = useGetSessionLogList(sessionId);

  return useDelete<ListData<SessionOutDto>>({
    api: `/sessions/${sessionId}/logs/${logId}`,
    onSuccess: async (response) => {
      await refetchApiRequests(sessionListRequest, mySessionListRequest, sessionInfoRequest, sessionLogListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
