export interface CharacterFormValues {
  name: string;
  campaignId: number | null;
  status: CharacterStatus;
  startLevel: string | number;
  startCurrencyCp: string | number;
  startCurrencySp: string | number;
  startCurrencyEp: string | number;
  startCurrencyGp: string | number;
  startCurrencyPp: string | number;
}

export interface CharacterClassFormValue {
  id: string;
  originalClassName: string;
  className: string;
  subClassName: string;
  level: string;
}

export const characterStatusValues = [ 'ACTIVE', 'RESTING', 'RETIRED', 'DECEASED', ] as const;

function normalizeNullableIntegerValue(value: unknown) {
  if (value == null) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? value
      : value;
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return null;
  }

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue);
  }

  return value;
}

function normalizeIntegerTextValue(value: unknown) {
  if (value == null) {
    return '';
  }

  return String(value).trim();
}

function createOptionalIntegerStringSchema(fieldName: string) {
  return z.preprocess((value) => normalizeIntegerTextValue(value), z.string().refine((value) => {
    const normalizedValue = value.trim();

    return !normalizedValue || /^\d+$/.test(normalizedValue);
  }, `${fieldName}은(는) 0 이상의 정수만 입력해 주세요.`));
}

export function createCharacterFormValidationSchema() {
  return toTypedSchema(z.object({
    name: z.string().trim().min(1, '이름을 입력해 주세요.'),
    campaignId: z.preprocess((value) => normalizeNullableIntegerValue(value), z.number().int().nullable()),
    status: z.enum(characterStatusValues, '상태 값이 올바르지 않습니다.'),
    startLevel: z.preprocess((value) => normalizeIntegerTextValue(value), z.string()
      .refine((value) => value.trim().length > 0, '시작 레벨을 입력해 주세요.')
      .refine((value) => /^\d+$/.test(value.trim()), '시작 레벨은 0 이상의 정수만 입력해 주세요.')),
    startCurrencyCp: createOptionalIntegerStringSchema('CP'),
    startCurrencySp: createOptionalIntegerStringSchema('SP'),
    startCurrencyEp: createOptionalIntegerStringSchema('EP'),
    startCurrencyGp: createOptionalIntegerStringSchema('GP'),
    startCurrencyPp: createOptionalIntegerStringSchema('PP'),
  }));
}

export const useCharacterStore = defineStore('characterStore', () => {
  const campaignStore = useCampaignStore();
  const { campaignList, } = storeToRefs(campaignStore);
  const currencyStore = useCurrencyStore();
  const { characterCurrencyTransactionList, } = storeToRefs(currencyStore);

  const characterList = ref<CharacterOutDto[]>([]);
  const characterPageData = ref<ListPageData<CharacterOutDto> | null>(null);
  const characterInfo = ref<CharacterOutDto | null>(null);
  const myCharacterList = ref<CharacterOutDto[]>([]);
  const myCharacterPageData = ref<ListPageData<CharacterOutDto> | null>(null);
  const characterClassList = ref<CharacterClassOutDto[]>([]);
  const characterCreateClassForms = ref<CharacterClassFormValue[]>([]);
  const createCharacterClassSeed = ref(1);
  const characterEditorLoading = ref(false);
  const characterStatusOptions = ref([
    { code: 'ACTIVE', name: '활동 중', },
    { code: 'RESTING', name: '휴식 중', },
    { code: 'RETIRED', name: '은퇴', },
    { code: 'DECEASED', name: '사망', },
  ] as const);

  function toText(value: string | number | null | undefined) {
    if (value == null) {
      return '';
    }

    return String(value);
  }

  function parseOptionalNumber(value: string | number) {
    const normalizedValue = String(value).trim();

    if (!normalizedValue) {
      return undefined;
    }

    const parsedValue = Number(normalizedValue);

    return Number.isNaN(parsedValue)
      ? undefined
      : parsedValue;
  }

  function createEmptyCharacterFormValues(): CharacterFormValues {
    return {
      name: '',
      campaignId: null,
      status: 'ACTIVE',
      startLevel: '1',
      startCurrencyCp: '',
      startCurrencySp: '',
      startCurrencyEp: '',
      startCurrencyGp: '',
      startCurrencyPp: '',
    };
  }

  function createCharacterClassFormValue(): CharacterClassFormValue {
    return {
      id: `class-${createCharacterClassSeed.value++}`,
      originalClassName: '',
      className: '',
      subClassName: '',
      level: '1',
    };
  }

  function createCharacterClassFormValueFromInfo(item: CharacterClassOutDto): CharacterClassFormValue {
    return {
      id: `class-${createCharacterClassSeed.value++}`,
      originalClassName: item.className,
      className: item.className,
      subClassName: item.subClassName,
      level: toText(item.level || 1) || '1',
    };
  }

  function getCharacterFormValuesFromInfo(info: CharacterOutDto | null) {
    if (!info) {
      return createEmptyCharacterFormValues();
    }

    return {
      name: info.name,
      campaignId: info.campaignId,
      status: info.status,
      startLevel: toText(info.startLevel),
      startCurrencyCp: toText(info.currentCurrencyCp),
      startCurrencySp: toText(info.currentCurrencySp),
      startCurrencyEp: toText(info.currentCurrencyEp),
      startCurrencyGp: toText(info.currentCurrencyGp),
      startCurrencyPp: toText(info.currentCurrencyPp),
    };
  }

  function buildCharacterSubmitPayload(formValues: CharacterFormValues) {
    return {
      name: formValues.name.trim(),
      campaignId: formValues.campaignId ?? undefined,
      status: formValues.status,
      startLevel: parseOptionalNumber(formValues.startLevel),
      startCurrencyCp: parseOptionalNumber(formValues.startCurrencyCp),
      startCurrencySp: parseOptionalNumber(formValues.startCurrencySp),
      startCurrencyEp: parseOptionalNumber(formValues.startCurrencyEp),
      startCurrencyGp: parseOptionalNumber(formValues.startCurrencyGp),
      startCurrencyPp: parseOptionalNumber(formValues.startCurrencyPp),
    };
  }

  function resetCharacterCreateClassForms() {
    characterCreateClassForms.value = [ createCharacterClassFormValue(), ];
  }

  function syncCharacterCreateClassFormsFromInfo(info: CharacterOutDto | null) {
    const nextForms = (info?.classes || []).map((item) => createCharacterClassFormValueFromInfo(item));

    characterCreateClassForms.value = nextForms.length
      ? nextForms
      : [ createCharacterClassFormValue(), ];
  }

  function addCharacterCreateClassForm() {
    characterCreateClassForms.value.push(createCharacterClassFormValue());
  }

  function removeCharacterCreateClassForm(id: string) {
    if (characterCreateClassForms.value.length === 1) {
      resetCharacterCreateClassForms();
      return;
    }

    characterCreateClassForms.value = characterCreateClassForms.value.filter((item) => item.id !== id);
  }

  function getCharacterCreateClassPayloads() {
    return characterCreateClassForms.value
      .map((item) => ({
        className: item.className.trim(),
        subClassName: item.subClassName.trim(),
        level: parseOptionalNumber(item.level) ?? 1,
      }))
      .filter((item) => item.className);
  }

  const characterCampaignOptions = computed(() => [
    {
      id: null,
      name: '선택 안 함',
    },
    ...campaignList.value.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
    })),
  ]);

  const characterClassSummaryItems = computed(() => {
    return characterClassList.value.map((item) => `${item.className} / ${item.subClassName} Lv.${item.level}`);
  });

  const characterCurrentLevelText = computed(() => {
    if (!characterInfo.value) {
      return '-';
    }

    return String(characterInfo.value.currentLevel ?? '-');
  });

  const characterCurrentCurrencySummary = computed(() => {
    if (!characterInfo.value) {
      return '-';
    }

    const transactionSum = characterCurrencyTransactionList.value.reduce((acc, transaction) => {
      acc.cp += transaction.deltaCp || 0;
      acc.sp += transaction.deltaSp || 0;
      acc.ep += transaction.deltaEp || 0;
      acc.gp += transaction.deltaGp || 0;
      acc.pp += transaction.deltaPp || 0;

      return acc;
    }, {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0,
    });

    const sessionRewardGold = (characterInfo.value.sessions || []).reduce((acc, sessionPlayer) => {
      return acc + (sessionPlayer.session?.rewardGold || 0);
    }, 0);

    return [
      `CP ${transactionSum.cp}`,
      `SP ${transactionSum.sp}`,
      `EP ${transactionSum.ep}`,
      `GP ${transactionSum.gp + sessionRewardGold}`,
      `PP ${transactionSum.pp}`,
    ].join(' / ');
  });

  function setCharacterEditorLoading(value: boolean) {
    characterEditorLoading.value = value;
  }

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
    characterCreateClassForms,
    characterEditorLoading,
    characterStatusOptions,
    characterCampaignOptions,
    characterClassSummaryItems,
    characterCurrentLevelText,
    characterCurrentCurrencySummary,
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
    createCharacterFormValidationSchema,
    createEmptyCharacterFormValues,
    getCharacterFormValuesFromInfo,
    buildCharacterSubmitPayload,
    resetCharacterCreateClassForms,
    syncCharacterCreateClassFormsFromInfo,
    addCharacterCreateClassForm,
    removeCharacterCreateClassForm,
    getCharacterCreateClassPayloads,
    setCharacterEditorLoading,
  };
});
