interface UseCreateCharacterClassOptions {
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateCharacterClass = (characterId: number, options: UseCreateCharacterClassOptions = {}) => {
  const characterStore = useCharacterStore();
  const { setCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();
  const characterInfoRequest = useGetCharacterInfo(characterId);

  return usePost<ListData<CharacterOutDto>, CharacterClassCreateDto>({
    api: `/characters/${characterId}/classes`,
    onSuccess: async (response) => {
      const character = extractItemById<CharacterOutDto>(response.data, characterId);

      if (character) {
        setCharacterInfo(character);
      }

      await refetchApiRequests(characterListRequest, myCharacterListRequest, characterInfoRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
