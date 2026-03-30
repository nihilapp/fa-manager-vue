export const usePlayerStore = defineStore('playerStore', () => {
  const playerList = ref<PlayerOutDto[]>([]);
  const playerPageData = ref<ListPageData<PlayerOutDto> | null>(null);
  const playerListCount = ref(0);
  const playerInfo = ref<PlayerOutDto | null>(null);
  const myInfo = ref<PlayerOutDto | null>(null);

  const isAdmin = computed(() => {
    const isDev = import.meta.env.DEV;

    return isDev || [ 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ].includes(myInfo.value?.role ?? '');
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

  const clearPlayerInfo = () => {
    playerInfo.value = null;
  };

  const setMyInfo = (player: PlayerOutDto | null) => {
    myInfo.value = player;
  };

  const clearMyInfo = () => {
    myInfo.value = null;
  };

  const setPlayerListPage = (page: number) => {
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
    myInfo,
    isAdmin,

    setPlayerList,
    clearPlayerList,
    setPlayerInfo,
    clearPlayerInfo,
    setMyInfo,
    clearMyInfo,
    setPlayerListPage,
  };
});
