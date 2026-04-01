interface UseUpdateCharacterStatusOptions {
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useUpdateCharacterStatus = (characterId: number, options: UseUpdateCharacterStatusOptions = {}) => {
  const characterStore = useCharacterStore();
  const { setCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();
  const characterInfoRequest = useGetCharacterInfo(characterId);

  return usePut<ListData<CharacterOutDto>, Pick<CharacterUpdateDto, 'status'>>({
    api: `/characters/${characterId}/status`,
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
