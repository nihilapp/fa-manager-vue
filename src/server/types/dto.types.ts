export * from './dto/common.dto';
export * from './dto/campaign.dto';
export * from './dto/session.dto';
export * from './dto/session-log.dto';
export * from './dto/player.dto';
export * from './dto/character.dto';
export * from './dto/currency-transaction.dto';
export * from './dto/log-history.dto';

import type {
  CommonInDto,
  CommonOutDto,
  DocStatus,
  DocVisibility
} from './dto/common.dto';
import type { PlayerOutDto } from './dto/player.dto';

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
  userId: number;
  title: string;
  description: string | null;
  category: string;
  status: DocStatus;
  visibility: DocVisibility;
  content: string | null;

  user: PlayerOutDto | null;
}
