interface StatusInfo {
  name: string;
  color: StatusColor;
}

const unknownPlayerStatusInfo: StatusInfo = {
  name: '알 수 없음',
  color: 'gray',
};

export const usePlayerStore = defineStore('playerStore', () => {
  const playerList = ref<PlayerOutDto[]>([]);
  const playerPageData = ref<ListPageData<PlayerOutDto> | null>(null);
  const playerInfo = ref<PlayerOutDto | null>(null);
  const myInfo = ref<PlayerOutDto | null>(null);

  const isAdmin = computed(() => {
    const isDev = import.meta.env.DEV;

    return isDev || [ 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', ].includes(myInfo.value?.role ?? '');
  });

  const playerStatusMap = new Map<PlayerStatus, StatusInfo>([
    [ 'ACTIVE', { name: '활성', color: 'green', }, ],
    [ 'INACTIVE', { name: '비활성', color: 'gray', }, ],
    [ 'REST', { name: '휴면', color: 'orange', }, ],
  ]);

  const getPlayerStatusInfo = (status?: string | null): StatusInfo => {
    if (!status)
      return unknownPlayerStatusInfo;

    return playerStatusMap.get(status as PlayerStatus) ?? unknownPlayerStatusInfo;
  };

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
    playerStatusMap,
    getPlayerStatusInfo,

    setPlayerList,
    setPlayerPageData,
    clearPlayerList,
    setPlayerInfo,
    clearPlayerInfo,
    setMyInfo,
    clearMyInfo,
  };
});
