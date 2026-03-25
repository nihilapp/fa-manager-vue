export interface UserQueryDto extends CommonQueryDto {
  discordId?: string;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserCreateDto {
  discordId: string;
  name: string;
  role?: UserRole;
  status?: UserStatus;
  creatorId?: number;
}

export interface UserUpdateDto extends CommonInDto {
  name?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserOutDto extends CommonOutDto {
  discordId: string;
  name: string;
  role: UserRole;
  status: UserStatus;

  campaigns?: CampaignOutDto[];
  campaignMembers?: CampaignMemberOutDto[];
  characters?: CharacterOutDto[];
  sessionPlayers?: SessionPlayerOutDto[];
  sessionLogs?: SessionLogOutDto[];
  docs?: DocOutDto[];
  logHistories?: LogHistoryOutDto[];
}
