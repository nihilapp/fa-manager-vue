interface UseGetCharacterInfoOptions {
  callback?: (response: BaseApiResponse<ListData<CharacterOutDto>>) => void;
  errorCallback?: (error: ApiErrorResponse) => void;
}

export const useGetCharacterInfo = (characterId: number, options: UseGetCharacterInfoOptions = {}) => {
  const characterStore = useCharacterStore();
  const {
    setCharacterInfo,
    clearCharacterInfo,
  } = characterStore;

  return useGet<ListData<CharacterOutDto>>({
    api: `/characters/${characterId}`,
    key: queryKeys.characters.detail({
      id: characterId,
    }).queryKey,
    onSuccess: (response) => {
      const character = extractItemById<CharacterOutDto>(response.data, characterId);

      if (character) {
        setCharacterInfo(character);
      }

      options.callback?.(response);
    },
    onError: (error) => {
      clearCharacterInfo();
      options.errorCallback?.(error);
    },
  });
};
