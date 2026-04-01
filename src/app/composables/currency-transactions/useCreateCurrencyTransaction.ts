interface UseCreateCurrencyTransactionOptions {
  callback?: (response: BaseApiResponse<CurrencyTransactionOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateCurrencyTransaction = (options: UseCreateCurrencyTransactionOptions = {}) => {
  const currencyStore = useCurrencyStore();
  const { setCurrencyTransactionInfo, } = currencyStore;
  const currencyTransactionListRequest = useGetCurrencyTransactionList();

  return usePost<CurrencyTransactionOutDto, CurrencyTransactionCreateDto>({
    api: '/currency-transactions',
    onSuccess: async (response) => {
      setCurrencyTransactionInfo(response.data);

      await refetchApiRequests(
        currencyTransactionListRequest,
        useGetCharacterCurrencyTransactionList(response.data.characterId),
        useGetPlayerCurrencyTransactionList(response.data.userId)
      );

      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
