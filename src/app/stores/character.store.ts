export const useCharacterStore = defineStore('characterStore', () => {
  const characterList = ref<CharacterOutDto[]>([]);
  const characterPageData = ref<ListPageData<CharacterOutDto> | null>(null);
  const characterInfo = ref<CharacterOutDto | null>(null);
  const myCharacterList = ref<CharacterOutDto[]>([]);
  const myCharacterPageData = ref<ListPageData<CharacterOutDto> | null>(null);
  const characterClassList = ref<CharacterClassOutDto[]>([]);

  const setCharacterList = (list: CharacterOutDto[]) => {
    characterList.value = list;
  };

  const setCharacterPageData = (pageData: ListPageData<CharacterOutDto> | null) => {
    characterPageData.value = pageData;
  };

  const clearCharacterList = () => {
    characterList.value = [];
    setCharacterPageData(null);
  };

  const setCharacterInfo = (info: CharacterOutDto | null) => {
    characterInfo.value = info;
    characterClassList.value = info?.classes ?? [];
  };

  const clearCharacterInfo = () => {
    setCharacterInfo(null);
  };

  const setMyCharacterList = (list: CharacterOutDto[]) => {
    myCharacterList.value = list;
  };

  const setMyCharacterPageData = (pageData: ListPageData<CharacterOutDto> | null) => {
    myCharacterPageData.value = pageData;
  };

  const clearMyCharacterList = () => {
    myCharacterList.value = [];
    setMyCharacterPageData(null);
  };

  const setCharacterClassList = (list: CharacterClassOutDto[]) => {
    characterClassList.value = list;
  };

  const clearCharacterClassList = () => {
    characterClassList.value = [];
  };

  return {
    characterList,
    characterPageData,
    characterInfo,
    myCharacterList,
    myCharacterPageData,
    characterClassList,
    setCharacterList,
    setCharacterPageData,
    clearCharacterList,
    setCharacterInfo,
    clearCharacterInfo,
    setMyCharacterList,
    setMyCharacterPageData,
    clearMyCharacterList,
    setCharacterClassList,
    clearCharacterClassList,
  };
});
