interface UseDeleteCharacterClassOptions {
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteCharacterClass = (
  characterId: number,
  className: string,
  options: UseDeleteCharacterClassOptions = {}
) => {
  const characterStore = useCharacterStore();
  const { setCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();
  const characterInfoRequest = useGetCharacterInfo(characterId);

  return useDelete<ListData<CharacterOutDto>>({
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
