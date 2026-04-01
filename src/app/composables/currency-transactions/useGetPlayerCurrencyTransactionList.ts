interface UseGetPlayerCurrencyTransactionListOptions {
  query?: CurrencyTransactionQueryDto;
  callback?: (response: BaseApiResponse<ListData<CurrencyTransactionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetPlayerCurrencyTransactionList = (
  userId: number,
  options: UseGetPlayerCurrencyTransactionListOptions = {}
) => {
  const currencyStore = useCurrencyStore();
  const {
    setPlayerCurrencyTransactionList,
    setPlayerCurrencyTransactionPageData,
    clearPlayerCurrencyTransactionList,
  } = currencyStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  const scopedQuery: CurrencyTransactionQueryDto = {
    ...query,
    userId,
  };

  return useGet<ListData<CurrencyTransactionOutDto>>({
    api: '/currency-transactions',
    query: scopedQuery,
    key: queryKeys['currency-transactions'].index(scopedQuery).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setPlayerCurrencyTransactionList(list);
      setPlayerCurrencyTransactionPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearPlayerCurrencyTransactionList();
      errorCallback?.(error);
    },
  });
};
