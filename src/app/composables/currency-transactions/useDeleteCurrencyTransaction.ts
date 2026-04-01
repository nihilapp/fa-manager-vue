interface UseDeleteCurrencyTransactionOptions {
  callback?: (response: BaseApiResponse<CurrencyTransactionOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteCurrencyTransaction = (
  transactionId: number,
  options: UseDeleteCurrencyTransactionOptions = {}
) => {
  const currencyStore = useCurrencyStore();
  const { clearCurrencyTransactionInfo, } = currencyStore;
  const currencyTransactionListRequest = useGetCurrencyTransactionList();
  const currencyTransactionInfoRequest = useGetCurrencyTransactionInfo(transactionId);

  return useDelete<CurrencyTransactionOutDto>({
    api: `/currency-transactions/${transactionId}`,
    onSuccess: async (response) => {
      clearCurrencyTransactionInfo();

      await refetchApiRequests(
        currencyTransactionListRequest,
        currencyTransactionInfoRequest,
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
