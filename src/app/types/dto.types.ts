export interface CommonInDto {
  page?: number;
  size?: number;
  sort?: string; // column:asc,column:desc
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number;
  createdDate?: string;
  updaterId?: number;
  updatedDate?: string;
  deleterId?: number;
  deletedDate?: string;
}

export interface CommonOutDto {
  id?: number;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
  creatorId?: number | null;
  createdDate?: string | null;
  updaterId?: number | null;
  updatedDate?: string | null;
  deleterId?: number | null;
  deletedDate?: string | null;
}

// ==============================================
// Users
// ==============================================
export interface UserInDto extends CommonInDto {
  name?: string;
  discordId?: string;
  role?: 'ADMIN' | 'USER';
}

export interface UserOutDto extends CommonOutDto {
  name?: string;
  discordId?: string;
  role?: 'ADMIN' | 'USER';
  // Relations
  campaignMembers?: CampaignMemberOutDto[] | null;
  characters?: CharacterOutDto[] | null;
  hostedSessions?: SessionOutDto[] | null;
}

// ==============================================
// Campaigns
// ==============================================
export interface CampaignInDto extends CommonInDto {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface CampaignOutDto extends CommonOutDto {
  name?: string | null;
  startDate?: string;
  endDate?: string | null;
  // Relations
  members?: CampaignMemberOutDto[] | null;
  characters?: CharacterOutDto[] | null;
  sessions?: SessionOutDto[] | null;
}

// ==============================================
// Campaign Members
// ==============================================
export interface CampaignMemberInDto extends CommonInDto {
  campaignId?: number;
  userId?: number;
  role?: string;
}

export interface CampaignMemberOutDto extends CommonOutDto {
  campaignId?: number;
  userId?: number;
  role?: string | null;
  // Relations
  campaign?: CampaignOutDto | null;
  user?: UserOutDto | null;
}

// ==============================================
// Characters
// ==============================================
export interface CharacterInDto extends CommonInDto {
  campaignId?: number;
  userId?: number;
  name?: string;
  level?: number;
}

export interface CharacterClassDto {
  class: string;
  subclass: string;
}

export interface CharacterOutDto extends CommonOutDto {
  campaignId?: number;
  userId?: number;
  name?: string;
  level?: number | null;
  exp?: number | null;
  currency?: number | null;
  classes?: CharacterClassDto[] | null;
  // Relations
  campaign?: CampaignOutDto | null;
  user?: UserOutDto | null;
  playSessions?: SessionCharacterOutDto[] | null;
  expLogs?: ExpLogOutDto[] | null;
  currencyLogs?: CurrencyLogOutDto[] | null;
}

// ==============================================
// Sessions
// ==============================================
export interface SessionInDto extends CommonInDto {
  campaignId?: number;
  title?: string;
  masterId?: number;
  playDate?: string;
}

export interface SessionOutDto extends CommonOutDto {
  campaignId?: number;
  title?: string;
  playDate?: string | null;
  masterId?: number | null;
  expReward?: number | null;
  goldReward?: number | null;
  // Relations
  campaign?: CampaignOutDto | null;
  master?: UserOutDto | null;
  playCharacters?: SessionCharacterOutDto[] | null;
  expLogs?: ExpLogOutDto[] | null;
  currencyLogs?: CurrencyLogOutDto[] | null;
}

// ==============================================
// Session Characters
// ==============================================
export interface SessionCharacterInDto extends CommonInDto {
  sessionId?: number;
  characterId?: number;
}

export interface SessionCharacterOutDto extends CommonOutDto {
  sessionId?: number;
  characterId?: number;
  // Relations
  session?: SessionOutDto | null;
  character?: CharacterOutDto | null;
}

// ==============================================
// Exp Logs
// ==============================================
export interface ExpLogInDto extends CommonInDto {
  characterId?: number;
  sessionId?: number;
  reason?: string;
}

export interface ExpLogOutDto extends CommonOutDto {
  characterId?: number;
  sessionId?: number | null;
  amount?: number;
  reason?: string | null;
  beforeExp?: number | null;
  afterExp?: number | null;
  // Relations
  character?: CharacterOutDto | null;
  session?: SessionOutDto | null;
}

// ==============================================
// Currency Logs
// ==============================================
export interface CurrencyLogInDto extends CommonInDto {
  characterId?: number;
  sessionId?: number;
  reason?: string;
}

export interface CurrencyLogOutDto extends CommonOutDto {
  characterId?: number;
  sessionId?: number | null;
  amount?: number;
  reason?: string | null;
  beforeCurrency?: number | null;
  afterCurrency?: number | null;
  // Relations
  character?: CharacterOutDto | null;
  session?: SessionOutDto | null;
}
