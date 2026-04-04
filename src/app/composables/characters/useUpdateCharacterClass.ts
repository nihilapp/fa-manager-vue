interface UseUpdateCharacterClassOptions {
  callback?: (response: BaseApiResponse<CharacterOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateCharacterClass = (
  characterId: number,
  className: string,
  options: UseUpdateCharacterClassOptions = {}
) => {
  const characterStore = useCharacterStore();
  const { setCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();
  const characterInfoRequest = useGetCharacterInfo(characterId);

  return usePut<CharacterOutDto, CharacterClassUpdateDto>({
    api: `/characters/${characterId}/classes/${className}`,
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
