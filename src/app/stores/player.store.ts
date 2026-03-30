export const usePlayerStore = defineStore('playerStore', () => {
  const playerList = ref<PlayerOutDto[]>([]);
  const playerPageData = ref<ListPageData<PlayerOutDto> | null>(null);
  const playerInfo = ref<PlayerOutDto | null>(null);
  const myInfo = ref<PlayerOutDto | null>(null);

  const isAdmin = computed(() => {
    const isDev = import.meta.env.DEV;

    return isDev || [ 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ].includes(myInfo.value?.role ?? '');
  });

  const setPlayerList = (list: PlayerOutDto[]) => {
    playerList.value = list;
  };

  const setPlayerPageData = (pageData: ListPageData<PlayerOutDto> | null) => {
    playerPageData.value = pageData;
  };

  const clearPlayerList = () => {
    playerList.value = [];
    setPlayerPageData(null);
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

  return {
    playerList,
    playerPageData,
    playerInfo,
    myInfo,
    isAdmin,

    setPlayerList,
    setPlayerPageData,
    clearPlayerList,
    setPlayerInfo,
    clearPlayerInfo,
    setMyInfo,
    clearMyInfo,
  };
});
