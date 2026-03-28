export const usePlayerStore = defineStore('playerStore', () => {
  const playerList = ref<PlayerOutDto[]>([]);
  const playerPageData = ref<ListPageData<PlayerOutDto> | null>(null);
  const playerListCount = ref(0);
  const playerInfo = ref<PlayerOutDto | null>(null);
  const myPlayerInfo = ref<PlayerOutDto | null>(null);

  const isAdmin = computed(() => {
    const isDev = import.meta.env.DEV;

    return isDev || [ 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ].includes(myPlayerInfo.value?.role ?? '');
  });

  const setPlayerList = (
    list: PlayerOutDto[],
    pageData: ListPageData<PlayerOutDto>
  ) => {
    playerList.value = list;
    playerPageData.value = pageData;
    playerListCount.value = pageData.totalElements;
  };

  const clearPlayerList = () => {
    playerList.value = [];
    playerPageData.value = null;
    playerListCount.value = 0;
  };

  const setPlayerInfo = (player: PlayerOutDto | null) => {
    playerInfo.value = player;
  };

  const setMyPlayerInfo = (player: PlayerOutDto | null) => {
    myPlayerInfo.value = player;
  };

  const clearMyPlayerInfo = () => {
    myPlayerInfo.value = null;
  };

  const setplayerListPage = (page: number) => {
    if (!playerPageData.value) {
      return;
    }
    playerPageData.value = {
      ...playerPageData.value,
      currentPage: page,
    };
  };

  return {
    playerList,
    playerPageData,
    playerListCount,
    playerInfo,
    myPlayerInfo,
    isAdmin,

    setPlayerList,
    clearPlayerList,
    setPlayerInfo,
    setMyPlayerInfo,
    clearMyPlayerInfo,
  };
});
