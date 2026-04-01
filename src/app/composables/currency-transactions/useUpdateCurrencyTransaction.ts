interface UseUpdateCurrencyTransactionOptions {
  callback?: (response: BaseApiResponse<CurrencyTransactionOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateCurrencyTransaction = (
  transactionId: number,
  options: UseUpdateCurrencyTransactionOptions = {}
) => {
  const currencyStore = useCurrencyStore();
  const { setCurrencyTransactionInfo, } = currencyStore;
  const currencyTransactionListRequest = useGetCurrencyTransactionList();
  const currencyTransactionInfoRequest = useGetCurrencyTransactionInfo(transactionId);

  return usePut<CurrencyTransactionOutDto, CurrencyTransactionUpdateDto>({
    api: `/currency-transactions/${transactionId}`,
    onSuccess: async (response) => {
      if (String(response.data.id) === String(transactionId)) {
        setCurrencyTransactionInfo(response.data);
      }

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
