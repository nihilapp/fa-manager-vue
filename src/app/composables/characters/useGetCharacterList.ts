interface UseGetCharacterListOptions {
  query?: CharacterQueryDto;
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCharacterList = (options: UseGetCharacterListOptions = {}) => {
  const characterStore = useCharacterStore();
  const {
    setCharacterList,
    setCharacterPageData,
    clearCharacterList,
  } = characterStore;

  const {
    query = {},
    callback,
    errorCallback,
  } = options;

  return useGet<ListData<CharacterOutDto>>({
    api: '/characters',
    query,
    key: queryKeys.characters.index(query).queryKey,
    onSuccess: (response) => {
      const {
        list,
        ...pageData
      } = response.data;

      setCharacterList(list);
      setCharacterPageData(pageData);
      callback?.(response);
    },
    onError: (error) => {
      clearCharacterList();
      errorCallback?.(error);
    },
  });
};
