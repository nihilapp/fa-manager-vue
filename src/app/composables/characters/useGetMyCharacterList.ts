interface UseGetMyCharacterListOptions {
  query?: CharacterQueryDto;
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetMyCharacterList = (options: UseGetMyCharacterListOptions = {}) => {
  const characterStore = useCharacterStore();
  const {
    setMyCharacterList,
    setMyCharacterPageData,
    clearMyCharacterList,
  } = characterStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<CharacterOutDto>>({
    api: '/characters/mine',
    query,
    key: queryKeys.characters.mine(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setMyCharacterList(list);
      setMyCharacterPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearMyCharacterList();
      errorCallback?.(error);
    },
  });
};
