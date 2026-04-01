interface UseGetCampaignListOptions {
  query?: CampaignQueryDto;
  callback?: (response: BaseApiResponse<ListData<CampaignOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCampaignList = (options: UseGetCampaignListOptions = {}) => {
  const campaignStore = useCampaignStore();
  const {
    setCampaignList,
    setCampaignPageData,
    clearCampaignList,
  } = campaignStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<CampaignOutDto>>({
    api: '/campaigns',
    query,
    key: queryKeys.campaigns.index(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setCampaignList(list);
      setCampaignPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearCampaignList();
      errorCallback?.(error);
    },
  });
};
