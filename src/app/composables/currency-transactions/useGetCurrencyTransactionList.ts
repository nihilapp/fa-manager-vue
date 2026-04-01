interface UseGetCurrencyTransactionListOptions {
  query?: CurrencyTransactionQueryDto;
  callback?: (response: BaseApiResponse<ListData<CurrencyTransactionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCurrencyTransactionList = (options: UseGetCurrencyTransactionListOptions = {}) => {
  const currencyStore = useCurrencyStore();
  const {
    setCurrencyTransactionList,
    setCurrencyTransactionPageData,
    clearCurrencyTransactionList,
  } = currencyStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<CurrencyTransactionOutDto>>({
    api: '/currency-transactions',
    query,
    key: queryKeys['currency-transactions'].index(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setCurrencyTransactionList(list);
      setCurrencyTransactionPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearCurrencyTransactionList();
      errorCallback?.(error);
    },
  });
};
