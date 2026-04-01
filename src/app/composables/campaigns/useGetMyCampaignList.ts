interface UseGetMyCampaignListOptions {
  query?: CampaignQueryDto;
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetMyCampaignList = (options: UseGetMyCampaignListOptions = {}) => {
  const campaignStore = useCampaignStore();
  const {
    setMyCampaignList,
    setMyCampaignPageData,
    clearMyCampaignList,
  } = campaignStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<CampaignOutDto>>({
    api: '/campaigns/mine',
    query,
    key: queryKeys.campaigns.mine(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setMyCampaignList(list);
      setMyCampaignPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearMyCampaignList();
      errorCallback?.(error);
    },
  });
};
