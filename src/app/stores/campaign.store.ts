export const useCampaignStore = defineStore('campaignStore', () => {
  const campaignList = ref<CampaignOutDto[]>([]);
  const campaignPageData = ref<ListPageData<CampaignOutDto> | null>(null);
  const campaignInfo = ref<CampaignOutDto | null>(null);

  const playerCampaignList = ref<CampaignOutDto[]>([]);
  const playerCampaignPageData = ref<ListPageData<CampaignOutDto> | null>(null);

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
  };

  const clearCampaignInfo = () => {
    campaignInfo.value = null;
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

  return {
    campaignList,
    campaignPageData,
    campaignInfo,
    playerCampaignList,
    playerCampaignPageData,
    setCampaignList,
    setCampaignPageData,
    clearCampaignList,
    setCampaignInfo,
    clearCampaignInfo,
    setPlayerCampaignList,
    setPlayerCampaignPageData,
    clearPlayerCampaignList,
  };
});
