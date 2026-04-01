interface UseDeleteCampaignOptions {
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteCampaign = (campaignId: number, options: UseDeleteCampaignOptions = {}) => {
  const campaignStore = useCampaignStore();
  const { clearCampaignInfo, } = campaignStore;
  const campaignListRequest = useGetCampaignList();
  const myCampaignListRequest = useGetMyCampaignList();

  return useDelete<ListData<CampaignOutDto>>({
    api: `/campaigns/${campaignId}`,
    onSuccess: async (response) => {
      clearCampaignInfo();
      await refetchApiRequests(campaignListRequest, myCampaignListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
