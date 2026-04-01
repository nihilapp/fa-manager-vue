interface UseUpdateSessionLogOptions {
  callback?: (response: BaseApiResponse<ListData<SessionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateSessionLog = (
  sessionId: number,
  logId: number,
  options: UseUpdateSessionLogOptions = {}
) => {
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();
  const sessionInfoRequest = useGetSessionInfo(sessionId);
  const sessionLogListRequest = useGetSessionLogList(sessionId);
  const sessionLogInfoRequest = useGetSessionLogInfo(sessionId, logId);

  return usePut<ListData<SessionOutDto>, SessionLogUpdateDto>({
    api: `/sessions/${sessionId}/logs/${logId}`,
    onSuccess: async (response) => {
      await refetchApiRequests(
        sessionListRequest,
        mySessionListRequest,
        sessionInfoRequest,
        sessionLogListRequest,
        sessionLogInfoRequest
      );
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
