export const useSessionStore = defineStore('sessionStore', () => {
  const sessionList = ref<SessionOutDto[]>([]);
  const sessionPageData = ref<ListPageData<SessionOutDto> | null>(null);
  const sessionInfo = ref<SessionOutDto | null>(null);

  const playerSessionList = ref<SessionOutDto[]>([]);
  const playerSessionPageData = ref<ListPageData<SessionOutDto> | null>(null);

  const setSessionList = (list: SessionOutDto[]) => {
    sessionList.value = list;
  };

  const setSessionPageData = (pageData: ListPageData<SessionOutDto> | null) => {
    sessionPageData.value = pageData;
  };

  const clearSessionList = () => {
    sessionList.value = [];
    setSessionPageData(null);
  };

  const setSessionInfo = (info: SessionOutDto | null) => {
    sessionInfo.value = info;
  };

  const clearSessionInfo = () => {
    sessionInfo.value = null;
  };

  const setPlayerSessionList = (list: SessionOutDto[]) => {
    playerSessionList.value = list;
  };

  const setPlayerSessionPageData = (pageData: ListPageData<SessionOutDto> | null) => {
    playerSessionPageData.value = pageData;
  };

  const clearPlayerSessionList = () => {
    playerSessionList.value = [];
    setPlayerSessionPageData(null);
  };

  return {
    sessionList,
    sessionPageData,
    sessionInfo,
    playerSessionList,
    playerSessionPageData,
    setSessionList,
    setSessionPageData,
    clearSessionList,
    setSessionInfo,
    clearSessionInfo,
    setPlayerSessionList,
    setPlayerSessionPageData,
    clearPlayerSessionList,
  };
});
