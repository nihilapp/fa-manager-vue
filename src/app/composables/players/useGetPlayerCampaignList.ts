interface Options {
  query?: CampaignQueryDto;
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetPlayerCampaignList = (playerId: number, options: Options = {}) => {
  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  const campaignStore = useCampaignStore();
  const {
    setPlayerCampaignList,
    setPlayerCampaignPageData,
    clearPlayerCampaignList,
  } = campaignStore;

  return useGet<ListData<CampaignOutDto>>({
    api: `/players/${playerId}/campaigns`,
    query,
    key: queryKeys.players.campaigns({
      playerId,
      ...query,
    }).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setPlayerCampaignList(list);
      setPlayerCampaignPageData(pageData);

      if (callback) {
        callback(response);
      }
    },
    onError: (error) => {
      clearPlayerCampaignList();

      if (errorCallback) {
        errorCallback(error);
      }
    },
  });
};
