interface UseGetCharacterCurrencyTransactionListOptions {
  query?: CurrencyTransactionQueryDto;
  callback?: (response: BaseApiResponse<ListData<CurrencyTransactionOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCharacterCurrencyTransactionList = (
  characterId: number,
  options: UseGetCharacterCurrencyTransactionListOptions = {}
) => {
  const currencyStore = useCurrencyStore();
  const {
    setCharacterCurrencyTransactionList,
    setCharacterCurrencyTransactionPageData,
    clearCharacterCurrencyTransactionList,
  } = currencyStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  const scopedQuery: CurrencyTransactionQueryDto = {
    ...query,
    characterId,
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

      setCharacterCurrencyTransactionList(list);
      setCharacterCurrencyTransactionPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearCharacterCurrencyTransactionList();
      errorCallback?.(error);
    },
  });
};
