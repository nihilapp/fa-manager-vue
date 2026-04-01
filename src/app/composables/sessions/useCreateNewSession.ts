interface UseCreateNewSessionOptions {
  callback?: (response: BaseApiResponse<SessionOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateNewSession = (options: UseCreateNewSessionOptions = {}) => {
  const sessionStore = useSessionStore();
  const { setSessionInfo, } = sessionStore;
  const sessionListRequest = useGetSessionList();
  const mySessionListRequest = useGetMySessionList();

  return usePost<SessionOutDto, SessionCreateDto>({
    api: '/sessions',
    onSuccess: async (response) => {
      setSessionInfo(response.data);
      await refetchApiRequests(sessionListRequest, mySessionListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
