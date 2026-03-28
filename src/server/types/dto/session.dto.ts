export interface SessionQueryDto extends CommonQueryDto {
  campaignId?: number;
  no?: number;
  name?: string;
  status?: Status | null;
}

export interface SessionCreateDto {
  campaignId: number;
  no: number;
  name: string;
  description?: string | null;
  maxPlayer?: number | null;
  rewardExp?: number | null;
  rewardGold?: number | null;
  status?: Status | null;
  playDate?: Date | string | null;
}

export interface SessionUpdateDto extends CommonInDto {
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
  campaignId: number;
  no: number;
  name: string;
  description: string | null;
  maxPlayer: number | null;
  rewardExp: number | null;
  rewardGold: number | null;
  status: Status | null;
  playDate: Date | string | null;

  campaign: CampaignOutDto | null;
  players: SessionPlayerOutDto[];
  logs: SessionLogOutDto[];
}

export interface SessionPlayerCreateDto {
  characterId: number;
}

export interface SessionPlayerOutDto extends CommonOutDto {
  sessionId: number;
  userId: number;
  characterId: number;
  role: SessionRole;

  session: SessionOutDto | null;
  user: PlayerOutDto | null;
  character: CharacterOutDto | null;
}
