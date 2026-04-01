interface UseDeleteCharacterOptions {
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useDeleteCharacter = (characterId: number, options: UseDeleteCharacterOptions = {}) => {
  const characterStore = useCharacterStore();
  const { clearCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();

  return useDelete<ListData<CharacterOutDto>>({
    api: `/characters/${characterId}`,
    onSuccess: async (response) => {
      clearCharacterInfo();
      await refetchApiRequests(characterListRequest, myCharacterListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
