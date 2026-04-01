interface UseCreateNewCharacterOptions {
  callback?: (response: BaseApiResponse<CharacterOutDto>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useCreateNewCharacter = (options: UseCreateNewCharacterOptions = {}) => {
  const characterStore = useCharacterStore();
  const { setCharacterInfo, } = characterStore;
  const characterListRequest = useGetCharacterList();
  const myCharacterListRequest = useGetMyCharacterList();

  return usePost<CharacterOutDto, CharacterCreateDto>({
    api: '/characters',
    onSuccess: async (response) => {
      setCharacterInfo(response.data);
      await refetchApiRequests(characterListRequest, myCharacterListRequest);
      options.callback?.(response);
    },
    onError: (error) => {
      options.errorCallback?.(error);
    },
  });
};
