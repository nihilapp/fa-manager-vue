export const useSessionStore = defineStore('sessionStore', () => {
  const sessionList = ref<SessionOutDto[]>([]);
  const playerSessionList = ref<SessionOutDto[]>([]);

  const sessionInfo = ref<SessionOutDto | null>(null);

  const sessionPageData = ref<ListPageData<SessionOutDto> | null>(null);
  const playerSessionPageData = ref<ListPageData<SessionOutDto> | null>(null);

  const setSessionList = (
    list: SessionOutDto[],
    pageData: ListPageData<SessionOutDto>
  ) => {
    sessionList.value = list;
    sessionPageData.value = pageData;
  };

  const setPlayerSessionList = (
    list: SessionOutDto[],
    pageData: ListPageData<SessionOutDto>
  ) => {
    playerSessionList.value = list;
    playerSessionPageData.value = pageData;
  };

  const clearSessionList = () => {
    sessionList.value = [];
    playerSessionList.value = [];

    sessionPageData.value = null;
    playerSessionPageData.value = null;
  };

  const setSessionInfo = (info: SessionOutDto) => {
    sessionInfo.value = info;
  };

  const clearSessionInfo = () => {
    sessionInfo.value = null;
  };

  const setSessionListPage = (page: number) => {
    if (!sessionPageData.value) {
      return;
    }
    sessionPageData.value = {
      ...sessionPageData.value,
      currentPage: page,
    };
  };

  const setPlayerSessionListPage = (page: number) => {
    if (!playerSessionPageData.value) {
      return;
    }
    playerSessionPageData.value = {
      ...playerSessionPageData.value,
      currentPage: page,
    };
  };

  return {
    sessionList,
    playerSessionList,
    sessionPageData,
    playerSessionPageData,
    sessionInfo,

    setSessionList,
    clearSessionList,
    setPlayerSessionList,
    setSessionListPage,
    setSessionInfo,
    clearSessionInfo,
    setPlayerSessionListPage,
  };
});
