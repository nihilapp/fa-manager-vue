interface UseRemoveCampaignCharacterOptions {
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useRemoveCampaignCharacter = (
  campaignId: number,
  characterId: number,
  options: UseRemoveCampaignCharacterOptions = {}
) => {
  const campaignStore = useCampaignStore();
  const { setCampaignInfo, } = campaignStore;
  const campaignListRequest = useGetCampaignList();
  const myCampaignListRequest = useGetMyCampaignList();
  const campaignInfoRequest = useGetCampaignInfo(campaignId);

  return useDelete<ListData<CampaignOutDto>>({
    api: `/campaigns/${campaignId}/characters/${characterId}`,
    onSuccess: async (response) => {
      const campaign = extractItemById<CampaignOutDto>(response.data, campaignId);

      if (campaign) {
        setCampaignInfo(campaign);
      }

      await refetchApiRequests(campaignListRequest, myCampaignListRequest, campaignInfoRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
