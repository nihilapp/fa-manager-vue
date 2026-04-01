interface UseUpdateCharacterOptions {
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateCharacter = (characterId: number, options: UseUpdateCharacterOptions = {}) => {
  const characterStore = useCharacterStore();
  const { setCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();
  const characterInfoRequest = useGetCharacterInfo(characterId);

  return usePut<ListData<CharacterOutDto>, CharacterUpdateDto>({
    api: `/characters/${characterId}`,
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
