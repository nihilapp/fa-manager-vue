interface UseGetCurrencyTransactionInfoOptions {
  callback?: (response: BaseApiResponse<CurrencyTransactionOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCurrencyTransactionInfo = (
  transactionId: number,
  options: UseGetCurrencyTransactionInfoOptions = {}
) => {
  const {
    callback,
    errorCallback,
  } = options;

  const currencyStore = useCurrencyStore();
  const {
    setCurrencyTransactionInfo,
    clearCurrencyTransactionInfo,
  } = currencyStore;

  return useGet<CurrencyTransactionOutDto>({
    api: `/currency-transactions/${transactionId}`,
    key: queryKeys['currency-transactions'].detail({
      id: transactionId,
    }).queryKey,
    onSuccess: (response) => {
      if (String(response.data.id) === String(transactionId)) {
        setCurrencyTransactionInfo(response.data);
      }

      callback?.(response);
    },
    onError: (error) => {
      clearCurrencyTransactionInfo();
      errorCallback?.(error);
    },
  });
};
