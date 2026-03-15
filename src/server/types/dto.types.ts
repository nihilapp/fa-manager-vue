export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
export type CampaignRole = 'PLAYER' | 'MASTER' | 'SUB_MASTER';
export type SessionRole = 'PLAYER' | 'MASTER';
export type Status = 'PREPARING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'ON_HOLD';
export type DocVisibility = 'PUBLIC' | 'PRIVATE';
export type DocStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type CharacterStatus = 'ACTIVE' | 'RESTING' | 'RETIRED' | 'DECEASED';

export interface CommonInDto {
  id?: number;
  idList?: number[]; // 복수 처리를 위한 idList 추가
  page?: number;
  size?: number;
  sort?: string; // column:asc,column:desc
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number;
  createDate?: string;
  updaterId?: number;
  updateDate?: string;
  deleterId?: number;
  deleteDate?: string;
}

export interface CommonOutDto {
  id?: number;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number | null;
  createDate?: Date | string | null;
  updaterId?: number | null;
  updateDate?: Date | string | null;
  deleterId?: number | null;
  deleteDate?: Date | string | null;
}

/**
 * User DTO
 */
export interface UserInDto extends CommonInDto {
  discordId?: string | null;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UserOutDto extends CommonOutDto {
  discordId?: string | null;
  name?: string;
  email?: string;
  role?: UserRole;

  campaigns?: CampaignOutDto[];
  campaignMembers?: CampaignMemberOutDto[];
  characters?: CharacterOutDto[];
  sessionPlayers?: SessionPlayerOutDto[];
  sessionLogs?: SessionLogOutDto[];
  docs?: DocOutDto[];
  logHistories?: LogHistoryOutDto[];
}

/**
 * Campaign DTO
 */
export interface CampaignInDto extends CommonInDto {
  userId?: number;
  name?: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string;
  endDate?: Date | string | null;
}

export interface CampaignOutDto extends CommonOutDto {
  userId?: number;
  name?: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string;
  endDate?: Date | string | null;

  user?: UserOutDto;
  members?: CampaignMemberOutDto[];
  sessions?: SessionOutDto[];
  characters?: CharacterOutDto[];
}

/**
 * CampaignMember DTO
 */
export interface CampaignMemberInDto extends CommonInDto {
  userId?: number;
  campaignId?: number;
  role?: CampaignRole;
}

export interface CampaignMemberOutDto extends CommonOutDto {
  userId?: number;
  campaignId?: number;
  role?: CampaignRole;

  user?: UserOutDto;
  campaign?: CampaignOutDto;
}

/**
 * Session DTO
 */
export interface SessionInDto extends CommonInDto {
  campaignId?: number;
  no?: number;
  name?: string;
  description?: string | null;
  maxPlayer?: number | null;
  rewardExp?: number | null;
  rewardGold?: number | null;
  status?: Status | null;
  playDate?: Date | string | null;
}

export interface SessionOutDto extends CommonOutDto {
  campaignId?: number;
  no?: number;
  name?: string;
  description?: string | null;
  maxPlayer?: number | null;
  rewardExp?: number | null;
  rewardGold?: number | null;
  status?: Status | null;
  playDate?: Date | string | null;

  campaign?: CampaignOutDto;
  players?: SessionPlayerOutDto[];
  logs?: SessionLogOutDto[];
}

/**
 * SessionPlayer DTO
 */
export interface SessionPlayerInDto extends CommonInDto {
  sessionId?: number;
  userId?: number;
  characterId?: number;
  role?: SessionRole;
}

export interface SessionPlayerOutDto extends CommonOutDto {
  sessionId?: number;
  userId?: number;
  characterId?: number;
  role?: SessionRole;

  session?: SessionOutDto;
  user?: UserOutDto;
  character?: CharacterOutDto;
}

/**
 * SessionLog DTO
 */
export interface SessionLogInDto extends CommonInDto {
  sessionId?: number;
  userId?: number;
  title?: string;
  content?: string | null;
  fileUrl?: string | null;
}

export interface SessionLogOutDto extends CommonOutDto {
  sessionId?: number;
  userId?: number;
  title?: string;
  content?: string | null;
  fileUrl?: string | null;

  session?: SessionOutDto;
  user?: UserOutDto;
}

/**
 * Character DTO
 */
export interface CharacterInDto extends CommonInDto {
  userId?: number;
  campaignId?: number | null;
  name?: string;
  status?: CharacterStatus;
  race?: string;
  startLevel?: number;
  startExp?: number;

  // D&D Stats
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

  // Currency
  startCurrencyCp?: number | null;
  startCurrencySp?: number | null;
  startCurrencyEp?: number | null;
  startCurrencyGp?: number | null;
  startCurrencyPp?: number | null;

  // Equipment
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

  // Requirements
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
}

export interface CharacterOutDto extends CommonOutDto {
  userId?: number;
  campaignId?: number | null;
  name?: string;
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

  startCurrencyCp?: number | null;
  startCurrencySp?: number | null;
  startCurrencyEp?: number | null;
  startCurrencyGp?: number | null;
  startCurrencyPp?: number | null;

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

  user?: UserOutDto;
  campaign?: CampaignOutDto;
  classes?: CharacterClassOutDto[];
  sessionPlayers?: SessionPlayerOutDto[];
}

/**
 * CharacterClass DTO
 */
export interface CharacterClassInDto {
  characterId?: number;
  className?: string;
  level?: number;
}

export interface CharacterClassOutDto {
  characterId?: number;
  className?: string;
  level?: number;

  character?: CharacterOutDto;
}

/**
 * Doc DTO
 */
export interface DocInDto extends CommonInDto {
  userId?: number;
  title?: string;
  description?: string | null;
  category?: string;
  status?: DocStatus;
  visibility?: DocVisibility;
  content?: string | null;
}

export interface DocOutDto extends CommonOutDto {
  userId?: number;
  title?: string;
  description?: string | null;
  category?: string;
  status?: DocStatus;
  visibility?: DocVisibility;
  content?: string | null;

  user?: UserOutDto;
}

/**
 * LogHistory DTO
 */
export interface LogHistoryInDto extends CommonInDto {
  userId?: number | null;
  tableName?: string;
  targetId?: number;
  actionType?: string;
  oldData?: any;
  newData?: any;
  description?: string | null;
}

export interface LogHistoryOutDto extends CommonOutDto {
  userId?: number | null;
  tableName?: string;
  targetId?: number;
  actionType?: string;
  oldData?: any;
  newData?: any;
  description?: string | null;

  user?: UserOutDto;
}
