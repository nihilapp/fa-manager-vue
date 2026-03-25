export interface CampaignQueryDto extends CommonQueryDto {
  userId?: number;
  name?: string;
  status?: Status;
}

export interface CampaignCreateDto {
  name: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}

export interface CampaignUpdateDto extends CommonInDto {
  name?: string;
  description?: string | null;
  status?: Status;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
}

export interface CampaignOutDto extends CommonOutDto {
  userId: number;
  name: string;
  description: string | null;
  status: Status;
  startDate: Date | string | null;
  endDate: Date | string | null;

  user: UserOutDto | null;
  members: CampaignMemberOutDto[];
  sessions: SessionOutDto[];
  characters: CharacterOutDto[];
}

export interface CampaignMemberCreateDto {
}

export interface CampaignMemberOutDto extends CommonOutDto {
  userId: number;
  campaignId: number;
  role: CampaignRole;

  user: UserOutDto | null;
  campaign: CampaignOutDto | null;
}
