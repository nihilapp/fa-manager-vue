export interface CharacterQueryDto extends CommonQueryDto {
  userId?: number;
  campaignId?: number;
  name?: string;
  status?: CharacterStatus;
  race?: string;
  currentLevel?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  ac?: number;
  hp?: number;
  speed?: string;
  vision?: string;
  skills?: string;
  advantage?: string;
  disadvantage?: string;
  resistance?: string;
  immunity?: string;
}

export interface CharacterCreateDto {
  name: string;
  race: string;
  userId?: number;
  campaignId?: number;
  status?: CharacterStatus;
  startLevel?: number;
  startExp?: number;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  ac?: number;
  hp?: number;
  speed?: string;
  vision?: string;
  skills?: string;
  advantage?: string;
  disadvantage?: string;
  resistance?: string;
  immunity?: string;
  startCurrencyCp?: number;
  startCurrencySp?: number;
  startCurrencyEp?: number;
  startCurrencyGp?: number;
  startCurrencyPp?: number;
  mainHand?: string;
  offHand?: string;
  armor?: string;
  head?: string;
  gauntlet?: string;
  boots?: string;
  belt?: string;
  cloak?: string;
  accessory1?: string;
  accessory2?: string;
  accessory3?: string;
  accessory4?: string;
  reqStrDex8?: string;
  reqStrDex10?: string;
  reqStrDex12?: string;
  reqStrDex14?: string;
  reqStr16?: string;
  reqStr18?: string;
  reqStr20?: string;
  reqCon8?: string;
  reqCon10?: string;
  reqCon12?: string;
  reqCon14?: string;
  reqCon16?: string;
  reqCon18?: string;
  reqCon20?: string;
}

export interface CharacterUpdateDto extends CommonInDto {
  name?: string;
  campaignId?: number | null;
  status?: CharacterStatus;
  race?: string;
  startLevel?: number;
  startExp?: number;
  str?: number | null;
  dex?: number | null;
  con?: number | null;
  int?: number | null;
  wis?: number | null;
  cha?: number | null;
  ac?: number | null;
  hp?: number | null;
  speed?: string | null;
  vision?: string | null;
  skills?: string | null;
  advantage?: string | null;
  disadvantage?: string | null;
  resistance?: string | null;
  immunity?: string | null;
  mainHand?: string | null;
  offHand?: string | null;
  armor?: string | null;
  head?: string | null;
  gauntlet?: string | null;
  boots?: string | null;
  belt?: string | null;
  cloak?: string | null;
  accessory1?: string | null;
  accessory2?: string | null;
  accessory3?: string | null;
  accessory4?: string | null;
  reqStrDex8?: string | null;
  reqStrDex10?: string | null;
  reqStrDex12?: string | null;
  reqStrDex14?: string | null;
  reqStr16?: string | null;
  reqStr18?: string | null;
  reqStr20?: string | null;
  reqCon8?: string | null;
  reqCon10?: string | null;
  reqCon12?: string | null;
  reqCon14?: string | null;
  reqCon16?: string | null;
  reqCon18?: string | null;
  reqCon20?: string | null;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
}

export interface CharacterOutDto extends CommonOutDto {
  userId: number;
  campaignId: number | null;
  name: string;
  status: CharacterStatus;
  race: string;
  startLevel: number;
  startExp: number;
  currentLevel: number;
  currentExp: number;
  currentCurrencyGp: number;
  currentCurrencyCp: number | null;
  currentCurrencySp: number | null;
  currentCurrencyEp: number | null;
  currentCurrencyPp: number | null;
  str: number | null;
  dex: number | null;
  con: number | null;
  int: number | null;
  wis: number | null;
  cha: number | null;
  ac: number | null;
  hp: number | null;
  speed: string | null;
  vision: string | null;
  skills: string | null;
  advantage: string | null;
  disadvantage: string | null;
  resistance: string | null;
  immunity: string | null;
  mainHand: string | null;
  offHand: string | null;
  armor: string | null;
  head: string | null;
  gauntlet: string | null;
  boots: string | null;
  belt: string | null;
  cloak: string | null;
  accessory1: string | null;
  accessory2: string | null;
  accessory3: string | null;
  accessory4: string | null;
  reqStrDex8: string | null;
  reqStrDex10: string | null;
  reqStrDex12: string | null;
  reqStrDex14: string | null;
  reqStr16: string | null;
  reqStr18: string | null;
  reqStr20: string | null;
  reqCon8: string | null;
  reqCon10: string | null;
  reqCon12: string | null;
  reqCon14: string | null;
  reqCon16: string | null;
  reqCon18: string | null;
  reqCon20: string | null;
  user: UserOutDto | null;
  campaign: CampaignOutDto | null;
  classes: CharacterClassOutDto[];
  sessions: SessionPlayerOutDto[];
}

export interface CharacterClassQueryDto {
  characterId?: number;
  className?: string;
  level?: number;
}

export interface CharacterClassCreateDto {
  className: string;
  level?: number;
}

export interface CharacterClassUpdateDto {
  level?: number;
}

export interface CharacterClassOutDto {
  characterId: number;
  className: string;
  level: number;

  character: CharacterOutDto | null;
}
