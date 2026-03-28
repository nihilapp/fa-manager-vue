export interface PlayerQueryDto extends CommonQueryDto {
  discordId?: string;
  name?: string;
  role?: PlayerRole;
  status?: PlayerStatus;
}

export interface PlayerCreateDto {
  discordId: string;
  name: string;
  role?: PlayerRole;
  status?: PlayerStatus;
  creatorId?: number;
}

export interface PlayerUpdateDto extends CommonInDto {
  name?: string;
  role?: PlayerRole;
  status?: PlayerStatus;
}

export interface PlayerOutDto extends CommonOutDto {
  discordId: string;
  name: string;
  role: PlayerRole;
  status: PlayerStatus;

  campaigns?: CampaignOutDto[];
  campaignMembers?: CampaignMemberOutDto[];
  characters?: CharacterOutDto[];
  sessionPlayers?: SessionPlayerOutDto[];
  sessionLogs?: SessionLogOutDto[];
  docs?: DocOutDto[];
  logHistories?: LogHistoryOutDto[];
}
