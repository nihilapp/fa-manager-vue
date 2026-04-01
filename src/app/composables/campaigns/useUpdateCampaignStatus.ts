interface UseUpdateCampaignStatusOptions {
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateCampaignStatus = (campaignId: number, options: UseUpdateCampaignStatusOptions = {}) => {
  const campaignStore = useCampaignStore();
  const { setCampaignInfo, } = campaignStore;
  const campaignListRequest = useGetCampaignList();
  const myCampaignListRequest = useGetMyCampaignList();
  const campaignInfoRequest = useGetCampaignInfo(campaignId);

  return usePut<ListData<CampaignOutDto>, Pick<CampaignUpdateDto, 'status'>>({
    api: `/campaigns/${campaignId}/status`,
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
