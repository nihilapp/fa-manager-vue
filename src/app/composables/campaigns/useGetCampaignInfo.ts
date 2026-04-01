interface UseGetCampaignInfoOptions {
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCampaignInfo = (campaignId: number, options: UseGetCampaignInfoOptions = {}) => {
  const campaignStore = useCampaignStore();
  const {
    setCampaignInfo,
    clearCampaignInfo,
  } = campaignStore;

  return useGet<ListData<CampaignOutDto>>({
    api: `/campaigns/${campaignId}`,
    key: queryKeys.campaigns.detail({
      id: campaignId,
    }).queryKey,
    onSuccess: (response) => {
      const campaign = extractItemById<CampaignOutDto>(response.data, campaignId);

      if (campaign) {
        setCampaignInfo(campaign);
      }

      options.callback?.(response);
    },
    onError: (error) => {
      clearCampaignInfo();
      options.errorCallback?.(error);
    },
  });
};
