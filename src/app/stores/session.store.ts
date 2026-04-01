export const useSessionStore = defineStore('sessionStore', () => {
  const sessionList = ref<SessionOutDto[]>([]);
  const sessionPageData = ref<ListPageData<SessionOutDto> | null>(null);
  const sessionInfo = ref<SessionOutDto | null>(null);
  const mySessionList = ref<SessionOutDto[]>([]);
  const mySessionPageData = ref<ListPageData<SessionOutDto> | null>(null);

  const playerSessionList = ref<SessionOutDto[]>([]);
  const playerSessionPageData = ref<ListPageData<SessionOutDto> | null>(null);
  const sessionPlayerList = ref<SessionPlayerOutDto[]>([]);
  const sessionLogList = ref<SessionLogOutDto[]>([]);
  const sessionLogPageData = ref<ListPageData<SessionLogOutDto> | null>(null);
  const sessionLogInfo = ref<SessionLogOutDto | null>(null);

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
    sessionPlayerList.value = info?.players ?? [];
    sessionLogList.value = info?.logs ?? [];
  };

  const clearSessionInfo = () => {
    setSessionInfo(null);
  };

  const setMySessionList = (list: SessionOutDto[]) => {
    mySessionList.value = list;
  };

  const setMySessionPageData = (pageData: ListPageData<SessionOutDto> | null) => {
    mySessionPageData.value = pageData;
  };

  const clearMySessionList = () => {
    mySessionList.value = [];
    setMySessionPageData(null);
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

  const setSessionPlayerList = (list: SessionPlayerOutDto[]) => {
    sessionPlayerList.value = list;
  };

  const clearSessionPlayerList = () => {
    sessionPlayerList.value = [];
  };

  const setSessionLogList = (list: SessionLogOutDto[]) => {
    sessionLogList.value = list;
  };

  const setSessionLogPageData = (pageData: ListPageData<SessionLogOutDto> | null) => {
    sessionLogPageData.value = pageData;
  };

  const clearSessionLogList = () => {
    sessionLogList.value = [];
    setSessionLogPageData(null);
  };

  const setSessionLogInfo = (info: SessionLogOutDto | null) => {
    sessionLogInfo.value = info;
  };

  const clearSessionLogInfo = () => {
    sessionLogInfo.value = null;
  };

  return {
    sessionList,
    sessionPageData,
    sessionInfo,
    mySessionList,
    mySessionPageData,
    playerSessionList,
    playerSessionPageData,
    sessionPlayerList,
    sessionLogList,
    sessionLogPageData,
    sessionLogInfo,
    setSessionList,
    setSessionPageData,
    clearSessionList,
    setSessionInfo,
    clearSessionInfo,
    setMySessionList,
    setMySessionPageData,
    clearMySessionList,
    setPlayerSessionList,
    setPlayerSessionPageData,
    clearPlayerSessionList,
    setSessionPlayerList,
    clearSessionPlayerList,
    setSessionLogList,
    setSessionLogPageData,
    clearSessionLogList,
    setSessionLogInfo,
    clearSessionLogInfo,
  };
});
