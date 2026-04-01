interface UseCreateNewCampaignOptions {
  callback?: (response: BaseApiResponse<CampaignOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateNewCampaign = (options: UseCreateNewCampaignOptions = {}) => {
  const campaignStore = useCampaignStore();
  const { setCampaignInfo, } = campaignStore;
  const campaignListRequest = useGetCampaignList();
  const myCampaignListRequest = useGetMyCampaignList();

  return usePost<CampaignOutDto, CampaignCreateDto>({
    api: '/campaigns',
    onSuccess: async (response) => {
      setCampaignInfo(response.data);
      await refetchApiRequests(campaignListRequest, myCampaignListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
