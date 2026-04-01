export const useCampaignStore = defineStore('campaignStore', () => {
  const campaignList = ref<CampaignOutDto[]>([]);
  const campaignPageData = ref<ListPageData<CampaignOutDto> | null>(null);
  const campaignInfo = ref<CampaignOutDto | null>(null);
  const myCampaignList = ref<CampaignOutDto[]>([]);
  const myCampaignPageData = ref<ListPageData<CampaignOutDto> | null>(null);

  const playerCampaignList = ref<CampaignOutDto[]>([]);
  const playerCampaignPageData = ref<ListPageData<CampaignOutDto> | null>(null);
  const campaignMemberList = ref<CampaignMemberOutDto[]>([]);
  const campaignSessionList = ref<SessionOutDto[]>([]);
  const campaignCharacterList = ref<CharacterOutDto[]>([]);

  const setCampaignList = (list: CampaignOutDto[]) => {
    campaignList.value = list;
  };

  const setCampaignPageData = (pageData: ListPageData<CampaignOutDto> | null) => {
    campaignPageData.value = pageData;
  };

  const clearCampaignList = () => {
    campaignList.value = [];
    setCampaignPageData(null);
  };

  const setCampaignInfo = (info: CampaignOutDto | null) => {
    campaignInfo.value = info;
    campaignMemberList.value = info?.members ?? [];
    campaignSessionList.value = info?.sessions ?? [];
    campaignCharacterList.value = info?.characters ?? [];
  };

  const clearCampaignInfo = () => {
    setCampaignInfo(null);
  };

  const setMyCampaignList = (list: CampaignOutDto[]) => {
    myCampaignList.value = list;
  };

  const setMyCampaignPageData = (pageData: ListPageData<CampaignOutDto> | null) => {
    myCampaignPageData.value = pageData;
  };

  const clearMyCampaignList = () => {
    myCampaignList.value = [];
    setMyCampaignPageData(null);
  };

  const setPlayerCampaignList = (list: CampaignOutDto[]) => {
    playerCampaignList.value = list;
  };

  const setPlayerCampaignPageData = (pageData: ListPageData<CampaignOutDto> | null) => {
    playerCampaignPageData.value = pageData;
  };

  const clearPlayerCampaignList = () => {
    playerCampaignList.value = [];
    setPlayerCampaignPageData(null);
  };

  const setCampaignMemberList = (list: CampaignMemberOutDto[]) => {
    campaignMemberList.value = list;
  };

  const clearCampaignMemberList = () => {
    campaignMemberList.value = [];
  };

  const setCampaignSessionList = (list: SessionOutDto[]) => {
    campaignSessionList.value = list;
  };

  const clearCampaignSessionList = () => {
    campaignSessionList.value = [];
  };

  const setCampaignCharacterList = (list: CharacterOutDto[]) => {
    campaignCharacterList.value = list;
  };

  const clearCampaignCharacterList = () => {
    campaignCharacterList.value = [];
  };

  return {
    campaignList,
    campaignPageData,
    campaignInfo,
    myCampaignList,
    myCampaignPageData,
    playerCampaignList,
    playerCampaignPageData,
    campaignMemberList,
    campaignSessionList,
    campaignCharacterList,
    setCampaignList,
    setCampaignPageData,
    clearCampaignList,
    setCampaignInfo,
    clearCampaignInfo,
    setMyCampaignList,
    setMyCampaignPageData,
    clearMyCampaignList,
    setPlayerCampaignList,
    setPlayerCampaignPageData,
    clearPlayerCampaignList,
    setCampaignMemberList,
    clearCampaignMemberList,
    setCampaignSessionList,
    clearCampaignSessionList,
    setCampaignCharacterList,
    clearCampaignCharacterList,
  };
});
