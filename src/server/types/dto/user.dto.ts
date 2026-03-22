import type {
  CampaignMemberOutDto,
  CampaignOutDto,
  CharacterOutDto,
  DocOutDto,
  LogHistoryOutDto,
  SessionPlayerOutDto
} from '../dto.types';

import type { CommonInDto, CommonOutDto, CommonQueryDto, UserRole } from './common.dto';
import type { SessionLogOutDto } from './session-log.dto';

export interface UserQueryDto extends CommonQueryDto {
  discordId?: string;
  name?: string;
  role?: UserRole;
}

export interface UserCreateDto {
  discordId: string;
  name: string;
  role?: UserRole;
  creatorId?: number;
}

export interface UserUpdateDto extends CommonInDto {
  name?: string;
  role?: UserRole;
}

export interface UserOutDto extends CommonOutDto {
  discordId?: string;
  name?: string;
  role?: UserRole;

  campaigns?: CampaignOutDto[];
  campaignMembers?: CampaignMemberOutDto[];
  characters?: CharacterOutDto[];
  sessionPlayers?: SessionPlayerOutDto[];
  sessionLogs?: SessionLogOutDto[];
  docs?: DocOutDto[];
  logHistories?: LogHistoryOutDto[];
}
