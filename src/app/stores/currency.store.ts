export const useCurrencyStore = defineStore('currencyStore', () => {
  const currencyTransactionList = ref<CurrencyTransactionOutDto[]>([]);
  const currencyTransactionPageData = ref<ListPageData<CurrencyTransactionOutDto> | null>(null);
  const currencyTransactionInfo = ref<CurrencyTransactionOutDto | null>(null);
  const characterCurrencyTransactionList = ref<CurrencyTransactionOutDto[]>([]);
  const characterCurrencyTransactionPageData = ref<ListPageData<CurrencyTransactionOutDto> | null>(null);
  const playerCurrencyTransactionList = ref<CurrencyTransactionOutDto[]>([]);
  const playerCurrencyTransactionPageData = ref<ListPageData<CurrencyTransactionOutDto> | null>(null);

  const setCurrencyTransactionList = (list: CurrencyTransactionOutDto[]) => {
    currencyTransactionList.value = list;
  };

  const setCurrencyTransactionPageData = (pageData: ListPageData<CurrencyTransactionOutDto> | null) => {
    currencyTransactionPageData.value = pageData;
  };

  const clearCurrencyTransactionList = () => {
    currencyTransactionList.value = [];
    setCurrencyTransactionPageData(null);
  };

  const setCurrencyTransactionInfo = (info: CurrencyTransactionOutDto | null) => {
    currencyTransactionInfo.value = info;
  };

  const clearCurrencyTransactionInfo = () => {
    currencyTransactionInfo.value = null;
  };

  const setCharacterCurrencyTransactionList = (list: CurrencyTransactionOutDto[]) => {
    characterCurrencyTransactionList.value = list;
  };

  const setCharacterCurrencyTransactionPageData = (pageData: ListPageData<CurrencyTransactionOutDto> | null) => {
    characterCurrencyTransactionPageData.value = pageData;
  };

  const clearCharacterCurrencyTransactionList = () => {
    characterCurrencyTransactionList.value = [];
    setCharacterCurrencyTransactionPageData(null);
  };

  const setPlayerCurrencyTransactionList = (list: CurrencyTransactionOutDto[]) => {
    playerCurrencyTransactionList.value = list;
  };

  const setPlayerCurrencyTransactionPageData = (pageData: ListPageData<CurrencyTransactionOutDto> | null) => {
    playerCurrencyTransactionPageData.value = pageData;
  };

  const clearPlayerCurrencyTransactionList = () => {
    playerCurrencyTransactionList.value = [];
    setPlayerCurrencyTransactionPageData(null);
  };

  return {
    currencyTransactionList,
    currencyTransactionPageData,
    currencyTransactionInfo,
    characterCurrencyTransactionList,
    characterCurrencyTransactionPageData,
    playerCurrencyTransactionList,
    playerCurrencyTransactionPageData,
    setCurrencyTransactionList,
    setCurrencyTransactionPageData,
    clearCurrencyTransactionList,
    setCurrencyTransactionInfo,
    clearCurrencyTransactionInfo,
    setCharacterCurrencyTransactionList,
    setCharacterCurrencyTransactionPageData,
    clearCharacterCurrencyTransactionList,
    setPlayerCurrencyTransactionList,
    setPlayerCurrencyTransactionPageData,
    clearPlayerCurrencyTransactionList,
  };
});
