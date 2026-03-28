export async function useGetMyPlayerInfo(
  callback?: (data: PlayerOutDto) => void,
  errorCallback?: (error: BaseResponse<null>) => void
) {
  const route = useRoute();
  const playerStore = usePlayerStore();

  return await useGet<PlayerOutDto>({
    api: '/players/me',
    key: queryKeys.players.me({}).queryKey,
    onSuccess: (res) => {
      if (res.error || !res.data) {
        return;
      }

      playerStore.setMyPlayerInfo(res.data);

      if (callback) {
        callback(res.data);
      }
    },
    onError: (error) => {
      playerStore.clearMyPlayerInfo();

      if (errorCallback) {
        errorCallback(error);
      }

      if (import.meta.client && route.path !== '/block') {
        navigateTo('/block');
      }
    },
  });
}
