import type {
  SessionOutDto,
  UserOutDto,
} from '../dto.types';
import type {
  CommonOutDto,
  CommonQueryDto,
} from './common.dto';

export interface SessionLogQueryDto extends CommonQueryDto {
  sessionId?: number;
  userId?: number;
  title?: string;
}

export interface SessionLogCreateDto {
  sessionId: number;
  title: string;
  content?: string | null;
  fileUrl?: string | null;
}

export interface SessionLogUpdateDto {
  title?: string;
  content?: string | null;
  fileUrl?: string | null;
  useYn?: 'Y' | 'N';
  deleteYn?: 'Y' | 'N';
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
